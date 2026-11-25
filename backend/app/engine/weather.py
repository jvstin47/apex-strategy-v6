"""
Weather Markov Chain and Compound Penalty Module
Models track wetness transitions (dry, damp, wet) and cross-compound performance multipliers.
"""

from typing import Dict, Optional
import numpy as np

WEATHER_STATES: Dict[str, int] = {"dry": 0, "damp": 1, "wet": 2}
WEATHER_NAMES: Dict[int, str] = {0: "dry", 1: "damp", 2: "wet"}

WEATHER_COMPOUNDS: Dict[str, Dict[str, float]] = {
    "intermediate": {"wear_rate": 0.10, "cliff_threshold": 30, "cliff_penalty": 0.015},
    "wet": {"wear_rate": 0.06, "cliff_threshold": 45, "cliff_penalty": 0.010},
}

TRANSITION_MATRIX: np.ndarray = np.array([
    [0.97, 0.03, 0.00],  # from dry
    [0.15, 0.70, 0.15],  # from damp
    [0.05, 0.20, 0.75],  # from wet
])


def generate_weather_matrix(
    num_simulations: int,
    num_laps: int,
    start_state: str = "dry",
    seed: Optional[int] = None,
) -> np.ndarray:
    """Generate a (num_simulations, num_laps) matrix of weather states (0=dry, 1=damp, 2=wet).

    Sequentially steps through laps while vectorizing state transitions across simulations.
    """
    if seed is not None:
        np.random.seed(seed)

    start_idx = WEATHER_STATES.get(start_state, 0)
    weather_matrix = np.zeros((num_simulations, num_laps), dtype=np.int8)
    weather_matrix[:, 0] = start_idx

    cum_trans = np.cumsum(TRANSITION_MATRIX, axis=1)

    for lap in range(1, num_laps):
        current_states = weather_matrix[:, lap - 1]
        rand_vals = np.random.random(num_simulations)

        for state_idx in range(3):
            mask = current_states == state_idx
            if not np.any(mask):
                continue
            state_rands = rand_vals[mask]
            next_states = np.searchsorted(cum_trans[state_idx], state_rands)
            next_states = np.clip(next_states, 0, 2)
            weather_matrix[mask, lap] = next_states

    return weather_matrix


def compute_weather_compound_penalty(compound: str, weather_state: int) -> float:
    """Calculate lap time multiplier based on compound and track wetness state.

    1.0 = optimal condition, >1.0 = cross-condition penalty.
    """
    weather_name = WEATHER_NAMES.get(weather_state, "dry")

    if weather_name == "dry":
        if compound == "intermediate":
            return 1.25
        elif compound == "wet":
            return 1.40
        else:
            return 1.0
    elif weather_name == "damp":
        if compound == "intermediate":
            return 1.0
        elif compound == "wet":
            return 1.10
        else:
            return 1.35
    elif weather_name == "wet":
        if compound == "wet":
            return 1.0
        elif compound == "intermediate":
            return 1.20
        else:
            return 2.5

    return 1.0


def compute_weather_crossover_curve(
    base_lap_time: float = 94.0,
    tire_age: int = 5,
) -> list:
    """Compute lap time curves across track wetness (0.0 dry -> 1.0 full wet).

    Identifies the crossover wetness points where Intermediates beat Slicks
    and Full Wets beat Intermediates.
    """
    from .tire_model import calculate_tire_degradation

    slick_deg = calculate_tire_degradation("medium", tire_age)
    inter_deg = 0.06 * tire_age
    wet_deg = 0.04 * tire_age

    points = []
    for step in range(0, 11):
        wetness = round(step * 0.1, 2)
        # Smooth interpolation across dry (0.0), damp (0.5), and full wet (1.0)
        if wetness <= 0.5:
            t = wetness / 0.5
            slick_mult = 1.0 + t * 0.35
            inter_mult = 1.25 - t * 0.25
            wet_mult = 1.40 - t * 0.30
        else:
            t = (wetness - 0.5) / 0.5
            slick_mult = 1.35 + t * 1.15
            inter_mult = 1.0 + t * 0.20
            wet_mult = 1.10 - t * 0.10

        points.append({
            "wetness": wetness,
            "wetness_pct": int(round(wetness * 100)),
            "slick_time": round(base_lap_time * slick_mult + slick_deg, 2),
            "intermediate_time": round(base_lap_time * inter_mult + inter_deg, 2),
            "wet_time": round(base_lap_time * wet_mult + wet_deg, 2),
        })

    return points
