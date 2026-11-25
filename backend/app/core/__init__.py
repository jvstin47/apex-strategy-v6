"""Core module containing application configuration, logging, and exception handlers."""

from .config import settings, configure_logging
from .exceptions import (
    F1SimulatorError,
    CircuitNotFoundError,
    DriverNotFoundError,
    InvalidStrategyParameterError,
    SimulationExecutionError,
    f1_simulator_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    global_exception_handler,
)

__all__ = [
    "settings",
    "configure_logging",
    "F1SimulatorError",
    "CircuitNotFoundError",
    "DriverNotFoundError",
    "InvalidStrategyParameterError",
    "SimulationExecutionError",
    "f1_simulator_exception_handler",
    "validation_exception_handler",
    "http_exception_handler",
    "global_exception_handler",
]
