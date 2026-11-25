"""
Race Control Regime Simulator (v6)
Models Green Flag, Virtual Safety Car (VSC), Full Safety Car (SC), and Red Flag events
with realistic duration persistence, pace deltas, pit-loss discounts, and field bunching.
"""

from typing import Dict
import numpy as np

REGIME_GREEN = 0
REGIME_VSC = 1
REGIME_SC = 2
REGIME_RED_FLAG = 3

REGIME_NAMES: Dict[int, str] = {
    REGIME_GREEN: "green",
    REGIME_VSC: "vsc",
    REGIME_SC: "sc",
    REGIME_RED_FLAG: "red_flag",
}

# Pit-stop time loss under each race-control regime (seconds)
REGIME_PIT_LOSS_OVERRIDE: Dict[int, float] = {
    REGIME_VSC: 12.0,
    REGIME_SC: 8.0,
    REGIME_RED_FLAG: 0.0,  # Free tire change under Red Flag suspension
}


def generate_race_control_matrix(
    num_simulations: int,
    num_laps: int,
    sc_probability: float = 0.04,
    vsc_probability: float = 0.03,
    red_flag_probability: float = 0.005,
    seed: int = 42,
) -> np.ndarray:
    """Generate a (num_simulations, num_laps) matrix of race-control regimes.

    Regimes:
      0 = Green flag
      1 = Virtual Safety Car (1-2 laps)
      2 = Full Safety Car (2-4 laps, field bunching)
      3 = Red Flag (1 lap stoppage, free tire change)
    """
    rng = np.random.default_rng(seed)
    matrix = np.zeros((num_simulations, num_laps), dtype=np.int32)

    if sc_probability <= 0 and vsc_probability <= 0 and red_flag_probability <= 0:
        return matrix

    for sim_idx in range(num_simulations):
        lap = 0
        while lap < num_laps:
            roll = rng.random()
            if red_flag_probability > 0 and roll < red_flag_probability:
                matrix[sim_idx, lap] = REGIME_RED_FLAG
                lap += 1
            elif sc_probability > 0 and roll < red_flag_probability + sc_probability:
                duration = int(rng.integers(2, 5))
                end = min(num_laps, lap + duration)
                matrix[sim_idx, lap:end] = REGIME_SC
                lap = end
            elif (
                vsc_probability > 0
                and roll < red_flag_probability + sc_probability + vsc_probability
            ):
                duration = int(rng.integers(1, 3))
                end = min(num_laps, lap + duration)
                matrix[sim_idx, lap:end] = REGIME_VSC
                lap = end
            else:
                lap += 1

    return matrix
