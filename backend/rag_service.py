"""Managed RAG service client for HealthBridge (stdlib-only HTTP).

This is intentionally provider-agnostic: configure endpoints via environment vars.

Expected behavior:
- Upload PDF (multipart/form-data) to get `document_id`
- Query the document to get a text `context` snippet

Environment variables:
- RAG_BASE_URL: e.g. "https://api.ninjadoc.ai" (example)
- RAG_API_KEY: bearer token / API key (server-side only)
- RAG_UPLOAD_PATH: default "/documents" (override per provider)
- RAG_QUERY_PATH: default "/query" (override per provider)
"""

from __future__ import annotations

import asyncio
import json
import os
import uuid
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any, Optional

try:
    # When imported as a package
    from backend.env import load_dotenv
except Exception:  # pragma: no cover
    # Fallback when running locally as a script
    from env import load_dotenv  # type: ignore


class RagError(RuntimeError):
    """Raised when the RAG service returns an error or unexpected shape."""


class UnsupportedFileTypeError(RagError):
    """Raised when file is not a PDF."""


class EmptyRagResponseError(RagError):
    """Raised when RAG returns empty/blank context."""


def _json_loads_maybe(raw: str) -> dict[str, Any]:
    if not raw:
        return {}
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as e:
        raise RagError(f"RAG service returned non-JSON response: {raw[:2000]}") from e
    if not isinstance(parsed, dict):
        raise RagError("RAG service returned non-object JSON.")
    return parsed


def _sync_http_request(
    *,
    method: str,
    url: str,
    body: Optional[bytes],
    headers: dict[str, str],
    timeout_s: int = 90,
) -> tuple[int, str]:
    req = urllib.request.Request(url=url, data=body, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            return int(getattr(resp, "status", 200)), raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace") if getattr(e, "fp", None) else str(e)
        return int(e.code), raw


def _encode_multipart_formdata(fields: dict[str, str], files: dict[str, tuple[str, bytes, str]]) -> tuple[bytes, str]:
    """Create multipart/form-data body with stdlib only.

    files: {field_name: (filename, content_bytes, content_type)}
    Returns (body, content_type_header_value)
    """
    boundary = f"----HealthBridgeBoundary{uuid.uuid4().hex}"
    crlf = b"\r\n"
    parts: list[bytes] = []

    for name, value in fields.items():
        parts.append(f"--{boundary}".encode("utf-8"))
        parts.append(f'Content-Disposition: form-data; name="{name}"'.encode("utf-8"))
        parts.append(b"")
        parts.append(value.encode("utf-8"))

    for field_name, (filename, content, content_type) in files.items():
        parts.append(f"--{boundary}".encode("utf-8"))
        parts.append(
            f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"'.encode("utf-8")
        )
        parts.append(f"Content-Type: {content_type}".encode("utf-8"))
        parts.append(b"")
        parts.append(content)

    parts.append(f"--{boundary}--".encode("utf-8"))
    parts.append(b"")

    body = crlf.join(parts)
    content_type_header = f"multipart/form-data; boundary={boundary}"
    return body, content_type_header


@dataclass(frozen=True)
class RagResult:
    document_id: str
    context: str


class RagClient:
    def __init__(
        self,
        *,
        base_url: Optional[str] = None,
        api_key: Optional[str] = None,
        upload_path: Optional[str] = None,
        query_path: Optional[str] = None,
    ) -> None:
        # Load server-side `.env` (if present). Existing env vars keep priority.
        load_dotenv(override=False)

        self._base_url = (base_url or os.environ.get("RAG_BASE_URL", "")).rstrip("/")
        self._api_key = api_key or os.environ.get("RAG_API_KEY", "")
        self._upload_path = upload_path or os.environ.get("RAG_UPLOAD_PATH", "/documents")
        self._query_path = query_path or os.environ.get("RAG_QUERY_PATH", "/query")

        if not self._base_url:
            raise RagError("Missing RAG_BASE_URL environment variable.")
        if not self._api_key:
            raise RagError("Missing RAG_API_KEY environment variable.")

    async def ingest_and_get_context(self, *, pdf_bytes: bytes, filename: str, question: str) -> RagResult:
        """Upload a PDF, then retrieve context relevant to the question."""

        document_id = await self.upload_pdf_bytes(pdf_bytes=pdf_bytes, filename=filename)
        context = await self.get_context(document_id=document_id, question=question)
        return RagResult(document_id=document_id, context=context)

    async def upload_pdf_bytes(self, *, pdf_bytes: bytes, filename: str) -> str:
        """Upload a PDF and return the provider document_id."""

        if not filename.lower().endswith(".pdf"):
            raise UnsupportedFileTypeError("Only PDF uploads are supported.")
        if not pdf_bytes:
            raise RagError("Uploaded PDF is empty.")

        # 1) Upload document
        upload_url = f"{self._base_url}{self._upload_path}"
        body, content_type = _encode_multipart_formdata(
            fields={},
            files={"file": (filename, pdf_bytes, "application/pdf")},
        )
        status, raw = await asyncio.to_thread(
            _sync_http_request,
            method="POST",
            url=upload_url,
            body=body,
            headers={
                "Content-Type": content_type,
                "Accept": "application/json",
                "Authorization": f"Bearer {self._api_key}",
            },
        )
        if status >= 400:
            raise RagError(f"RAG upload failed: HTTP {status} {raw}")
        upload_payload = _json_loads_maybe(raw)
        document_id = upload_payload.get("document_id") or upload_payload.get("id") or ""
        if not isinstance(document_id, str) or not document_id.strip():
            raise RagError("RAG upload response missing document_id.")
        return document_id.strip()

    async def get_context(self, *, document_id: str, question: str) -> str:
        """Query provider for context relevant to a question."""

        if not document_id or not document_id.strip():
            raise RagError("document_id is required.")
        if not question or not question.strip():
            raise RagError("question is required.")

        document_id = document_id.strip()
        question = question.strip()

        # 2) Query for context
        query_url = f"{self._base_url}{self._query_path}"
        query_body = json.dumps({"document_id": document_id, "question": question}).encode("utf-8")
        q_status, q_raw = await asyncio.to_thread(
            _sync_http_request,
            method="POST",
            url=query_url,
            body=query_body,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json",
                "Authorization": f"Bearer {self._api_key}",
            },
        )
        if q_status >= 400:
            raise RagError(f"RAG query failed: HTTP {q_status} {q_raw}")
        query_payload = _json_loads_maybe(q_raw)
        context = query_payload.get("context") or query_payload.get("text") or ""
        if not isinstance(context, str) or not context.strip():
            raise EmptyRagResponseError("RAG returned empty context.")

        return context.strip()
