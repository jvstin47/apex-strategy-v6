"""
Application Configuration Module
Centralizes environment variables, deployment settings, logging setup, and runtime defaults.
"""

import logging
import os
from pathlib import Path
from typing import List


def _load_env_files() -> None:
    """Populate unset environment variables from local .env files if present."""
    backend_dir = Path(__file__).resolve().parents[2]
    candidates = [backend_dir.parent / ".env", backend_dir / ".env"]

    for env_path in candidates:
        if not env_path.is_file():
            continue
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


_load_env_files()


def _parse_bool(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _parse_origins(raw: str) -> List[str]:
    if not raw or raw.strip() == "*":
        return ["*"]
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


class Settings:
    """Application settings loaded from environment variables with safe defaults."""

    PROJECT_NAME: str = "F1 Monte Carlo Strategy Simulator v4"
    VERSION: str = "4.0.0"
    API_V1_PREFIX: str = "/api/v1"

    HOST: str = os.environ.get("HOST", "0.0.0.0")
    PORT: int = int(os.environ.get("PORT", 8005))
    DEBUG: bool = _parse_bool(os.environ.get("DEBUG", "false"))
    LOG_LEVEL: str = os.environ.get("LOG_LEVEL", "INFO").upper()

    ALLOWED_ORIGINS: List[str] = _parse_origins(
        os.environ.get("ALLOWED_ORIGINS", "*")
    )

    FASTF1_CACHE_DIR: str = os.environ.get("FASTF1_CACHE_DIR", "cache")


def configure_logging() -> None:
    """Configure application-wide structured console logging."""
    level = getattr(logging, settings.LOG_LEVEL, logging.INFO)
    root_logger = logging.getLogger()
    if not root_logger.handlers:
        logging.basicConfig(
            level=level,
            format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        )
    else:
        root_logger.setLevel(level)


settings = Settings()
