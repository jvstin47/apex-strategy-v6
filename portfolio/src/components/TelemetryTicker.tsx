import React from 'react';

const ITEMS = [
  '10,000 MONTE CARLO RUNS',
  'VSC PIT LOSS: 12.0s (1.40x PACE)',
  'SAFETY CAR: 8.0s (1.35x PACE)',
  'RED FLAG: 0.0s FREE CHANGE',
  '10-CAR VIRTUAL GRID (P1–P10)',
  '3-STATE MARKOV WEATHER',
  'HYBRID MCTS + RISK-AWARE DP',
  'OPENF1 2023 COUNTERFACTUALS',
  '5 CIRCUITS • 21 DRIVERS',
  '54 PYTEST + 7 VITEST PASSING',
];

export const TelemetryTicker: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#0d1222]/90 py-3">
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap font-mono text-[11px] tracking-[0.18em] text-white/65 uppercase">
        {[...ITEMS, ...ITEMS].map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EDB40B]" />
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
