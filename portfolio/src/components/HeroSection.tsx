import React from 'react';
import { ArrowDown, Github, Cpu, ShieldCheck } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';
import { PhoneNav } from './PhoneNav';
import { useCountUp } from '../hooks/useCountUp';

interface HeroSectionProps {
  onJumpSection: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onJumpSection }) => {
  const runsCount = useCountUp({ end: 10000, duration: 2200, delay: 700 });
  const testsCount = useCountUp({ end: 54, duration: 1800, delay: 900 });
  const seasonCount = useCountUp({ end: 2023, duration: 2000, delay: 1100 });

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#0a0e1c] font-sans">
      {/* Atmospheric telemetry grid + subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(225, 6, 0, 0.16) 0%, rgba(237, 180, 11, 0.08) 32%, rgba(10, 14, 28, 0.94) 72%)',
        }}
      />

      {/* Top Portfolio Navigation */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E10600] shadow-[0_0_12px_#E10600]" />
          <span className="text-sm font-bold tracking-[0.18em] text-white uppercase">
            Apex Strategy <span className="text-[#EDB40B]">v6</span>
          </span>
        </div>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/70 md:flex">
          <button
            type="button"
            onClick={() => onJumpSection('engine-explorer')}
            className="transition-colors hover:text-[#EDB40B]"
          >
            3D Engine Explorer
          </button>
          <button
            type="button"
            onClick={() => onJumpSection('architecture')}
            className="transition-colors hover:text-[#EDB40B]"
          >
            Architecture
          </button>
          <button
            type="button"
            onClick={() => onJumpSection('quickstart')}
            className="transition-colors hover:text-[#EDB40B]"
          >
            Quickstart
          </button>
        </nav>

        <a
          href="https://github.com/jvstin47/apex-strategy-v6"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md transition-colors hover:border-[#EDB40B] hover:text-[#EDB40B]"
        >
          <Github className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </a>
      </header>

      {/* Compact Hero Title Strip */}
      <div className="relative z-20 mx-auto mt-3 max-w-4xl px-6 text-center md:mt-2">
        <div className="animate-fade-slide-down inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-white/75 uppercase backdrop-blur-md">
          <Cpu className="h-3.5 w-3.5 text-[#EDB40B]" />
          <span>Stochastic F1 Race Strategy Simulator &amp; Hybrid MCTS Replanner</span>
        </div>
        <h1 className="animate-fade-slide-up delay-100 mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
          10,000 Races Simulated.{' '}
          <span className="text-[#EDB40B]">Every Pit Window Solved.</span>
        </h1>
        <p className="animate-fade-slide-up delay-200 mx-auto mt-2 max-w-2xl text-sm text-white/60 md:text-base">
          A visual walkthrough of Apex Strategy v6—combining vectorized NumPy Monte Carlo,
          4-regime Race Control, 10-car Virtual Grid dynamics, and OpenF1 counterfactual replays.
        </p>
      </div>

      {/* Desktop 3-Phone Showcase */}
      <div className="relative z-[2] hidden w-full items-end justify-center gap-[2.2vw] px-6 pt-6 pb-8 md:flex">
        {/* Left Phone — Monte Carlo Engine */}
        <div className="animate-fade-slide-up delay-300">
          <PhoneMockup>
            <ScreenMonteCarlo onJumpSection={onJumpSection} />
          </PhoneMockup>
        </div>

        {/* Center Phone — Hybrid MCTS & Silverstone Counterfactual (elevated) */}
        <div className="animate-fade-slide-up delay-500 -mb-4">
          <PhoneMockup>
            <ScreenSilverstoneMCTS
              runsCount={runsCount}
              testsCount={testsCount}
              seasonCount={seasonCount}
              onJumpSection={onJumpSection}
            />
          </PhoneMockup>
        </div>

        {/* Right Phone — Virtual Grid & Race Control */}
        <div className="animate-fade-slide-up delay-700">
          <PhoneMockup>
            <ScreenVirtualGrid onJumpSection={onJumpSection} />
          </PhoneMockup>
        </div>
      </div>

      {/* Mobile 3-Phone Stack */}
      <div className="relative z-[2] flex flex-col items-center gap-[40px] px-[20px] py-[28px] md:hidden">
        <div className="animate-fade-slide-up delay-300">
          <PhoneMockup>
            <ScreenMonteCarlo onJumpSection={onJumpSection} />
          </PhoneMockup>
        </div>
        <div className="animate-fade-slide-up delay-500">
          <PhoneMockup>
            <ScreenSilverstoneMCTS
              runsCount={runsCount}
              testsCount={testsCount}
              seasonCount={seasonCount}
              onJumpSection={onJumpSection}
            />
          </PhoneMockup>
        </div>
        <div className="animate-fade-slide-up delay-700">
          <PhoneMockup>
            <ScreenVirtualGrid onJumpSection={onJumpSection} />
          </PhoneMockup>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-20 flex justify-center pb-5">
        <button
          type="button"
          onClick={() => onJumpSection('engine-explorer')}
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-white/50 uppercase transition-colors hover:text-[#EDB40B]"
        >
          <span>Scroll to Explore the 3D Engine Drum</span>
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* Phone Screen 1: Monte Carlo & Two-Phase Tire Cliff                         */
/* -------------------------------------------------------------------------- */
const ScreenMonteCarlo: React.FC<{ onJumpSection: (id: string) => void }> = ({ onJumpSection }) => {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0a0e1c] px-5 pt-[86px] pb-0">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 70% 25%, rgba(237, 180, 11, 0.18), rgba(10, 14, 28, 0.95) 70%)',
        }}
      />
      <PhoneNav badge="SIMULATOR" onJumpSection={onJumpSection} />

      <div className="animate-fade-slide-up delay-300 relative z-10 mt-3">
        <div className="flex items-center gap-2 text-[15px] text-white/60">
          <span>Vectorized NumPy</span>
          <span className="inline-block h-2 w-2 rounded-full bg-[#EDB40B]" />
        </div>
        <h2 className="mt-1 text-[48px] font-normal leading-[0.94] tracking-[-0.05em] text-white">
          Monte
          <br />
          Carlo
        </h2>
      </div>

      {/* Two-Phase Tire Cliff SVG Visual */}
      <div className="animate-scale-in delay-500 relative z-[5] mt-6 flex flex-1 flex-col justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-white/60">
            <span>TIRE CLIFF MODEL</span>
            <span className="text-[#EDB40B]">2-PHASE DEG</span>
          </div>
          <svg viewBox="0 0 300 170" className="w-full overflow-visible">
            {/* Grid */}
            <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(255,255,255,0.08)" />
            <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(255,255,255,0.08)" />
            <line x1="0" y1="140" x2="300" y2="140" stroke="rgba(255,255,255,0.08)" />
            {/* Hard */}
            <path
              d="M 10 135 Q 150 128 290 105"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.65"
            />
            {/* Medium */}
            <path
              d="M 10 125 Q 140 112 205 88 T 290 36"
              fill="none"
              stroke="#EDB40B"
              strokeWidth="3"
            />
            {/* Soft with steep cliff */}
            <path
              d="M 10 112 Q 95 98 135 72 T 210 14"
              fill="none"
              stroke="#E10600"
              strokeWidth="3"
            />
            {/* Cliff Marker */}
            <circle cx="135" cy="72" r="5" fill="#E10600" />
            <text x="144" y="68" fill="#ffffff" fontSize="10" fontFamily="JetBrains Mono">
              Cliff Lap
            </text>
          </svg>
          <div className="mt-2 flex items-center justify-between text-[11px] text-white/60">
            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-[#E10600]" /> Soft
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-[#EDB40B]" /> Medium
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-white/80" /> Hard
            </span>
          </div>
        </div>
      </div>

      {/* Signature Bottom Blur Glass Overlay */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[7] h-[42%]"
        style={{
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          mask: 'linear-gradient(to bottom, transparent 0%, black 55%)',
          WebkitMask: 'linear-gradient(to bottom, transparent 0%, black 55%)',
        }}
      />

      {/* Bottom Display Headline */}
      <div className="relative z-10 mt-auto pb-6">
        <div className="animate-fade-slide-up delay-700 mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-mono text-white/85">
          <span>Fuel Burn + Track Evolution</span>
        </div>
        <div className="animate-speed-reveal delay-800 text-[58px] font-semibold leading-[0.84] tracking-[-0.05em] text-white">
          10,000
          <br />
          <span className="text-[#EDB40B]">Runs</span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Phone Screen 2: Silverstone MCTS & Telemetry Count-Up Stats                */
/* -------------------------------------------------------------------------- */
const ScreenSilverstoneMCTS: React.FC<{
  runsCount: string;
  testsCount: string;
  seasonCount: string;
  onJumpSection: (id: string) => void;
}> = ({ runsCount, testsCount, seasonCount, onJumpSection }) => {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0a0e1c] px-5 pt-[86px] pb-7">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, rgba(225, 6, 0, 0.22), rgba(10, 14, 28, 0.96) 72%)',
        }}
      />
      <PhoneNav badge="MCTS + DP" onJumpSection={onJumpSection} />

      <div className="animate-fade-slide-up delay-400 relative z-10 mb-3">
        <div className="flex items-center gap-2 text-[15px] text-white/60">
          <span>United Kingdom • OpenF1</span>
        </div>
        <h2 className="mt-1 text-[46px] font-normal leading-[0.94] tracking-[-0.05em] text-white">
          Silverstone
          <br />
          Counterfactual
        </h2>
      </div>

      {/* Stylized Silverstone Circuit Trace */}
      <div className="animate-scale-in delay-600 relative z-10 flex flex-1 items-center justify-center">
        <svg viewBox="0 0 320 150" className="h-full max-h-[150px] w-full">
          <path
            d="M 42 110 L 95 110 L 118 76 L 160 72 L 185 32 L 245 28 L 282 54 L 256 96 L 210 92 L 195 122 L 85 126 Z"
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M 42 110 L 95 110 L 118 76 L 160 72 L 185 32 L 245 28 L 282 54 L 256 96 L 210 92 L 195 122 L 85 126 Z"
            fill="none"
            stroke="#EDB40B"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeDasharray="6 4"
          />
          <circle cx="185" cy="32" r="6" fill="#E10600" />
          <text x="196" y="36" fill="#ffffff" fontSize="10" fontFamily="JetBrains Mono">
            SC Lap 33 → Softs
          </text>
        </svg>
      </div>

      {/* Count-Up Telemetry Numbers */}
      <div className="animate-fade-slide-up delay-800 relative z-10 mt-auto pt-2">
        <div className="mb-2 flex items-center gap-2 text-[13px] text-white/60">
          <ShieldCheck className="h-4 w-4 text-[#EDB40B]" />
          <span>Verified Engine Telemetry</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span
              className="bg-clip-text text-[62px] font-semibold leading-[0.84] tracking-[-0.06em] text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.45) 60%, transparent 95%)',
              }}
            >
              {runsCount}
            </span>
            <span className="font-mono text-[11px] text-white/50 uppercase">MC Runs</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span
              className="bg-clip-text text-[62px] font-semibold leading-[0.84] tracking-[-0.06em] text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.45) 60%, transparent 95%)',
              }}
            >
              {testsCount}
            </span>
            <span className="font-mono text-[11px] text-white/50 uppercase">Pytest Specs</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-[72px] font-semibold leading-[0.82] tracking-[-0.06em] text-[#EDB40B]">
              {seasonCount}
            </span>
            <span className="font-mono text-[11px] text-[#EDB40B] uppercase">OpenF1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Phone Screen 3: Virtual Grid & Race Control Glass Cards                    */
/* -------------------------------------------------------------------------- */
const ScreenVirtualGrid: React.FC<{ onJumpSection: (id: string) => void }> = ({ onJumpSection }) => {
  const bars = [
    { pos: 'P1', pct: 84, color: '#EDB40B' },
    { pos: 'P2', pct: 62, color: '#ffffff' },
    { pos: 'P3', pct: 46, color: '#ffffff' },
    { pos: 'P4', pct: 28, color: '#94a3b8' },
    { pos: 'P5', pct: 18, color: '#64748b' },
  ];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0a0e1c]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 25% 25%, rgba(56, 189, 248, 0.16), rgba(10, 14, 28, 0.96) 70%)',
        }}
      />
      <PhoneNav badge="GRID + RC" onJumpSection={onJumpSection} />

      <div className="animate-fade-slide-up delay-300 absolute left-5 top-[92px] z-10">
        <div className="text-[14px] text-white/60">10-Car Pack Simulation</div>
        <div className="mt-1 text-[48px] font-normal leading-[0.85] tracking-[-0.08em] text-white">
          Virtual
          <br />
          Grid
        </div>
      </div>

      <div className="animate-fade-slide-up delay-500 absolute left-5 top-[224px] z-10">
        <div className="text-[13px] font-mono text-white/60 uppercase">Finish Distribution</div>
        <div className="text-[88px] font-semibold leading-[0.82] tracking-[-0.08em] text-[#EDB40B]">
          P1–P10
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="animate-fade-slide-left delay-700 absolute left-5 right-5 top-[340px] z-10 space-y-2">
        {bars.map((b) => (
          <div key={b.pos} className="flex items-center gap-2.5 text-[11px] font-mono">
            <span className="w-6 text-white/70">{b.pos}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${b.pct}%`, backgroundColor: b.color }}
              />
            </div>
            <span className="w-8 text-right text-white/60">{b.pct}%</span>
          </div>
        ))}
      </div>

      {/* Bottom Side-by-Side Glass Cards */}
      <div className="animate-fade-slide-up delay-900 absolute bottom-0 left-0 right-0 z-10 flex gap-2 px-3">
        <div
          style={{
            background: 'rgba(20,20,30,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderBottom: 'none',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          className="h-[170px] w-1/2 rounded-t-2xl p-3.5"
        >
          <div className="text-[12px] text-white/60">VSC Regime</div>
          <div className="mt-1 font-mono text-[11px] text-[#EDB40B]">1.40x Pace</div>
          <div className="mt-6 text-[54px] font-semibold leading-[0.8] tracking-[-0.06em] text-white">
            12<span className="text-[28px] text-white/60">s</span>
          </div>
          <div className="mt-2 text-[11px] text-white/50">Pit-lane loss</div>
        </div>

        <div
          style={{
            background: 'rgba(20,20,30,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderBottom: 'none',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          className="h-[170px] w-1/2 rounded-t-2xl p-3.5"
        >
          <div className="text-[12px] text-white/60">Safety Car</div>
          <div className="mt-1 font-mono text-[11px] text-[#E10600]">1.35x Pace</div>
          <div className="mt-6 text-[54px] font-semibold leading-[0.8] tracking-[-0.06em] text-white">
            8<span className="text-[28px] text-white/60">s</span>
          </div>
          <div className="mt-2 text-[11px] text-white/50">Free-ish stop</div>
        </div>
      </div>
    </div>
  );
};
