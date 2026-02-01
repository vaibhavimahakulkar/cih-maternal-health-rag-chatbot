"""PDF upload + context retrieval helper for HealthBridge.

This module is designed to be imported by `backend/chat.py` and unit-tested easily.

Responsibilities:
- Validate uploaded PDFs from the `/chat` endpoint
- Upload PDFs to a managed RAG service (e.g., NinjaDoc)
- Retrieve relevant context for question answering

Security:
- API keys are read from server-side environment variables only.
- Do NOT expose keys to the frontend.
"""

from __future__ import annotations

from typing import Optional

from fastapi import UploadFile

try:
    from backend.rag_service import EmptyRagResponseError, RagClient, RagError, UnsupportedFileTypeError
except Exception:  # pragma: no cover
    from rag_service import EmptyRagResponseError, RagClient, RagError, UnsupportedFileTypeError  # type: ignore


def _is_pdf(filename: str, content_type: Optional[str]) -> bool:
    """Best-effort PDF validation based on filename/content-type."""
    ct = (content_type or "").lower()
    return filename.lower().endswith(".pdf") or ct == "application/pdf"


async def upload_pdf(file: UploadFile) -> str:
    """Upload a PDF from FastAPI `UploadFile` and return `document_id`.

    Raises:
    - UnsupportedFileTypeError: if file isn't a PDF
    - RagError: for empty documents or provider failures
    """
    filename = file.filename or "upload.pdf"
    if not _is_pdf(filename, file.content_type):
        raise UnsupportedFileTypeError("Only PDF uploads are supported.")

    # Read bytes from the uploaded file (async).
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise RagError("Uploaded PDF is empty.")

    # Upload using the managed RAG client.
    rag = RagClient()
    return await rag.upload_pdf_bytes(pdf_bytes=pdf_bytes, filename=filename)


async def get_context(document_id: str, question: str) -> str:
    """Retrieve relevant context for a question given a RAG `document_id`.

    Returns:
    - context text to ground downstream answering

    Raises:
    - EmptyRagResponseError: if provider returns empty context
    - RagError: for invalid inputs or provider failures
    """
    rag = RagClient()
    # The RAG client normalizes/validates `document_id` and `question`.
    return await rag.get_context(document_id=document_id, question=question)
