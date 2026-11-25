"""Historical Grand Prix replay and MCTS counterfactual endpoints (v6)."""

from typing import Dict, Any, List
from fastapi import APIRouter

from ...core.exceptions import F1SimulatorError, InvalidStrategyParameterError
from ...models.strategy import ReplayCounterfactualRequest
from ...engine.openf1_service import (
    list_replay_sessions,
    get_replay_session,
    run_counterfactual_replay,
)

router = APIRouter(prefix="/replay", tags=["Replay"])


@router.get("/sessions", response_model=List[Dict[str, Any]])
def get_replay_sessions():
    """List available historical Grand Prix replay sessions."""
    return list_replay_sessions()


@router.get("/session/{session_id}", response_model=Dict[str, Any])
def get_replay_session_detail(session_id: str, fetch_live: bool = False):
    """Retrieve lap-by-lap stints and events for a Grand Prix replay session."""
    try:
        return get_replay_session(session_id, fetch_live=fetch_live)
    except KeyError as exc:
        raise F1SimulatorError(str(exc), status_code=404) from exc


@router.post("/counterfactual", response_model=Dict[str, Any])
def replay_counterfactual_endpoint(input_data: ReplayCounterfactualRequest):
    """Run Hybrid MCTS counterfactual comparison against real pit-wall action at a target lap."""
    try:
        return run_counterfactual_replay(
            session_id=input_data.session_id,
            what_if_lap=input_data.what_if_lap,
            proposed_compound=input_data.proposed_compound,
            search_budget=input_data.search_budget,
        )
    except KeyError as exc:
        raise F1SimulatorError(str(exc), status_code=404) from exc
    except ValueError as exc:
        raise InvalidStrategyParameterError(str(exc)) from exc
