# 🏎️ Apex Strategy v6 — Multi-Car F1 Race Strategy & Counterfactual Engine

**Apex Strategy v6** is a full-stack Formula 1 race strategy simulator, stochastic optimizer, and historical replay workbench built with **Python (FastAPI + NumPy)** and **React 18 (Vite + Recharts)**.

> **Live Repository:** [jvstin47/apex-strategy-v6](https://github.com/jvstin47/apex-strategy-v6) · **CI:** GitHub Actions (`pytest` + `Vitest` + `Vite build`)

---

## ⚡ What's New & Better in v6 (vs. v5)

v5 solved single-car strategic search (*Hybrid MCTS* cutting the MCTS-to-DP gap by ~76%). **v6 transforms the simulator from an isolated single-car calculator into a multi-car, multi-regime pit-wall workbench:**

| Capability | v5 | **v6 (New & Upgraded)** |
|---|---|---|
| **Race Control Regimes** | Binary Safety Car (`SC` / `Green`) | **4-Regime Engine**: Green, **Virtual Safety Car (VSC)** (`12.0s` pit loss, `1.40x` pace), **Full SC** (`8.0s` pit loss), & **Red Flag** (`0.0s` free tire change) |
| **Traffic & Track Position** | Single-car time + separate 2-car undercut | **10-Car Virtual Grid** (`POST /simulate-grid`) using circuit `overtake_difficulty_index`, DRS zones, dirty-air delays, and `P1–P10` finish distributions |
| **Weather Modeling** | 3-state Markov transitions (`dry`/`damp`/`wet`) | **+ Compound Crossover Curve** (`GET /weather/crossover`) plotting Slick vs. Intermediate vs. Wet lap times across 0%–100% track wetness |
| **Telemetry Calibration** | 2023 Bahrain baseline only | **All 5 Circuits Calibrated** (`bahrain`, `silverstone`, `monza`, `monaco`, `singapore`) via `CIRCUIT_CALIBRATION_CATALOG` + FastF1 |
| **Historical Validation** | Static FastF1 winner banner | **OpenF1 Historical Replay & Counterfactual "What-If"** (`2023 Bahrain`, `2023 Silverstone`, `2023 Singapore`) comparing real pit-wall calls vs. Hybrid MCTS at any lap |
| **Frontend & Bundle DX** | `578 kB` single JS chunk, no share links | **`React.lazy` + `manualChunks`** (`40.42 kB` main chunk), **Shareable Scenario URLs** (`?tab=...&track=...`), and **Vitest** unit tests |
| **Testing & CI** | 48 backend tests | **54 backend `pytest` tests + 7 frontend `Vitest` tests** wired into **GitHub Actions CI** |

---

## 🧠 Core Architecture & Features

1. **NumPy-Vectorized Monte Carlo Engine (`10,000` runs)**
   - Two-phase tire degradation (linear wear + quadratic post-cliff collapse), fuel burn-off (`0.033s/lap`), track rubbering evolution, backmarker traffic loss, and reactive Safety Car / VSC / Red Flag pit windows.
2. **Dynamic Programming Optimizer & Hybrid MCTS Replanner**
   - **DP Backward Induction (`POST /optimize`)**: Pre-race baseline across 1-stop to 3-stop schedules with risk-adjusted ranking (`expected_time + risk_aversion * std_dev`).
   - **Hybrid MCTS (`POST /optimize-mcts`)**: Fast/Balanced/High Accuracy rolling replanner combining per-compound heuristic traversal with selective high-fidelity Monte Carlo escalation and top-K refinement.
3. **10-Car Virtual Grid (`POST /simulate-grid`)**
   - Models a 10-car pack around the ego driver so pitting into traffic on low-overtake tracks (e.g. Monaco `0.05`) vs. DRS tracks (e.g. Monza `0.80`) directly impacts projected finishing position (`P1–P10`), overtakes, and dirty-air time loss.
4. **OpenF1 Replay & Counterfactual Workbench (`GET /replay/sessions`, `POST /replay/counterfactual`)**
   - Scrub to any lap of a historical Grand Prix and compare what the real pit wall did (e.g., Norris pitting onto Hard under the Lap 33 Silverstone SC) against Hybrid MCTS and any alternative compound.
5. **Production-Ready API & Resilient UI**
   - Dual-mounted FastAPI routes (root + `/api/v1/*`), unified JSON error payloads (`status`, `error_type`, `detail`, `path`), React `ErrorBoundary`, and free-tier cold-start detection.

---

## 🏃 Quick Start

### 1. Backend API (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
- API & Swagger UI: `http://127.0.0.1:8005/docs`
- Key endpoints (also available under `/api/v1/...`):
  - `GET /tracks`, `GET /drivers`, `GET /health`
  - `POST /simulate`, `POST /compare`, `POST /undercut-analysis`
  - `POST /simulate-grid` *(v6 10-car virtual pack)*
  - `GET /weather/crossover` *(v6 slick/inter/wet crossover curve)*
  - `POST /optimize`, `POST /optimize-mcts`
  - `GET /fastf1/calibrate?track_id=silverstone` *(v6 multi-circuit calibration)*
  - `GET /replay/sessions`, `GET /replay/session/{id}`, `POST /replay/counterfactual` *(v6 OpenF1 replay)*

### 2. Frontend Dashboard (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`. Use the **Share** button in the header to copy scenario URLs (`?tab=grid&track=monaco`).

---

## 🧪 Running Tests & Benchmarks

```bash
# Backend full test suite (54 tests: unit, integration, v6 features)
cd backend && ./venv/bin/pytest -v

# Frontend unit tests (Vitest) & production bundle check
cd frontend && npm test && npm run build

# v5/v6 Calibration & Empirical Benchmarks
cd backend && ./venv/bin/python -m app.engine.calibration_harness
cd backend && ./venv/bin/python scripts/evaluate_mcts.py
cd backend && ./venv/bin/python scripts/benchmark_suite.py
```

---

## 📚 Documentation Index

| Document | Purpose |
|---|---|
| [`docs/V6_RELEASE_NOTES.md`](docs/V6_RELEASE_NOTES.md) | Detailed v5 → v6 changelog, new endpoints, and bundle metrics |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Full modular directory layout, data flow, and design patterns |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Render (backend) + Vercel (frontend) deployment & security guide |
| [`docs/V5_DESIGN.md`](docs/V5_DESIGN.md) | Hybrid MCTS architecture & research design |
| [`docs/PHASE1_CALIBRATION_RESULTS.md`](docs/PHASE1_CALIBRATION_RESULTS.md) | Calibration harness findings on heuristic vs. simulator ranking |
| [`docs/PHASE2_4_RESULTS.md`](docs/PHASE2_4_RESULTS.md) | Empirical DP vs. v4 MCTS vs. v5 Hybrid MCTS results |
| [`docs/PHASE6_BENCHMARK_RESULTS.md`](docs/PHASE6_BENCHMARK_RESULTS.md) | Scenario-group benchmark breakdown |
