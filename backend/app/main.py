"""
FastAPI Application Factory & Entrypoint
Configures middleware, logging, unified exception handlers, and mounts domain routers.
"""

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from .core.config import settings, configure_logging
from .core.exceptions import (
    F1SimulatorError,
    f1_simulator_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    global_exception_handler,
)
from .api.routes import (
    system_router,
    circuits_router,
    drivers_router,
    simulation_router,
    optimization_router,
    telemetry_router,
    replay_router,
)


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    configure_logging()

    app = FastAPI(
        title=f"{settings.PROJECT_NAME} API",
        description=(
            "N-stop Monte Carlo engine simulating F1 race strategy variance "
            "including Safety Cars, weather Markov chains, and real-time MCTS replanning."
        ),
        version=settings.VERSION,
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global exception handlers
    app.add_exception_handler(F1SimulatorError, f1_simulator_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)

    # Primary endpoints (unversioned root for full backward compatibility)
    app.include_router(system_router)
    app.include_router(circuits_router)
    app.include_router(drivers_router)
    app.include_router(simulation_router)
    app.include_router(optimization_router)
    app.include_router(telemetry_router)
    app.include_router(replay_router)

    # Scalable versioned API prefix (/api/v1/...)
    app.include_router(system_router, prefix=settings.API_V1_PREFIX)
    app.include_router(circuits_router, prefix=settings.API_V1_PREFIX)
    app.include_router(drivers_router, prefix=settings.API_V1_PREFIX)
    app.include_router(simulation_router, prefix=settings.API_V1_PREFIX)
    app.include_router(optimization_router, prefix=settings.API_V1_PREFIX)
    app.include_router(telemetry_router, prefix=settings.API_V1_PREFIX)
    app.include_router(replay_router, prefix=settings.API_V1_PREFIX)

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
