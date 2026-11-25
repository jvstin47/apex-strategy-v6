export interface DrumModule {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  file: string;
  category: 'Engine' | 'Optimizer' | 'Replay' | 'Data & CI';
  accent: string;
  metricValue: string;
  metricLabel: string;
  summary: string;
  mechanics: string[];
  visualType: 'monte-carlo' | 'race-control' | 'weather' | 'grid' | 'replay' | 'pipeline';
  replayRace?: 'bahrain' | 'silverstone' | 'singapore';
}

export interface RaceRegime {
  id: 'green' | 'vsc' | 'sc' | 'red_flag';
  label: string;
  pitLoss: string;
  paceMultiplier: string;
  optimalWindow: string;
  note: string;
  color: string;
}

export const RACE_REGIMES: RaceRegime[] = [
  {
    id: 'green',
    label: 'Green Flag',
    pitLoss: '21.5s',
    paceMultiplier: '1.00x',
    optimalWindow: 'Laps 18–22 / 40–44',
    note: 'Standard pit-lane delta. Undercut power depends on fresh-tire warm-up vs. traffic.',
    color: '#22c55e',
  },
  {
    id: 'vsc',
    label: 'Virtual Safety Car',
    pitLoss: '12.0s',
    paceMultiplier: '1.40x',
    optimalWindow: 'Immediate Pit Window (-9.5s saved)',
    note: 'Field slowed by 40% on track while pit lane speed limit stays fixed—massive cheap stop.',
    color: '#EDB40B',
  },
  {
    id: 'sc',
    label: 'Safety Car',
    pitLoss: '8.0s',
    paceMultiplier: '1.35x',
    optimalWindow: 'Immediate Double-Stack / Pit',
    note: 'Pack bunches up behind the Safety Car; pit loss drops to ~8.0s with high overtake density.',
    color: '#f97316',
  },
  {
    id: 'red_flag',
    label: 'Red Flag',
    pitLoss: '0.0s',
    paceMultiplier: '0.00x (Stopped)',
    optimalWindow: 'Free Tire Change on Grid',
    note: 'Zero pit-lane time loss. Completely resets stint compound constraints and remaining race.',
    color: '#E10600',
  },
];

export interface ReplayComparison {
  id: 'bahrain' | 'silverstone' | 'singapore';
  gp: string;
  circuit: string;
  laps: number;
  realStrategy: string;
  mctsStrategy: string;
  deltaSummary: string;
  keyMoment: string;
}

export const REPLAY_COMPARISONS: Record<ReplayComparison['id'], ReplayComparison> = {
  bahrain: {
    id: 'bahrain',
    gp: '2023 Bahrain GP',
    circuit: 'Sakhir International',
    laps: 57,
    realStrategy: 'Soft → Hard → Hard (Laps 14, 36)',
    mctsStrategy: 'Soft → Hard → Soft (Laps 12, 38)',
    deltaSummary: '-3.4s expected race time',
    keyMoment:
      'High rear-tire thermal degradation triggers an earlier Lap 12 undercut, capturing clean air before the midfield DRS train forms.',
  },
  silverstone: {
    id: 'silverstone',
    gp: '2023 British GP',
    circuit: 'Silverstone Circuit',
    laps: 52,
    realStrategy: 'Medium → Hard (Safety Car Lap 33)',
    mctsStrategy: 'Medium → Soft (Safety Car Lap 33)',
    deltaSummary: '+2.1s restart pace edge',
    keyMoment:
      'When the Lap 33 Safety Car drops pit loss to 8.0s, Hybrid MCTS branches to Softs for the 19-lap sprint rather than conservative Hards.',
  },
  singapore: {
    id: 'singapore',
    gp: '2023 Singapore GP',
    circuit: 'Marina Bay Street Circuit',
    laps: 62,
    realStrategy: 'Medium → Hard (VSC Lap 44 hold)',
    mctsStrategy: 'Medium → Hard → Medium (VSC Lap 44 pit)',
    deltaSummary: '+2 positions gained',
    keyMoment:
      'Under the Lap 44 VSC (12.0s pit loss), MCTS sacrifices track position for fresh Mediums and clears aging Hard runners on a high-wear street surface.',
  },
};

export const DRUM_MODULES: DrumModule[] = [
  {
    id: 'monte-carlo',
    index: '01',
    title: 'Monte Carlo Simulator',
    subtitle: '10,000-run vectorized race engine',
    file: 'backend/app/engine/simulator.py',
    category: 'Engine',
    accent: '#EDB40B',
    metricValue: '10,000',
    metricLabel: 'Runs per evaluation',
    summary:
      'Simulates 10,000 stochastic race trajectories simultaneously in NumPy, modeling two-phase tire degradation cliffs, fuel burn-off, track evolution, and traffic.',
    mechanics: [
      'Two-phase tire_model.py cliff (linear wear → exponential drop-off)',
      'Fuel burn-off mass gain (~0.03s/lap) & rubbered-in track evolution',
      'Reactive pitting triggers when lap-time delta breaches threshold',
    ],
    visualType: 'monte-carlo',
  },
  {
    id: 'mcts-replanner',
    index: '02',
    title: 'Hybrid MCTS Replanner',
    subtitle: 'Risk-aware DP + live tree search',
    file: 'backend/app/engine/mcts/solver.py',
    category: 'Optimizer',
    accent: '#E10600',
    metricValue: 'DP + MCTS',
    metricLabel: 'Hybrid architecture',
    summary:
      'Combines a risk-aware Dynamic Programming baseline with Monte Carlo Tree Search (UCT + heuristic rollouts) to replan mid-race when Safety Cars or rain hit.',
    mechanics: [
      'DP optimizer computes baseline compound & lap windows fast',
      'MCTS branches on live lap state, tire age, and regime transitions',
      'heuristic_evaluator.py prunes dominated pit-stop combinations',
    ],
    visualType: 'monte-carlo',
  },
  {
    id: 'race-control',
    index: '03',
    title: '4-Regime Race Control',
    subtitle: 'Green / VSC / SC / Red Flag matrix',
    file: 'backend/app/engine/race_control.py',
    category: 'Engine',
    accent: '#EDB40B',
    metricValue: '4 Regimes',
    metricLabel: 'Dynamic pit-loss model',
    summary:
      'Models how neutralizations compress pit-lane time loss—turning a 21.5s Green Flag stop into a 12.0s VSC, 8.0s SC, or 0.0s Red Flag free change.',
    mechanics: [
      'VSC: 12.0s pit loss, 1.40x lap-time pace multiplier',
      'Safety Car: 8.0s pit loss, 1.35x pace + pack compression',
      'Red Flag: 0.0s free tire change on the grid',
    ],
    visualType: 'race-control',
  },
  {
    id: 'virtual-grid',
    index: '04',
    title: '10-Car Virtual Grid',
    subtitle: 'DRS overtakes & P1–P10 distributions',
    file: 'backend/app/engine/virtual_grid.py',
    category: 'Engine',
    accent: '#38bdf8',
    metricValue: '10 Cars',
    metricLabel: 'Pack interaction sim',
    summary:
      'Goes beyond single-car time trials by simulating a 10-car pack with dirty-air aero penalties, DRS overtake probabilities, and undercut traffic windows.',
    mechanics: [
      'Uses circuit overtake_difficulty_index & drs_zones presets',
      'Outputs full P1–P10 finishing position probability distributions',
      'Captures DRS-train trapping after early pit stops',
    ],
    visualType: 'grid',
  },
  {
    id: 'weather-markov',
    index: '05',
    title: 'Markov Weather Crossover',
    subtitle: '3-state rain transitions & tire curves',
    file: 'backend/app/engine/weather.py',
    category: 'Engine',
    accent: '#60a5fa',
    metricValue: '3 States',
    metricLabel: 'Dry / Damp / Wet',
    summary:
      'Models probabilistic weather evolution with a 3-state Markov chain and computes exact lap-time crossover points between Slick, Intermediate, and Wet tires.',
    mechanics: [
      'Dry ↔ Damp ↔ Wet transition matrix per lap',
      'compute_weather_crossover_curve() identifies exact switchover',
      'Prevents premature slick-to-inter gambles under uncertainty',
    ],
    visualType: 'weather',
  },
  {
    id: 'replay-silverstone',
    index: '06',
    title: '2023 Silverstone Replay',
    subtitle: 'Counterfactual: Safety Car Lap 33',
    file: 'backend/app/engine/openf1_service.py',
    category: 'Replay',
    accent: '#EDB40B',
    metricValue: '+2.1s',
    metricLabel: 'Restart pace edge',
    summary:
      'Replays the 2023 British GP from OpenF1 telemetry and compares actual pit-wall calls against what Hybrid MCTS recommends under the Lap 33 Safety Car.',
    mechanics: [
      'Real pit wall: Medium → Hard conservative cover',
      'MCTS call: Medium → Soft for the 19-lap final sprint',
      'Quantifies expected position & race-time delta per lap',
    ],
    visualType: 'replay',
    replayRace: 'silverstone',
  },
  {
    id: 'replay-bahrain',
    index: '07',
    title: '2023 Bahrain Replay',
    subtitle: 'Counterfactual: Undercut & thermal deg',
    file: 'backend/app/engine/openf1_service.py',
    category: 'Replay',
    accent: '#E10600',
    metricValue: '-3.4s',
    metricLabel: 'Expected race time',
    summary:
      'Tests Hybrid MCTS on Sakhir’s abrasive asphalt, where early undercut gains outweigh stint length on high-degradation compounds.',
    mechanics: [
      '57-lap simulation calibrated to Bahrain tire wear multipliers',
      'Pulls pit window forward to Lap 12 to jump DRS traffic',
      'Switches final stint to Softs for lighter fuel load',
    ],
    visualType: 'replay',
    replayRace: 'bahrain',
  },
  {
    id: 'replay-singapore',
    index: '08',
    title: '2023 Singapore Replay',
    subtitle: 'Counterfactual: Late VSC branching',
    file: 'backend/app/engine/openf1_service.py',
    category: 'Replay',
    accent: '#22c55e',
    metricValue: '+2 Pos',
    metricLabel: 'Projected gain',
    summary:
      'Evaluates the Lap 44 Virtual Safety Car at Marina Bay—showing when sacrificing track position for fresh Mediums pays off before the checkered flag.',
    mechanics: [
      '12.0s VSC pit loss modeled against 62-lap street circuit',
      'Balances overtake_difficulty_index vs. tire-age pace delta',
      'Validates late-race charge against aging Hard-tire runners',
    ],
    visualType: 'replay',
    replayRace: 'singapore',
  },
  {
    id: 'fastf1-calibration',
    index: '09',
    title: 'FastF1 Calibration',
    subtitle: '5 circuits, 21 drivers, offline fallbacks',
    file: 'backend/app/engine/fastf1_service.py',
    category: 'Data & CI',
    accent: '#a855f7',
    metricValue: '5 / 21',
    metricLabel: 'Circuits & Drivers',
    summary:
      'Ingests real FastF1 session telemetry to calibrate circuit wear multipliers and driver pace profiles—with empirical offline fallbacks when offline.',
    mechanics: [
      'CIRCUIT_CALIBRATION_CATALOG across 5 Grand Prix presets',
      '21 driver profiles in data/drivers.py with pace & consistency',
      'Zero-downtime empirical fallback for air-gapped or CI runs',
    ],
    visualType: 'pipeline',
  },
  {
    id: 'architecture-ci',
    index: '10',
    title: 'Architecture & CI',
    subtitle: 'Dual-mounted FastAPI + React 18 Vite',
    file: '.github/workflows/ci.yml',
    category: 'Data & CI',
    accent: '#EDB40B',
    metricValue: '54 + 7',
    metricLabel: 'Pytest & Vitest passing',
    summary:
      'Production-structured full stack: dual-mounted FastAPI (/ & /api/v1) with unified JSON exceptions, lazy-loaded React 18 frontend (40.42 kB entry), and automated CI.',
    mechanics: [
      '54 backend pytest tests + 7 frontend Vitest specs on every push',
      'React.lazy() + manualChunks keeps entry bundle at 12.05 kB gzip',
      'Shareable ?tab=...&track=... URL state in StrategyContext',
    ],
    visualType: 'pipeline',
  },
];
