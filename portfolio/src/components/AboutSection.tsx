import React, { useState } from 'react';
import { RevealOnScroll } from './RevealOnScroll';

const F1_CAR_IMAGE =
  'https://framerusercontent.com/images/MzKCSYB4uVt9psQq4jRwQNRDjc.png';
const CHASSIS_ICON =
  'https://framerusercontent.com/images/zIA1tYDOAdZo3k6IXX9gBC5FGbY.png';
const FERRARI_ICON =
  'https://framerusercontent.com/images/sUDhzMuxKIOvqjSH5U1fn0QSXqI.png';
const LECLERC_STATS =
  'https://framerusercontent.com/images/MJfqhcmEoIBnfimJNhKqoZpq0.png';
const HAMILTON_STATS =
  'https://framerusercontent.com/images/3EwXxC1QutaGnlNDZMlAN66ZmTU.png';

const DRIVERS = {
  leclerc: {
    number: '16',
    name: 'Charles Leclerc',
    role: 'Qualifying Pace & Aggressive Undercut',
    statsImg: LECLERC_STATS,
    tireSave: '91%',
    consistency: '94%',
    pitDelta: '-0.18s',
  },
  hamilton: {
    number: '44',
    name: 'Lewis Hamilton',
    role: 'Late-Stint Tire Preservation & Overcut',
    statsImg: HAMILTON_STATS,
    tireSave: '97%',
    consistency: '96%',
    pitDelta: '-0.22s',
  },
};

export const AboutSection: React.FC = () => {
  const [driverKey, setDriverKey] = useState<'leclerc' | 'hamilton'>('hamilton');
  const activeDriver = DRIVERS[driverKey];

  return (
    <section id="about" className="mx-auto w-full max-w-7xl px-6 py-20">
      <RevealOnScroll>
        <div className="relative overflow-hidden rounded-3xl border border-[#E10600]/25 bg-[#14141e]/85 p-8 shadow-[0_0_70px_rgba(225,6,0,0.1)] backdrop-blur-xl md:p-12">
          {/* Soft Ferrari Rosso Corsa Ambient Glows */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, #E10600, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #EDB40B, transparent 70%)' }}
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-[#EDB40B] uppercase">
                <img src={CHASSIS_ICON} alt="" className="h-4 w-4 object-contain" />
                <span>Scuderia Pit-Wall Philosophy</span>
              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Built for Maranello-Grade Race Decisions
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
                Formula 1 pit-wall decisions happen under compounding uncertainty—two-phase tire
                cliffs, DRS traffic traps, sudden Safety Cars, and shifting rain crossovers. Most
                calculators treat lap times as deterministic averages.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
                <strong className="text-white">Apex Strategy v6</strong> pairs a vectorized{' '}
                <span className="text-[#EDB40B]">10,000-run NumPy Monte Carlo</span> engine with a
                Risk-Aware Dynamic Programming baseline and a live{' '}
                <span className="text-[#E10600] font-semibold">Hybrid MCTS</span> replanner—calibrated
                against 21 driver profiles and 5 Grand Prix circuits.
              </p>

              {/* Interactive Driver Profile Switcher */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0a0e1c]/85 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-white/60 uppercase">
                    <img src={FERRARI_ICON} alt="Ferrari" className="h-4 w-4 object-contain" />
                    <span>Driver Profile Calibration</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDriverKey('leclerc')}
                      className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                        driverKey === 'leclerc'
                          ? 'border-[#E10600] bg-[#E10600]/20 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      #16 Leclerc
                    </button>
                    <button
                      type="button"
                      onClick={() => setDriverKey('hamilton')}
                      className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                        driverKey === 'hamilton'
                          ? 'border-[#E10600] bg-[#E10600]/20 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      #44 Hamilton
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold text-white">{activeDriver.name}</div>
                    <div className="text-xs text-white/55">{activeDriver.role}</div>
                    <img
                      src={activeDriver.statsImg}
                      alt={activeDriver.name}
                      className="mt-2.5 h-5 w-auto object-contain"
                    />
                  </div>
                  <div className="text-right font-semibold leading-none tracking-[-0.08em] text-[#EDB40B] text-[56px]">
                    {activeDriver.number}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
                  <div>
                    <div className="font-mono text-[10px] text-white/45 uppercase">Tire Save</div>
                    <div className="mt-0.5 text-sm font-bold text-white">
                      {activeDriver.tireSave}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-white/45 uppercase">Consistency</div>
                    <div className="mt-0.5 text-sm font-bold text-white">
                      {activeDriver.consistency}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-white/45 uppercase">In-Lap Delta</div>
                    <div className="mt-0.5 text-sm font-bold text-[#EDB40B]">
                      {activeDriver.pitDelta}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center lg:col-span-6">
              <div className="relative flex w-full items-center justify-center">
                <div
                  className="pointer-events-none absolute h-48 w-72 rounded-full opacity-35 blur-3xl"
                  style={{ background: 'radial-gradient(circle, #E10600, transparent 70%)' }}
                />
                <img
                  src={F1_CAR_IMAGE}
                  alt="Scuderia Ferrari SF-26 Telemetry Car"
                  className="animate-fade-slide-left relative z-10 w-full max-w-lg object-contain drop-shadow-[0_28px_45px_rgba(225,6,0,0.3)]"
                />
              </div>
              <div className="mt-2 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E10600]" />
                <span>SF-26 Telemetry Twin • 21 Driver Profiles</span>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};
