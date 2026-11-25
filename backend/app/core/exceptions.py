"""
Custom Exception Definitions & Global Exception Handlers
Provides uniform, structured JSON error responses across all API routes.
"""

import logging
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class F1SimulatorError(Exception):
    """Base domain exception for the F1 Strategy Simulator API."""

    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class CircuitNotFoundError(F1SimulatorError):
    """Raised when an unknown circuit track_id is requested."""

    def __init__(self, track_id: str):
        super().__init__(
            f"Unknown track_id: '{track_id}'",
            status_code=status.HTTP_404_NOT_FOUND,
        )
        self.track_id = track_id


class DriverNotFoundError(F1SimulatorError):
    """Raised when an unknown driver_id is explicitly requested."""

    def __init__(self, driver_id: str):
        super().__init__(
            f"Unknown driver_id: '{driver_id}'",
            status_code=status.HTTP_404_NOT_FOUND,
        )
        self.driver_id = driver_id


class InvalidStrategyParameterError(F1SimulatorError):
    """Raised when simulation or optimizer parameters violate domain constraints."""

    def __init__(self, detail: str):
        super().__init__(
            detail=detail,
            status_code=422,
        )


class SimulationExecutionError(F1SimulatorError):
    """Raised when the simulation or optimization engine encounters a runtime error."""

    def __init__(self, detail: str):
        super().__init__(
            f"Simulation execution error: {detail}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def _error_payload(status_code: int, error_type: str, detail: str, path: str) -> dict:
    return {
        "status": status_code,
        "error_type": error_type,
        "detail": detail,
        "path": path,
    }


async def f1_simulator_exception_handler(
    request: Request, exc: F1SimulatorError
) -> JSONResponse:
    """Handles all domain-specific F1SimulatorError exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content=_error_payload(
            exc.status_code, exc.__class__.__name__, exc.detail, request.url.path
        ),
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Formats Pydantic request validation errors into the standard ErrorResponse shape."""
    messages = []
    for err in exc.errors():
        loc = ".".join(str(part) for part in err.get("loc", []) if part != "body")
        msg = err.get("msg", "Invalid value")
        messages.append(f"{loc}: {msg}" if loc else msg)
    detail = "; ".join(messages) or "Invalid request payload."
    return JSONResponse(
        status_code=422,
        content=_error_payload(
            422,
            "RequestValidationError",
            detail,
            request.url.path,
        ),
    )


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """Formats FastAPI/Starlette HTTP exceptions into the standard ErrorResponse shape."""
    return JSONResponse(
        status_code=exc.status_code,
        content=_error_payload(
            exc.status_code,
            "HTTPException",
            str(exc.detail),
            request.url.path,
        ),
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler ensuring unhandled exceptions return clean JSON payloads."""
    logger.exception("Unhandled exception at %s", request.url.path, exc_info=exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=_error_payload(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            exc.__class__.__name__,
            "An unexpected internal server error occurred.",
            request.url.path,
        ),
    )
