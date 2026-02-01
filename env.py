"""Minimal .env loader (stdlib-only).

Why:
- Keep API keys server-side and out of the frontend.
- Avoid adding non-stdlib dependencies just for dotenv parsing.

Behavior:
- Loads variables from (in order):
  1) `backend/.env`
  2) project-root `.env`
- By default, does NOT override variables already present in the process env.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Iterable, Optional


def _parse_dotenv_line(line: str) -> Optional[tuple[str, str]]:
    """Parse a single KEY=VALUE line. Returns None for blanks/comments/invalid."""
    s = line.strip()
    if not s or s.startswith("#"):
        return None

    # Support `export KEY=VALUE`
    if s.lower().startswith("export "):
        s = s[7:].strip()

    if "=" not in s:
        return None

    key, value = s.split("=", 1)
    key = key.strip()
    value = value.strip()
    if not key:
        return None

    # Strip optional surrounding quotes
    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
        value = value[1:-1]

    # Very small convenience: allow "\n" in values.
    value = value.replace("\\n", "\n")

    return key, value


def load_dotenv(
    *,
    override: bool = False,
    extra_paths: Optional[Iterable[Path]] = None,
) -> None:
    """Load `.env`-style files into `os.environ`.

    - **override=False** keeps explicitly-set environment variables higher priority.
    - Missing files are ignored.
    """
    backend_dir = Path(__file__).resolve().parent
    root_dir = backend_dir.parent

    paths = [
        backend_dir / ".env",
        root_dir / ".env",
    ]
    if extra_paths:
        paths.extend(list(extra_paths))

    for p in paths:
        try:
            content = p.read_text(encoding="utf-8")
        except FileNotFoundError:
            continue
        except OSError:
            # Ignore unreadable dotenv files; callers can still rely on process env.
            continue

        for line in content.splitlines():
            parsed = _parse_dotenv_line(line)
            if not parsed:
                continue
            key, value = parsed
            # If the process environment already defines the key, respect it unless:
            # - caller requested override=True, OR
            # - the existing value is empty (common on Windows when a var exists but isn't set properly)
            if not override and key in os.environ and os.environ.get(key, "") != "":
                continue
            os.environ[key] = value

