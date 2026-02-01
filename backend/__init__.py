"""HealthBridge backend package.

Keep modules small and testable:
- `chat.py` exposes the FastAPI app + /chat endpoint
- `gemini_client.py` talks to Gemini via the official `google.genai` SDK
- `rag_service.py` talks to a managed RAG service via REST
"""

