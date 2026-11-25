"""
OpenF1 Historical Race Replay & Counterfactual Service (v6)
Provides lap-by-lap historical race timelines from the OpenF1 API (with curated offline
fallbacks) and runs Hybrid MCTS counterfactual "What-If" comparisons at any lap.
"""

from typing import Dict, Any, List, Optional
import httpx

from .mcts import MCTSState, MCTSSolver
from ..data.tracks import get_track
from ..data.drivers import get_driver

OPENF1_BASE_URL = "https://api.openf1.org/v1"

CURATED_REPLAY_SESSIONS: Dict[str, Dict[str, Any]] = {
    "bahrain_2023": {
        "session_id": "bahrain_2023",
        "openf1_session_key": 7953,
        "name": "2023 Bahrain Grand Prix",
        "track_id": "bahrain",
        "driver_id": "ver",
        "winner": "Max Verstappen",
        "actual_strategy": "Soft (L1-14) → Soft (L15-36) → Hard (L37-57)",
        "actual_time_seconds": 5635.8,
        "events": [
            {"lap": 14, "type": "pit", "compound": "soft", "note": "Undercut protection pit stop"},
            {"lap": 36, "type": "pit", "compound": "hard", "note": "Final stint to chequered flag"},
            {"lap": 41, "type": "vsc", "compound": None, "note": "VSC deployed for Leclerc retirement"},
        ],
        "stints": [
            {"start_lap": 1, "end_lap": 14, "compound": "soft"},
            {"start_lap": 15, "end_lap": 36, "compound": "soft"},
            {"start_lap": 37, "end_lap": 57, "compound": "hard"},
        ],
    },
    "silverstone_2023": {
        "session_id": "silverstone_2023",
        "openf1_session_key": 9126,
        "name": "2023 British Grand Prix",
        "track_id": "silverstone",
        "driver_id": "nor",
        "winner": "Max Verstappen (Norris P2)",
        "actual_strategy": "Medium (L1-33) → Hard (L34-52)",
        "actual_time_seconds": 5120.7,
        "events": [
            {"lap": 33, "type": "sc", "compound": None, "note": "Safety Car for Magnussen engine fire"},
            {"lap": 33, "type": "pit", "compound": "hard", "note": "Cheap SC pit stop (Hard instead of Soft)"},
        ],
        "stints": [
            {"start_lap": 1, "end_lap": 33, "compound": "medium"},
            {"start_lap": 34, "end_lap": 52, "compound": "hard"},
        ],
    },
    "singapore_2023": {
        "session_id": "singapore_2023",
        "openf1_session_key": 9165,
        "name": "2023 Singapore Grand Prix",
        "track_id": "singapore",
        "driver_id": "sai",
        "winner": "Carlos Sainz",
        "actual_strategy": "Medium (L1-20) → Hard (L21-62)",
        "actual_time_seconds": 6457.4,
        "events": [
            {"lap": 20, "type": "sc", "compound": None, "note": "Safety Car for Sargeant wall contact"},
            {"lap": 20, "type": "pit", "compound": "hard", "note": "Double-stack SC pit window"},
            {"lap": 44, "type": "vsc", "compound": None, "note": "VSC for Ocon gearbox issue"},
        ],
        "stints": [
            {"start_lap": 1, "end_lap": 20, "compound": "medium"},
            {"start_lap": 21, "end_lap": 62, "compound": "hard"},
        ],
    },
}


def list_replay_sessions() -> List[Dict[str, Any]]:
    """Return available historical Grand Prix replay metadata."""
    return [
        {
            "session_id": s["session_id"],
            "openf1_session_key": s["openf1_session_key"],
            "name": s["name"],
            "track_id": s["track_id"],
            "driver_id": s["driver_id"],
            "winner": s["winner"],
            "actual_strategy": s["actual_strategy"],
            "actual_time_seconds": s["actual_time_seconds"],
        }
        for s in CURATED_REPLAY_SESSIONS.values()
    ]


def fetch_openf1_session_stints(session_key: int) -> Optional[List[Dict[str, Any]]]:
    """Attempt live OpenF1 stint fetch with a short timeout; returns None if unavailable."""
    try:
        with httpx.Client(timeout=3.0) as client:
            resp = client.get(f"{OPENF1_BASE_URL}/stints", params={"session_key": session_key})
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, list) and len(data) > 0:
                    return data[:10]
    except Exception:
        return None
    return None


def get_replay_session(session_id: str, fetch_live: bool = False) -> Dict[str, Any]:
    """Retrieve historical race replay timeline, optionally enriched by OpenF1 live data."""
    if session_id not in CURATED_REPLAY_SESSIONS:
        raise KeyError(f"Unknown replay session_id: '{session_id}'")

    session = dict(CURATED_REPLAY_SESSIONS[session_id])
    session["source"] = "Curated Historical Replay"

    if fetch_live:
        live_stints = fetch_openf1_session_stints(session["openf1_session_key"])
        if live_stints:
            session["openf1_sample_stints"] = live_stints
            session["source"] = "OpenF1 Live API + Historical Replay"

    return session


def _state_at_lap(session: Dict[str, Any], lap: int) -> Dict[str, Any]:
    """Reconstruct tire compound, tire age, stops made, and active SC at a specific lap."""
    stints = session["stints"]
    compound = stints[0]["compound"]
    tire_age = lap
    stops_made = 0

    for idx, stint in enumerate(stints):
        if stint["start_lap"] <= lap <= stint["end_lap"]:
            compound = stint["compound"]
            tire_age = lap - stint["start_lap"] + 1
            stops_made = idx
            break

    is_sc = any(
        ev["lap"] == lap and ev["type"] in {"sc", "vsc"}
        for ev in session.get("events", [])
    )

    return {
        "compound": compound,
        "tire_age": tire_age,
        "stops_made": stops_made,
        "is_sc_active": is_sc,
    }


def run_counterfactual_replay(
    session_id: str,
    what_if_lap: int,
    proposed_compound: str = "medium",
    search_budget: int = 250,
) -> Dict[str, Any]:
    """Compare Hybrid MCTS decision vs. real pit-wall action at a historical race lap."""
    session = get_replay_session(session_id, fetch_live=False)
    track_id = session["track_id"]
    driver_id = session["driver_id"]
    track = get_track(track_id)
    driver = get_driver(driver_id)

    num_laps = track["num_laps"]
    if what_if_lap < 1 or what_if_lap > num_laps:
        raise ValueError(f"what_if_lap ({what_if_lap}) must be between 1 and {num_laps}")

    snapshot = _state_at_lap(session, what_if_lap)
    actual_pit_event = next(
        (ev for ev in session["events"] if ev["lap"] == what_if_lap and ev["type"] == "pit"),
        None,
    )
    actual_action = (
        f"pit_{actual_pit_event['compound']}" if actual_pit_event else "stay_out"
    )

    state = MCTSState(
        lap=what_if_lap,
        compound=snapshot["compound"],
        tire_age=snapshot["tire_age"],
        weather_state="dry",
        is_sc_active=snapshot["is_sc_active"],
        stops_made=snapshot["stops_made"],
    )

    solver = MCTSSolver(
        track_id=track_id,
        driver_id=driver_id,
        num_laps=num_laps,
        base_lap_time=track["base_lap_time"],
        pit_stop_loss=track["pit_stop_time_loss"],
        available_compounds=["soft", "medium", "hard"],
        max_stops=2,
        sc_prob=track.get("sc_probability", 0.04),
        risk_aversion=0.2,
        weather_enabled=False,
        driver_pace_offset=driver["pace_offset"],
        driver_consistency=driver["consistency"],
        track_evolution_rate=0.02,
        rollout_num_simulations=150,
    )

    solver.search(state, budget=search_budget, refine_top_k=2)
    dt_data = solver.get_decision_tree_data()
    candidates = dt_data.get("candidates", [])
    mcts_best = solver.get_best_action()

    proposed_action = f"pit_{proposed_compound.lower()}"
    proposed_entry = next((c for c in candidates if c["action"] == proposed_action), None)
    actual_entry = next((c for c in candidates if c["action"] == actual_action), None)

    proposed_vs_actual_delta = None
    if proposed_entry and actual_entry:
        proposed_vs_actual_delta = round(
            proposed_entry["expected_time"] - actual_entry["expected_time"], 2
        )

    return {
        "session_id": session_id,
        "race_name": session["name"],
        "lap": what_if_lap,
        "state_at_lap": snapshot,
        "actual_action": actual_action,
        "mcts_recommended_action": mcts_best,
        "proposed_action": proposed_action,
        "proposed_vs_actual_delta_seconds": proposed_vs_actual_delta,
        "candidates": candidates,
        "diagnostics": solver.stats,
    }
