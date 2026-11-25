"""
Multi-Car Virtual Grid & Overtaking Model (v6)
Simulates a 10-car pack around the ego car using circuit-specific overtaking difficulty
and DRS zones to evaluate rejoin traffic penalties, position changes, and undercut windows.
"""

from typing import Dict, Any, List
import math
import numpy as np

from .tire_model import calculate_tire_degradation
from ..data.tracks import get_track


def compute_overtake_probability(
    pace_advantage: float,
    tire_age_delta: int,
    overtake_difficulty_index: float,
    drs_zones: int = 2,
) -> float:
    """Compute per-lap overtake probability using pace/tire delta and track layout.

    overtake_difficulty_index: 0.05 (Monaco) to 0.80 (Monza).
    """
    drs_bonus = 0.08 * min(drs_zones, 4)
    effective_delta = pace_advantage + (0.04 * tire_age_delta)
    logit = (effective_delta * 1.4) + (overtake_difficulty_index * 2.0) + drs_bonus - 1.6
    prob = 1.0 / (1.0 + math.exp(-max(-10.0, min(10.0, logit))))
    return round(float(prob), 4)


def simulate_virtual_grid(
    track_id: str,
    ego_compounds: List[str],
    ego_pit_laps: List[int],
    ego_start_position: int = 5,
    num_rivals: int = 9,
    num_simulations: int = 1000,
    seed: int = 42,
) -> Dict[str, Any]:
    """Simulate a 10-car virtual field to estimate finish positions, overtakes, and traffic loss."""
    track = get_track(track_id)
    num_laps = track["num_laps"]
    base_lap = track["base_lap_time"]
    pit_loss = track["pit_stop_time_loss"]
    overtake_idx = track.get("overtake_difficulty_index", 0.5)
    drs_zones = track.get("drs_zones", 2)
    wear_mult = track.get("tire_wear_multiplier", {})

    rng = np.random.default_rng(seed)

    # Generate rival stints around diverse 1-stop & 2-stop windows
    rival_pit_laps = []
    rival_compounds = []
    for r_idx in range(num_rivals):
        base_pit = int(np.clip(num_laps * (0.32 + 0.04 * (r_idx % 5)), 10, num_laps - 8))
        rival_pit_laps.append([base_pit])
        rival_compounds.append(["medium", "hard"] if r_idx % 2 == 0 else ["soft", "hard"])

    finish_positions = np.zeros(num_simulations, dtype=np.int32)
    overtakes_completed = np.zeros(num_simulations, dtype=np.int32)
    traffic_loss_totals = np.zeros(num_simulations, dtype=np.float64)

    for sim_idx in range(num_simulations):
        # Cumulative times for ego + rivals (ego at index 0)
        total_cars = num_rivals + 1
        cum_times = np.array(
            [(ego_start_position - 1) * 1.2]
            + [i * 1.2 for i in range(total_cars) if i != (ego_start_position - 1)],
            dtype=np.float64,
        )

        ego_stint = 0
        ego_age = 0
        ego_pit_set = set(ego_pit_laps)
        rival_ages = [0] * num_rivals
        rival_stints = [0] * num_rivals

        for lap in range(1, num_laps + 1):
            # Ego lap
            if lap in ego_pit_set and ego_stint + 1 < len(ego_compounds):
                ego_stint += 1
                ego_age = 1
                ego_pit_cost = pit_loss + float(rng.normal(0.0, track.get("pit_loss_variance", 0.6)))
            else:
                ego_age += 1
                ego_pit_cost = 0.0

            ego_comp = ego_compounds[min(ego_stint, len(ego_compounds) - 1)]
            ego_deg = calculate_tire_degradation(ego_comp, ego_age) * wear_mult.get(ego_comp, 1.0)
            ego_pace = base_lap + ego_deg + ego_pit_cost + float(rng.normal(0.0, 0.15))

            # Rival laps
            rival_paces = np.zeros(num_rivals, dtype=np.float64)
            for r in range(num_rivals):
                if lap in rival_pit_laps[r] and rival_stints[r] + 1 < len(rival_compounds[r]):
                    rival_stints[r] += 1
                    rival_ages[r] = 1
                    r_pit = pit_loss + float(rng.normal(0.0, 0.6))
                else:
                    rival_ages[r] += 1
                    r_pit = 0.0
                r_comp = rival_compounds[r][rival_stints[r]]
                r_deg = calculate_tire_degradation(r_comp, rival_ages[r]) * wear_mult.get(r_comp, 1.0)
                rival_paces[r] = base_lap + r_deg + r_pit + float(rng.normal(0.0, 0.18))

            # Check traffic / overtake interaction for ego against car immediately ahead
            ego_time_before = cum_times[0]
            rivals_ahead = [
                (r, cum_times[r + 1])
                for r in range(num_rivals)
                if cum_times[r + 1] < ego_time_before and (ego_time_before - cum_times[r + 1]) < 1.5
            ]

            prev_pos = 1 + int(np.sum(cum_times[1:] < cum_times[0]))
            cum_times[0] += ego_pace
            cum_times[1:] += rival_paces

            if rivals_ahead:
                nearest_r, _ = max(rivals_ahead, key=lambda x: x[1])
                pace_adv = rival_paces[nearest_r] - ego_pace
                pass_prob = compute_overtake_probability(
                    pace_advantage=pace_adv,
                    tire_age_delta=rival_ages[nearest_r] - ego_age,
                    overtake_difficulty_index=overtake_idx,
                    drs_zones=drs_zones,
                )
                if cum_times[0] < cum_times[nearest_r + 1] and rng.random() > pass_prob:
                    # Stuck in dirty air behind rival
                    dirty_air_delay = 0.35 + (1.0 - overtake_idx) * 0.45
                    cum_times[0] = cum_times[nearest_r + 1] + 0.35
                    traffic_loss_totals[sim_idx] += dirty_air_delay

            new_pos = 1 + int(np.sum(cum_times[1:] < cum_times[0]))
            if new_pos < prev_pos:
                overtakes_completed[sim_idx] += prev_pos - new_pos

        finish_positions[sim_idx] = 1 + int(np.sum(cum_times[1:] < cum_times[0]))

    pos_counts = {
        f"P{pos}": int(np.sum(finish_positions == pos))
        for pos in range(1, num_rivals + 2)
    }

    return {
        "track_id": track_id,
        "start_position": ego_start_position,
        "mean_finish_position": round(float(np.mean(finish_positions)), 2),
        "podium_probability_pct": round(float(np.mean(finish_positions <= 3) * 100), 2),
        "win_probability_pct": round(float(np.mean(finish_positions == 1) * 100), 2),
        "mean_overtakes": round(float(np.mean(overtakes_completed)), 2),
        "mean_traffic_loss_seconds": round(float(np.mean(traffic_loss_totals)), 2),
        "overtake_difficulty_index": overtake_idx,
        "position_distribution": pos_counts,
    }
