from __future__ import annotations

import asyncio
import os
from typing import Any, Optional
from google.genai import Client


class GeminiClient:
    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self._api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self._api_key:
            raise RuntimeError("Missing GEMINI_API_KEY")

        self._model_name = model_name or os.getenv(
            "GEMINI_MODEL", "models/gemini-flash-latest"
        )

        self.client = Client(api_key=self._api_key)

    async def answer(self, system_prompt: str, message: str) -> str:
        prompt = system_prompt.strip() + "\n\n" + message.strip()

        def _sync():
            resp = self.client.models.generate_content(
                model=self._model_name,
                contents=prompt,
            )
            return resp.text.strip()

        return await asyncio.to_thread(_sync)
