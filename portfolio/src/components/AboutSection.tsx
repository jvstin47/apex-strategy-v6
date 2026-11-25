import React from 'react';
import { RevealOnScroll } from './RevealOnScroll';

const F1_CAR_IMAGE =
  'https://framerusercontent.com/images/MzKCSYB4uVt9psQq4jRwQNRDjc.png';
const CHASSIS_ICON =
  'https://framerusercontent.com/images/zIA1tYDOAdZo3k6IXX9gBC5FGbY.png';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="mx-auto w-full max-w-7xl px-6 py-20">
      <RevealOnScroll>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#14141e]/80 p-8 backdrop-blur-xl md:p-12">
          {/* Subtle F1 Red accent glow */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
            style={{ background: 'radial-gradient(circle, #E10600, transparent 70%)' }}
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-[#EDB40B] uppercase">
                <img src={CHASSIS_ICON} alt="" className="h-4 w-4 object-contain" />
                <span>About The Project</span>
              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Why Apex Strategy v6 Exists
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
                Formula 1 pit-wall decisions happen under compounding uncertainty—two-phase tire
                cliffs, DRS traffic traps, sudden Safety Cars, and shifting rain crossovers. Most
                toy calculators treat lap times as deterministic averages.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
                <strong className="text-white">Apex Strategy v6</strong> pairs a vectorized{' '}
                <span className="text-[#EDB40B]">10,000-run NumPy Monte Carlo</span> engine with a
                Risk-Aware Dynamic Programming baseline and a live{' '}
                <span className="text-[#EDB40B]">Hybrid MCTS</span> replanner—calibrated against
                real FastF1 &amp; OpenF1 telemetry from the 2023 season.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                  <div className="font-mono text-[10px] text-white/45 uppercase">Backend</div>
                  <div className="mt-1 text-sm font-semibold text-white">FastAPI + NumPy</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                  <div className="font-mono text-[10px] text-white/45 uppercase">Simulator App</div>
                  <div className="mt-1 text-sm font-semibold text-white">React 18 + Recharts</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                  <div className="font-mono text-[10px] text-white/45 uppercase">This Showcase</div>
                  <div className="mt-1 text-sm font-semibold text-[#EDB40B]">Static GH Pages</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center lg:col-span-5">
              <img
                src={F1_CAR_IMAGE}
                alt="Formula 1 Car Telemetry Showcase"
                className="animate-fade-slide-left w-full max-w-md object-contain drop-shadow-[0_24px_40px_rgba(225,6,0,0.22)]"
              />
              <div className="mt-3 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                Stochastic Race Engineering
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
