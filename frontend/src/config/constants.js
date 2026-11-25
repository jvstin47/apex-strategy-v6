/**
 * Application Constants and Default Configurations.
 */

export const DEFAULT_STRATEGY_A = {
  driver_id: 'generic',
  track_id: 'bahrain',
  compound_1: 'soft',
  compound_2: 'medium',
  pit_lap: 18,
  compounds: ['soft', 'medium'],
  pit_laps: [18],
  num_laps: 57,
  base_lap_time: 94.0,
  pit_stop_time_loss: 22.0,
  num_simulations: 10000,
  random_std: 0.15,
  sc_probability: 0.04,
  is_reactive_sc: false,
  reactive_window: 8,
};

export const DEFAULT_STRATEGY_B = {
  driver_id: 'generic',
  track_id: 'bahrain',
  compound_1: 'medium',
  compound_2: 'hard',
  pit_lap: 30,
  compounds: ['medium', 'hard'],
  pit_laps: [30],
  num_laps: 57,
  base_lap_time: 94.0,
  pit_stop_time_loss: 22.0,
  num_simulations: 10000,
  random_std: 0.15,
  sc_probability: 0.04,
  is_reactive_sc: true,
  reactive_window: 8,
};

export const DEFAULT_UNDERCUT_INPUT = {
  base_pit_lap_b: 22,
  car_a_compound_1: 'medium',
  car_a_compound_2: 'hard',
  car_b_compound_1: 'medium',
  car_b_compound_2: 'hard',
  initial_gap_seconds: 1.0,
  dirty_air_penalty: 0.25,
  num_simulations: 5000,
};

export const ALL_COMPOUNDS = [
  { id: 'soft', name: 'Soft', colorClass: 'selected-soft', dotClass: 'dot-soft' },
  { id: 'medium', name: 'Medium', colorClass: 'selected-medium', dotClass: 'dot-medium' },
  { id: 'hard', name: 'Hard', colorClass: 'selected-hard', dotClass: 'dot-hard' },
  { id: 'intermediate', name: 'Inter', colorClass: 'selected-intermediate', dotClass: 'dot-intermediate' },
  { id: 'wet', name: 'Wet', colorClass: 'selected-wet', dotClass: 'dot-wet' },
];

export const DRY_COMPOUNDS = ['soft', 'medium', 'hard'];

export const MCTS_PIT_COMPOUNDS = ['soft', 'medium', 'hard', 'intermediate'];

export const COMPOUND_COLORS = {
  soft: '#ef4444',
  medium: '#eab308',
  hard: '#f8fafc',
  intermediate: '#22c55e',
  wet: '#3b82f6',
};

export const SEARCH_MODES = {
  fast: { label: 'Fast', search_budget: 150, refine_top_k: 1 },
  balanced: { label: 'Balanced', search_budget: 500, refine_top_k: 2 },
  accurate: { label: 'High Accuracy', search_budget: 1000, refine_top_k: 3 },
};

export const VIEW_TABS = [
  { id: 'sim', label: 'Simulator', targetMode: 'single' },
  { id: 'sc', label: 'Safety Car', targetMode: 'compare' },
  { id: 'racesim', label: 'Race Sim (MCTS)' },
  { id: 'grid', label: 'Virtual Grid' },
  { id: 'replay', label: 'Replay (OpenF1)' },
  { id: 'weather', label: 'Weather', targetMode: 'single' },
  { id: 'undercut', label: 'Undercut Battle' },
  { id: 'fastf1', label: 'FastF1' },
  { id: 'optimize', label: 'Optimize' },
];
