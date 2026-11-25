import React, { useState } from 'react';
import { ArrowRight, Check, Copy, Terminal, Github } from 'lucide-react';

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Telemetry & Presets',
    detail: 'FastF1 session calibration + OpenF1 historical data + 5 circuits & 21 driver profiles.',
    tag: 'fastf1_service.py',
  },
  {
    step: '02',
    title: '10k Monte Carlo',
    detail: 'Vectorized NumPy simulation with two-phase tire cliff, fuel burn-off, and 4-regime RC.',
    tag: 'simulator.py',
  },
  {
    step: '03',
    title: 'DP + Hybrid MCTS',
    detail: 'Risk-aware DP baseline paired with live MCTS replanning under SC/VSC & rain.',
    tag: 'mcts/solver.py',
  },
  {
    step: '04',
    title: 'FastAPI + React 18',
    detail: 'Dual-mounted /api/v1 endpoints with unified JSON errors & code-split Vite UI.',
    tag: 'main.py + App.jsx',
  },
];

const QUICKSTART_CMD = `# Backend (port 8005)
cd backend && ./venv/bin/python main.py

# Frontend Simulator (port 3000)
cd frontend && npm run dev`;

export const ArchitectureSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(QUICKSTART_CMD);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      {/* System Pipeline */}
      <section id="architecture" className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mb-10">
          <div className="font-mono text-xs tracking-[0.18em] text-[#EDB40B] uppercase">
            End-to-End Pipeline
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            From Raw Telemetry to Pit-Wall Decisions
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PIPELINE_STEPS.map((item, idx) => (
            <div
              key={item.step}
              className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#14141e]/75 p-6 backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#EDB40B]">{item.step}</span>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 text-white/25 lg:block" />
                  )}
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/65">{item.detail}</p>
              </div>
              <div className="mt-5 border-t border-white/10 pt-3 font-mono text-[11px] text-white/45">
                {item.tag}
              </div>
            </div>
          ))}
        </div>

        {/* Engineering Rigor Strip */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-2xl font-bold tracking-tight text-white">54</div>
            <div className="mt-1 font-mono text-[11px] text-white/50 uppercase">
              Backend Pytest Specs
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-2xl font-bold tracking-tight text-white">7</div>
            <div className="mt-1 font-mono text-[11px] text-white/50 uppercase">
              Frontend Vitest Specs
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-2xl font-bold tracking-tight text-[#EDB40B]">12.05 kB</div>
            <div className="mt-1 font-mono text-[11px] text-white/50 uppercase">
              Gzipped Entry Bundle
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-2xl font-bold tracking-tight text-white">5 / 21</div>
            <div className="mt-1 font-mono text-[11px] text-white/50 uppercase">
              Circuits &amp; Drivers
            </div>
          </div>
        </div>
      </section>

      {/* Quickstart & Footer */}
      <section id="quickstart" className="mx-auto w-full max-w-7xl px-6 pt-6 pb-24">
        <div className="rounded-2xl border border-white/10 bg-[#14141e]/85 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#EDB40B] uppercase">
                <Terminal className="h-3.5 w-3.5" />
                <span>Run the Full Simulator Locally</span>
              </div>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                Separate App Frontend &amp; FastAPI Engine
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:border-[#EDB40B] hover:text-[#EDB40B]"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Commands'}</span>
              </button>
              <a
                href="https://github.com/jvstin47/apex-strategy-v6"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#EDB40B] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-white"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Repository</span>
              </a>
            </div>
          </div>

          <pre className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-[#0a0e1c] p-4 font-mono text-xs leading-relaxed text-white/80">
            <code>{QUICKSTART_CMD}</code>
          </pre>
        </div>

        <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <span>Apex Strategy v6 — Interactive Project Showcase</span>
          <span>Deployed separately from the simulator frontend</span>
        </footer>
      </section>
    </>
  );
};
