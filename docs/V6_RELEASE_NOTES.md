# Apex Strategy v6 — Release Notes

**Apex Strategy v6** builds on the v5 Hybrid MCTS foundation to address real-world F1 pit-wall constraints: multi-car traffic, race-control neutralizations beyond a binary Safety Car, multi-circuit empirical baselines, historical counterfactual validation, and frontend performance.

## Highlights (v5 → v6)

### 1. 4-Regime Race Control (`race_control.py`)
- **Virtual Safety Car (VSC)**: 1–2 lap neutralization with `1.40x` lap-time delta and `12.0s` pit loss.
- **Full Safety Car (SC)**: 2–4 lap neutralization with `1.35x` pace and `8.0s` pit loss.
- **Red Flag**: Race suspension allowing a `0.0s` free tire change.
- Integrated into `simulate_strategy_vectorized` and exposed in `StrategyForm.jsx`.

### 2. 10-Car Virtual Grid & Overtaking (`virtual_grid.py`)
- Couples `overtake_difficulty_index` and `drs_zones` from `tracks.py` into a 10-car pack simulator (`POST /simulate-grid`).
- Outputs finish position probabilities (`P1–P10`), mean finish position, average overtakes, and cumulative dirty-air time loss.

### 3. Weather Crossover Curve (`weather.py`)
- Added `GET /weather/crossover` and `WeatherCrossoverChart.jsx` to visualize exact track wetness crossover points between Slick, Intermediate, and Full Wet compounds.

### 4. Multi-Circuit Calibration & OpenF1 Historical Replay
- Extended `/fastf1/calibrate` via `CIRCUIT_CALIBRATION_CATALOG` to cover all 5 circuits (`bahrain`, `silverstone`, `monza`, `monaco`, `singapore`).
- Added `/replay/sessions`, `/replay/session/{id}`, and `/replay/counterfactual` (`openf1_service.py` + `ReplayTab.jsx`) to compare real Grand Prix pit-wall calls against Hybrid MCTS at any lap.

### 5. Bundle Code-Splitting, Shareable URLs & CI
- Reduced initial `index.js` from `578 kB` (v5) to **`40.42 kB`** (`12.05 kB` gzip) via `React.lazy()` and Vite `manualChunks`.
- Added Shareable Scenario URLs (`?tab=...&track=...`), Vitest unit tests (`npm test`), and GitHub Actions CI (`.github/workflows/ci.yml`).
