"""FastAPI app for HealthBridge backend.

This module provides an async, import-safe FastAPI application exposing a single
POST /chat endpoint that supports optional PDF uploads for RAG (retrieval-augmented
generation) and a cookie-based session to maintain short-term chat history.

Design goals / constraints:
- No network calls or API key access at module import time (ensures /docs loads fast).
- Gemini and RAG clients are instantiated inside endpoint functions only.
- Errors are mapped to appropriate HTTP status codes.
- Minimal blocking work at import time; use asyncio.to_thread for sync helpers.

Usage:
- POST /chat with multipart/form-data:
  - message (string, required)
  - file (optional PDF)
- Returns JSON: {"answer": "<AI response>"}
"""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, File, Form, HTTPException, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os


# Note: Gemini client will be instantiated inside endpoint handlers to avoid
# reading GEMINI_API_KEY at module import time.
from backend.pdf_rag_helper import get_context, upload_pdf
from backend.rag_service import (
    EmptyRagResponseError,
    RagError,
    UnsupportedFileTypeError,
)


GEMINI_SYSTEM_PROMPT = """You are a maternal health AI assistant designed for clinics.
- Support pregnant women with non-emergency health guidance.
- Analyze pregnancy-related symptoms and uploaded medical reports.
- Identify potential maternal health risks such as anemia, gestational diabetes, hypertension, or warning signs.
- Do NOT give diagnoses or prescriptions.
- Clearly label risk levels as Low, Moderate, or High.
- Use calm, empathetic language.
- Always recommend consulting a gynecologist for serious symptoms.

Disclaimer: This information is for general guidance only and not a medical diagnosis."""

load_dotenv()  # loads backend/.env automatically
print("GEMINI_API_KEY loaded:", bool(os.getenv("GEMINI_API_KEY")))



# -----------------------------
# Basic session (cookie) support
# -----------------------------

_SESSION_COOKIE_NAME = "hb_session"
_SESSION_TTL_S = 6 * 60 * 60  # 6 hours
_MAX_TURNS_PER_SESSION = 10

app = FastAPI()

# Allow requests from your frontend
origins = [
    "http://localhost:5173",  # add the port your frontend is running on
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@dataclass(frozen=True)
class GeminiChatTurn:
    """Optional previous turn for chat-style continuity."""

    role: str  # expected: "user" | "model"
    text: str


# In-memory store: {session_id: {"updated_at": float, "turns": [GeminiChatTurn, ...]}}
_SESSIONS: Dict[str, Dict[str, Any]] = {}


def _get_or_create_session_id(request: Request, response: Response) -> str:
    session_id = request.cookies.get(_SESSION_COOKIE_NAME)
    if not session_id:
        session_id = str(uuid.uuid4())
        # HttpOnly prevents frontend JS from reading it (better security posture).
        response.set_cookie(
            key=_SESSION_COOKIE_NAME,
            value=session_id,
            httponly=True,
            samesite="lax",
        )
    return session_id


def _cleanup_sessions(now: float) -> None:
    # Lightweight cleanup to avoid unbounded growth.
    expired = [sid for sid, v in _SESSIONS.items() if now - float(v.get("updated_at", 0)) > _SESSION_TTL_S]
    for sid in expired:
        _SESSIONS.pop(sid, None)


def _append_turn(session_id: str, turn: GeminiChatTurn) -> None:
    now = time.time()
    _cleanup_sessions(now)
    record = _SESSIONS.setdefault(session_id, {"updated_at": now, "turns": []})
    record["updated_at"] = now
    record["turns"].append(turn)
    # Keep only the last N turns for prompt size control.
    record["turns"] = record["turns"][-_MAX_TURNS_PER_SESSION :]


def _get_history(session_id: str) -> List[GeminiChatTurn]:
    record = _SESSIONS.get(session_id) or {}
    turns = record.get("turns") or []
    return [t for t in turns if isinstance(t, GeminiChatTurn)]


# ---------------
# FastAPI app init
# ---------------

app = FastAPI(title="HealthBridge Backend", version="0.1.0")

# Dev-friendly CORS for local Vite; tighten for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chat")
async def chat(
    request: Request,
    response: Response,
    message: str = Form(...),                           # required message
    file: Optional[UploadFile] | None = File(None, media_type="application/pdf")  
) -> Dict[str, str]:
    """Chat endpoint supporting optional PDF uploads for RAG."""

    # --- Validate message ---
    if message is None or not message.strip():
        raise HTTPException(status_code=400, detail="Missing message.")
    user_message = message.strip()

    # Establish / reuse session cookie for continuity.
    session_id = _get_or_create_session_id(request, response)

    # --- If PDF uploaded, use managed RAG service ---
    if file is not None:
        try:
            document_id = await upload_pdf(file)
            context = await get_context(document_id=document_id, question=user_message)
        except UnsupportedFileTypeError as e:
            raise HTTPException(status_code=415, detail=str(e)) from e
        except EmptyRagResponseError as e:
            raise HTTPException(status_code=502, detail=str(e)) from e
        except RagError as e:
            raise HTTPException(status_code=502, detail=f"RAG service error: {e}") from e

        augmented_prompt = (
            GEMINI_SYSTEM_PROMPT
            + "\n\nYou have an uploaded medical document. Use ONLY the provided context to inform your answer.\n"
            + "If the context does not contain enough information, say so and recommend consulting a clinician.\n\n"
            + f"Document ID: {document_id}\n"
            + "Context:\n"
            + context
        )

        try:
            # Instantiate Gemini client at runtime so API key is read inside the request.
            from backend.gemini_client import GeminiClient  # Local import to avoid import-time side-effects

            gemini = GeminiClient()
            # Attach recent conversation history to the message to provide continuity.
            history = _get_history(session_id)
            history_text = "\n".join([f"{t.role}: {t.text}" for t in history])
            message_with_history = (history_text + "\n\n" + user_message) if history_text else user_message

            answer = await gemini.answer(system_prompt=augmented_prompt, message=message_with_history)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Gemini error: {e}") from e

        _append_turn(session_id, GeminiChatTurn(role="user", text=user_message))
        _append_turn(session_id, GeminiChatTurn(role="model", text=answer))
        return {"answer": answer}

    # --- No PDF: answer with Gemini using system prompt + session history ---
    try:
        from backend.gemini_client import GeminiClient  # Local import to avoid import-time side-effects
        
        gemini = GeminiClient()
        history = _get_history(session_id)
        history_text = "\n".join([f"{t.role}: {t.text}" for t in history])
        message_with_history = (history_text + "\n\n" + user_message) if history_text else user_message

        answer = await gemini.answer(system_prompt=GEMINI_SYSTEM_PROMPT, message=message_with_history)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini error: {e}") from e

    _append_turn(session_id, GeminiChatTurn(role="user", text=user_message))
    _append_turn(session_id, GeminiChatTurn(role="model", text=answer))
    return {"answer": answer}

@app.post("/test-upload")
async def test_upload(file: UploadFile = File(...)):
    return {"filename": file.filename}

