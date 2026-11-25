"""Unit & integration tests for Apex Strategy v6 features."""

from fastapi.testclient import TestClient
from app.main import app
from app.engine.race_control import (
    generate_race_control_matrix,
    REGIME_VSC,
    REGIME_SC,
    REGIME_RED_FLAG,
)
from app.engine.simulator import simulate_strategy_vectorized
from app.engine.virtual_grid import simulate_virtual_grid, compute_overtake_probability
from app.engine.weather import compute_weather_crossover_curve
from app.engine.fastf1_service import load_and_calibrate_fastf1

client = TestClient(app)


def test_race_control_regimes_trigger():
    matrix = generate_race_control_matrix(
        num_simulations=200,
        num_laps=57,
        sc_probability=0.05,
        vsc_probability=0.05,
        red_flag_probability=0.02,
        seed=42,
    )
    assert matrix.shape == (200, 57)
    assert (matrix == REGIME_VSC).any()
    assert (matrix == REGIME_SC).any()
    assert (matrix == REGIME_RED_FLAG).any()


def test_simulator_with_vsc_and_red_flag():
    times, _, sc_info = simulate_strategy_vectorized(
        compounds=["soft", "hard"],
        pit_laps=[20],
        num_simulations=200,
        sc_probability=0.04,
        vsc_probability=0.05,
        red_flag_probability=0.02,
        seed=42,
    )
    assert len(times) == 200
    assert sc_info["vsc_races_triggered"] > 0
    assert sc_info["red_flag_races_triggered"] > 0


def test_virtual_grid_monza_vs_monaco_overtaking():
    p_monza = compute_overtake_probability(0.6, 5, overtake_difficulty_index=0.80, drs_zones=3)
    p_monaco = compute_overtake_probability(0.6, 5, overtake_difficulty_index=0.05, drs_zones=1)
    assert p_monza > p_monaco

    res = simulate_virtual_grid(
        track_id="bahrain",
        ego_compounds=["soft", "medium", "hard"],
        ego_pit_laps=[15, 36],
        ego_start_position=6,
        num_simulations=80,
    )
    assert 1.0 <= res["mean_finish_position"] <= 10.0
    assert sum(res["position_distribution"].values()) == 80


def test_weather_crossover_curve():
    curve = compute_weather_crossover_curve(base_lap_time=94.0, tire_age=5)
    assert len(curve) == 11
    # Dry favors slicks; damp/wet favors inters/wets
    assert curve[0]["slick_time"] < curve[0]["intermediate_time"]
    assert curve[5]["intermediate_time"] < curve[5]["slick_time"]
    assert curve[-1]["wet_time"] < curve[-1]["intermediate_time"]


def test_multi_circuit_calibration_catalog():
    monaco = load_and_calibrate_fastf1(track_id="monaco")
    silverstone = load_and_calibrate_fastf1(track_id="silverstone")
    assert monaco["num_laps"] == 78
    assert silverstone["num_laps"] == 52
    assert monaco["base_lap_time"] != silverstone["base_lap_time"]


def test_v6_api_endpoints():
    grid_res = client.post(
        "/simulate-grid",
        json={"track_id": "bahrain", "start_position": 5, "num_simulations": 60},
    )
    assert grid_res.status_code == 200
    assert "mean_finish_position" in grid_res.json()

    crossover_res = client.get("/weather/crossover?base_lap_time=94.0")
    assert crossover_res.status_code == 200
    assert len(crossover_res.json()) == 11

    sessions_res = client.get("/replay/sessions")
    assert sessions_res.status_code == 200
    assert len(sessions_res.json()) >= 3

    cf_res = client.post(
        "/replay/counterfactual",
        json={"session_id": "silverstone_2023", "what_if_lap": 33, "proposed_compound": "soft", "search_budget": 100},
    )
    assert cf_res.status_code == 200
    cf_data = cf_res.json()
    assert cf_data["actual_action"] == "pit_hard"
    assert "mcts_recommended_action" in cf_data
