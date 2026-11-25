"""FastF1 official telemetry calibration route (v6 multi-circuit)."""

from typing import Dict, Any
from fastapi import APIRouter
from ...engine.fastf1_service import load_and_calibrate_fastf1

router = APIRouter(prefix="/fastf1", tags=["Telemetry"])


@router.get("/calibrate", response_model=Dict[str, Any])
def fastf1_calibrate_endpoint(
    track_id: str = "bahrain",
    year: int = 2023,
    grand_prix: str = "Bahrain",
    session_type: str = "R",
):
    """Calibrate tire wear curves and pit stop parameters for any supported circuit."""
    return load_and_calibrate_fastf1(
        year=year,
        grand_prix=grand_prix,
        session_type=session_type,
        track_id=track_id,
    )
