"""
Multi-Circuit Empirical Calibration Catalog (v6)
Stores pre-computed FastF1-aligned baseline parameters across all 5 supported Grand Prix circuits
so calibration works instantaneously for every track even without live FastF1 network calls.
"""

from typing import Dict, Any

CIRCUIT_CALIBRATION_CATALOG: Dict[str, Dict[str, Any]] = {
    "bahrain": {
        "track_id": "bahrain",
        "track": "Bahrain International Circuit",
        "year": 2023,
        "base_lap_time": 96.2,
        "pit_stop_time_loss": 21.8,
        "num_laps": 57,
        "compounds": {
            "soft": {"wear_rate": 0.155, "cliff_threshold": 14, "cliff_penalty": 0.035},
            "medium": {"wear_rate": 0.085, "cliff_threshold": 23, "cliff_penalty": 0.022},
            "hard": {"wear_rate": 0.042, "cliff_threshold": 36, "cliff_penalty": 0.012},
        },
        "validation_actual_winner_time_seconds": 5635.8,
        "validation_actual_winner_driver": "Max Verstappen (VER)",
    },
    "silverstone": {
        "track_id": "silverstone",
        "track": "Silverstone Circuit",
        "year": 2023,
        "base_lap_time": 90.3,
        "pit_stop_time_loss": 20.4,
        "num_laps": 52,
        "compounds": {
            "soft": {"wear_rate": 0.165, "cliff_threshold": 13, "cliff_penalty": 0.038},
            "medium": {"wear_rate": 0.092, "cliff_threshold": 22, "cliff_penalty": 0.024},
            "hard": {"wear_rate": 0.044, "cliff_threshold": 35, "cliff_penalty": 0.012},
        },
        "validation_actual_winner_time_seconds": 5116.9,
        "validation_actual_winner_driver": "Max Verstappen (VER)",
    },
    "monza": {
        "track_id": "monza",
        "track": "Autodromo Nazionale Monza",
        "year": 2023,
        "base_lap_time": 82.8,
        "pit_stop_time_loss": 24.1,
        "num_laps": 51,
        "compounds": {
            "soft": {"wear_rate": 0.132, "cliff_threshold": 16, "cliff_penalty": 0.028},
            "medium": {"wear_rate": 0.075, "cliff_threshold": 26, "cliff_penalty": 0.018},
            "hard": {"wear_rate": 0.036, "cliff_threshold": 40, "cliff_penalty": 0.009},
        },
        "validation_actual_winner_time_seconds": 4421.1,
        "validation_actual_winner_driver": "Max Verstappen (VER)",
    },
    "monaco": {
        "track_id": "monaco",
        "track": "Circuit de Monaco",
        "year": 2023,
        "base_lap_time": 74.6,
        "pit_stop_time_loss": 19.4,
        "num_laps": 78,
        "compounds": {
            "soft": {"wear_rate": 0.105, "cliff_threshold": 20, "cliff_penalty": 0.020},
            "medium": {"wear_rate": 0.062, "cliff_threshold": 32, "cliff_penalty": 0.014},
            "hard": {"wear_rate": 0.030, "cliff_threshold": 48, "cliff_penalty": 0.008},
        },
        "validation_actual_winner_time_seconds": 6531.9,
        "validation_actual_winner_driver": "Max Verstappen (VER)",
    },
    "singapore": {
        "track_id": "singapore",
        "track": "Marina Bay Street Circuit",
        "year": 2023,
        "base_lap_time": 98.4,
        "pit_stop_time_loss": 23.2,
        "num_laps": 62,
        "compounds": {
            "soft": {"wear_rate": 0.128, "cliff_threshold": 17, "cliff_penalty": 0.026},
            "medium": {"wear_rate": 0.072, "cliff_threshold": 28, "cliff_penalty": 0.016},
            "hard": {"wear_rate": 0.038, "cliff_threshold": 42, "cliff_penalty": 0.010},
        },
        "validation_actual_winner_time_seconds": 6457.4,
        "validation_actual_winner_driver": "Carlos Sainz (SAI)",
    },
}
