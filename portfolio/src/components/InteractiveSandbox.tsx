import React, { useMemo, useState } from 'react';
import { Gauge, Zap, Sparkles } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface CircuitPreset {
  id: string;
  name: string;
  laps: number;
  overtakeIndex: string;
  drsZones: number;
  wearLevel: string;
}

const CIRCUITS: CircuitPreset[] = [
  { id: 'silverstone', name: 'Silverstone', laps: 52, overtakeIndex: '0.62', drsZones: 2, wearLevel: 'High Lateral' },
  { id: 'bahrain', name: 'Bahrain', laps: 57, overtakeIndex: '0.78', drsZones: 3, wearLevel: 'Very High' },
  { id: 'singapore', name: 'Singapore', laps: 62, overtakeIndex: '0.28', drsZones: 3, wearLevel: 'Thermal Street' },
  { id: 'monza', name: 'Monza', laps: 53, overtakeIndex: '0.84', drsZones: 2, wearLevel: 'Low Drag' },
  { id: 'suzuka', name: 'Suzuka', laps: 53, overtakeIndex: '0.41', drsZones: 1, wearLevel: 'High Energy' },
];

type Compound = 'Soft' | 'Medium' | 'Hard';
type Regime = 'green' | 'vsc' | 'sc' | 'red_flag';
type RiskMode = 'conservative' | 'balanced' | 'undercut';

const COMPOUND_COLOR: Record<Compound, string> = {
  Soft: '#E10600',
  Medium: '#EDB40B',
  Hard: '#e2e8f0',
};

export const InteractiveSandbox: React.FC = () => {
  const [circuit, setCircuit] = useState<CircuitPreset>(CIRCUITS[0]);
  const [startCompound, setStartCompound] = useState<Compound>('Medium');
  const [regime, setRegime] = useState<Regime>('sc');
  const [riskMode, setRiskMode] = useState<RiskMode>('balanced');

  const plan = useMemo(() => {
    const highWear =
      circuit.id === 'bahrain' || circuit.id === 'silverstone' || circuit.id === 'suzuka';
    const riskShift = riskMode === 'undercut' ? -2 : riskMode === 'conservative' ? 2 : 0;

    let stints: { compound: Compound; startLap: number; endLap: number }[] = [];

    if (startCompound === 'Soft' && regime === 'green' && highWear) {
      // Realistic 2-stop on high-wear circuits so Soft doesn't exceed ~15 laps
      const pit1 = Math.max(8, Math.round(circuit.laps * 0.27) + riskShift);
      const pit2 = Math.min(circuit.laps - 6, Math.round(circuit.laps * 0.65) + riskShift);
      stints = [
        { compound: 'Soft', startLap: 1, endLap: pit1 },
        { compound: 'Hard', startLap: pit1 + 1, endLap: pit2 },
        { compound: 'Medium', startLap: pit2 + 1, endLap: circuit.laps },
      ];
    } else {
      const baseRatio =
        startCompound === 'Soft' ? 0.31 : startCompound === 'Medium' ? 0.42 : 0.58;
      const pitRatio =
        regime === 'green'
          ? baseRatio
          : regime === 'vsc'
            ? Math.min(0.56, baseRatio + 0.08)
            : regime === 'sc'
              ? Math.min(0.64, baseRatio + 0.14)
              : 0.52;
      const pitLap = Math.max(
        8,
        Math.min(circuit.laps - 6, Math.round(circuit.laps * pitRatio) + riskShift)
      );

      const secondCompound: Compound =
        regime === 'sc' || regime === 'red_flag'
          ? startCompound === 'Soft'
            ? 'Medium'
            : 'Soft'
          : startCompound === 'Hard'
            ? 'Medium'
            : 'Hard';

      stints = [
        { compound: startCompound, startLap: 1, endLap: pitLap },
        { compound: secondCompound, startLap: pitLap + 1, endLap: circuit.laps },
      ];
    }

    const pitLaps = stints.slice(0, -1).map((s) => s.endLap);
    const uniqueCompounds = new Set(stints.map((s) => s.compound)).size;

    const timeSaved =
      regime === 'green'
        ? stints.length === 3
          ? '2-Stop Optimal'
          : riskMode === 'undercut'
            ? '-1.4s Undercut Edge'
            : '0.0s (Baseline)'
        : regime === 'vsc'
          ? '-9.5s Pit Delta'
          : regime === 'sc'
            ? '-13.5s Pit Delta'
            : '-21.5s Free Stop';

    const mctsConfidence =
      regime === 'green' ? '89%' : regime === 'vsc' ? '94%' : regime === 'sc' ? '97%' : '99%';

    return { stints, pitLaps, uniqueCompounds, timeSaved, mctsConfidence };
  }, [circuit, startCompound, regime, riskMode]);

  return (
    <section id="sandbox" className="mx-auto w-full max-w-7xl px-6 py-20">
      <RevealOnScroll>
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-xs tracking-[0.18em] text-[#EDB40B] uppercase">
              Interactive Strategy Sandbox
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Simulate a Pit-Wall Call
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Pick a circuit preset, starting tire compound, and mid-race control trigger to see how
              Hybrid MCTS reshapes the stint timeline.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-xs text-white/75">
            <Sparkles className="h-3.5 w-3.5 text-[#EDB40B]" />
            <span>MCTS Confidence: {plan.mctsConfidence}</span>
          </div>
        </div>

        <div className="relative grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-[#E10600]/25 bg-[#14141e]/85 p-6 shadow-[0_0_60px_rgba(225,6,0,0.08)] backdrop-blur-xl lg:grid-cols-12 lg:p-8">
          <div
            className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #E10600, transparent 70%)' }}
          />
          {/* Controls */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <label className="mb-2 block font-mono text-[11px] text-white/50 uppercase">
                1. Circuit Preset
              </label>
              <div className="flex flex-wrap gap-2">
                {CIRCUITS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCircuit(c)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      circuit.id === c.id
                        ? 'border-[#EDB40B] bg-[#EDB40B]/15 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] text-white/50 uppercase">
                2. Starting Compound
              </label>
              <div className="flex gap-2">
                {(['Soft', 'Medium', 'Hard'] as Compound[]).map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setStartCompound(comp)}
                    className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      startCompound === comp
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COMPOUND_COLOR[comp] }}
                    />
                    <span>{comp}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] text-white/50 uppercase">
                3. Mid-Race Control Trigger
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                {[
                  { id: 'green' as Regime, label: 'Green Flag' },
                  { id: 'vsc' as Regime, label: 'VSC (12.0s)' },
                  { id: 'sc' as Regime, label: 'Safety Car (8.0s)' },
                  { id: 'red_flag' as Regime, label: 'Red Flag (0.0s)' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegime(r.id)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      regime === r.id
                        ? 'border-[#E10600] bg-[#E10600]/20 text-white shadow-[0_0_16px_rgba(225,6,0,0.25)]'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] text-white/50 uppercase">
                4. Pit-Wall Risk Appetite
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'undercut' as RiskMode, label: 'Undercut (-2L)' },
                  { id: 'balanced' as RiskMode, label: 'Balanced' },
                  { id: 'conservative' as RiskMode, label: 'Overcut (+2L)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setRiskMode(m.id)}
                    className={`rounded-lg border px-2.5 py-2 text-[11px] font-semibold transition-colors ${
                      riskMode === m.id
                        ? 'border-[#EDB40B] bg-[#EDB40B]/15 text-[#EDB40B]'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Visual Output */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0a0e1c]/90 p-5 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs text-white/70">
                  <Gauge className="h-4 w-4 text-[#EDB40B]" />
                  <span>
                    {circuit.name} ({circuit.laps} Laps)
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#EDB40B]">
                  <Zap className="h-3.5 w-3.5" />
                  <span>{plan.timeSaved}</span>
                </div>
              </div>

              {/* Stint Timeline Bar */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between font-mono text-[11px] text-white/50">
                  <span>LAP 1</span>
                  <span className="text-white">
                    BOX {plan.pitLaps.map((l) => `L${l}`).join(' • ')}
                  </span>
                  <span>LAP {circuit.laps}</span>
                </div>

                <div className="flex h-10 w-full overflow-hidden rounded-xl border border-white/15 bg-white/5">
                  {plan.stints.map((stint, idx) => {
                    const lapsInStint = stint.endLap - stint.startLap + 1;
                    const widthPct = (lapsInStint / circuit.laps) * 100;
                    const isLast = idx === plan.stints.length - 1;
                    return (
                      <div
                        key={`${stint.compound}-${stint.startLap}`}
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: COMPOUND_COLOR[stint.compound],
                        }}
                        className={`flex items-center justify-center text-xs font-bold text-black transition-all duration-500 ${
                          !isLast ? 'border-r-2 border-[#0a0e1c]' : ''
                        }`}
                      >
                        {stint.compound} (L{stint.startLap}–{stint.endLap})
                      </div>
                    );
                  })}
                </div>

                <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] text-white/50">
                  <span>
                    FIA 2-Compound Dry Rule:{' '}
                    <span className="text-green-400">
                      Satisfied ({plan.uniqueCompounds} compounds) ✓
                    </span>
                  </span>
                  <span>{plan.stints.length - 1}-Stop Strategy</span>
                </div>
              </div>
            </div>

            {/* Circuit Telemetry Metadata */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-center">
              <div className="rounded-lg bg-white/[0.04] p-3">
                <div className="font-mono text-[10px] text-white/45 uppercase">Overtake Index</div>
                <div className="mt-1 text-lg font-bold text-white">{circuit.overtakeIndex}</div>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-3">
                <div className="font-mono text-[10px] text-white/45 uppercase">DRS Zones</div>
                <div className="mt-1 text-lg font-bold text-[#EDB40B]">{circuit.drsZones}</div>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-3">
                <div className="font-mono text-[10px] text-white/45 uppercase">Tire Stress</div>
                <div className="mt-1 text-xs font-semibold text-white/90">{circuit.wearLevel}</div>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
