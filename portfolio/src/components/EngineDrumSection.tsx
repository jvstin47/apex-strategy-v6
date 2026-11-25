import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown, Sliders, CloudRain, Flag, Layers } from 'lucide-react';
import {
  DRUM_MODULES,
  DrumModule,
  RACE_REGIMES,
  RaceRegime,
  REPLAY_COMPARISONS,
} from '../data/projectData';

const STEP_DEG = 360 / DRUM_MODULES.length; // 36° per card for 10 cards
const DRUM_RADIUS = 380;
const PERSPECTIVE_PX = 1400;
const OMEGA = 8.5; // Critically damped spring natural frequency (rad/s)

export const EngineDrumSection: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef<number>(-60);
  const targetRef = useRef<number>(0);
  const velRef = useRef<number>(0);
  const draggingRef = useRef<boolean>(false);
  const lastYRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);
  const dragVelRef = useRef<number>(0);

  const [displayAngle, setDisplayAngle] = useState<number>(0);
  const [selectedRegime, setSelectedRegime] = useState<RaceRegime>(RACE_REGIMES[1]);
  const [rainIntensity, setRainIntensity] = useState<number>(38);

  // Determine which card is closest to front (angle = 0 mod 360)
  const rawIndex = Math.round(displayAngle / STEP_DEG);
  const activeIndex = ((rawIndex % DRUM_MODULES.length) + DRUM_MODULES.length) % DRUM_MODULES.length;
  const activeModule: DrumModule = DRUM_MODULES[activeIndex];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      angleRef.current = 0;
      targetRef.current = 0;
      setDisplayAngle(0);
      return;
    }

    let rafId = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dtMs = Math.min(now - lastTime, 64);
      lastTime = now;

      if (!draggingRef.current) {
        const diff = targetRef.current - angleRef.current;
        if (Math.abs(diff) > 0.0005 || Math.abs(velRef.current) > 0.01) {
          let remaining = dtMs / 1000;
          while (remaining > 0) {
            const step = Math.min(remaining, 0.004);
            const acc =
              OMEGA * OMEGA * (targetRef.current - angleRef.current) -
              2 * OMEGA * velRef.current;
            velRef.current += acc * step;
            angleRef.current += velRef.current * step;
            remaining -= step;
          }
          setDisplayAngle(angleRef.current);
        } else if (angleRef.current !== targetRef.current) {
          angleRef.current = targetRef.current;
          velRef.current = 0;
          setDisplayAngle(angleRef.current);
        }
      }

      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  // Non-passive wheel listener only inside the drum stage
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      if (e.deltaMode === 2) delta *= window.innerHeight;

      targetRef.current += delta * (STEP_DEG / 260);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Keyboard navigation when section is focused or hovered
  const stepDrum = (dir: number) => {
    const currentSnap = Math.round(targetRef.current / STEP_DEG) * STEP_DEG;
    targetRef.current = currentSnap + dir * STEP_DEG;
  };

  const jumpToIndex = (index: number) => {
    const currentMod =
      ((Math.round(targetRef.current / STEP_DEG) % DRUM_MODULES.length) + DRUM_MODULES.length) %
      DRUM_MODULES.length;
    let deltaIdx = index - currentMod;
    if (deltaIdx > DRUM_MODULES.length / 2) deltaIdx -= DRUM_MODULES.length;
    if (deltaIdx < -DRUM_MODULES.length / 2) deltaIdx += DRUM_MODULES.length;
    targetRef.current = Math.round(targetRef.current / STEP_DEG) * STEP_DEG + deltaIdx * STEP_DEG;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    draggingRef.current = true;
    lastYRef.current = e.clientY;
    lastMoveTimeRef.current = performance.now();
    dragVelRef.current = 0;
    targetRef.current = angleRef.current;
    velRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dy = e.clientY - lastYRef.current;
    const dt = Math.max((now - lastMoveTimeRef.current) / 1000, 0.004);
    const dAngle = -dy * (STEP_DEG / 240);

    angleRef.current += dAngle;
    targetRef.current = angleRef.current;
    setDisplayAngle(angleRef.current);

    const instantVel = dAngle / dt;
    dragVelRef.current = 0.7 * instantVel + 0.3 * dragVelRef.current;
    lastYRef.current = e.clientY;
    lastMoveTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const elapsed = performance.now() - lastMoveTimeRef.current;
    if (elapsed < 90) {
      velRef.current = dragVelRef.current;
      targetRef.current = angleRef.current + (dragVelRef.current * 2) / OMEGA;
    }
  };

  return (
    <section
      id="engine-explorer"
      className="relative mx-auto w-full max-w-7xl px-6 py-24"
    >
      {/* Section Header */}
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="font-mono text-xs tracking-[0.18em] text-[#EDB40B] uppercase">
            Interactive 3D Engine Drum
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            How Apex Strategy v6 Thinks
          </h2>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Scroll, drag, or use the controls on the cylindrical drum to inspect every module,
            mathematical model, and 2023 counterfactual replay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => stepDrum(-1)}
            aria-label="Previous module"
            className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5 text-white transition-colors hover:border-[#EDB40B] hover:text-[#EDB40B]"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <span className="min-w-[64px] text-center font-mono text-xs text-white/70">
            {activeModule.index} / {DRUM_MODULES.length}
          </span>
          <button
            type="button"
            onClick={() => stepDrum(1)}
            aria-label="Next module"
            className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5 text-white transition-colors hover:border-[#EDB40B] hover:text-[#EDB40B]"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Split: 3D Drum Left + Live Module Inspector Right */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* 3D Cylindrical Drum Stage */}
        <div
          ref={stageRef}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
              e.preventDefault();
              stepDrum(1);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
              e.preventDefault();
              stepDrum(-1);
            }
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative h-[440px] select-none overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] outline-none touch-none lg:col-span-5"
          style={{ perspective: `${PERSPECTIVE_PX}px` }}
        >
          {/* Subtle top/bottom fade masks */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-[#0a0e1c] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-[#0a0e1c] to-transparent" />

          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateZ(-${DRUM_RADIUS}px) rotateX(${displayAngle}deg)`,
            }}
          >
            {DRUM_MODULES.map((mod, i) => {
              const thetaDeg = displayAngle - STEP_DEG * i;
              const thetaRad = (thetaDeg * Math.PI) / 180;
              const cosT = Math.cos(thetaRad);
              const isFront = cosT > 0.15;
              const isActive = i === activeIndex;

              return (
                <div
                  key={mod.id}
                  onClick={() => jumpToIndex(i)}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(-${STEP_DEG * i}deg) translateZ(${DRUM_RADIUS}px)`,
                    backfaceVisibility: 'hidden',
                    opacity: isFront ? Math.max(0.25, cosT) : 0.12,
                  }}
                  className={`absolute -left-[145px] -top-[78px] h-[156px] w-[290px] cursor-pointer rounded-xl border p-4 transition-colors ${
                    isActive
                      ? 'border-[#EDB40B] bg-[#14141e]/95 shadow-[0_0_30px_rgba(237,180,11,0.18)]'
                      : 'border-white/10 bg-[#14141e]/75 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span style={{ color: mod.accent }}>
                      {mod.index} // {mod.category.toUpperCase()}
                    </span>
                    <span className="text-white/40">{mod.metricValue}</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold tracking-tight text-white">
                    {mod.title}
                  </div>
                  <div className="mt-1 text-xs text-white/60">{mod.subtitle}</div>
                  <div className="mt-4 truncate font-mono text-[10px] text-white/40">
                    {mod.file}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-30 text-center font-mono text-[10px] tracking-widest text-white/40 uppercase">
            Wheel • Drag • Arrow Keys
          </div>
        </div>

        {/* Right Side: Live Module Inspector & Interactive Visual */}
        <div className="rounded-2xl border border-white/10 bg-[#14141e]/80 p-6 backdrop-blur-xl sm:p-8 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span
                className="font-mono text-xs uppercase"
                style={{ color: activeModule.accent }}
              >
                {activeModule.index} — {activeModule.category}
              </span>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {activeModule.title}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tracking-tight text-[#EDB40B]">
                {activeModule.metricValue}
              </div>
              <div className="font-mono text-[10px] text-white/50 uppercase">
                {activeModule.metricLabel}
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white/80">{activeModule.summary}</p>

          <ul className="mt-4 space-y-2">
            {activeModule.mechanics.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-xs text-white/70">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: activeModule.accent }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Context-aware Interactive Explainer */}
          <div className="mt-6 rounded-xl border border-white/10 bg-[#0a0e1c]/80 p-4">
            {activeModule.visualType === 'race-control' && (
              <div>
                <div className="mb-3 flex items-center gap-2 font-mono text-[11px] text-white/60 uppercase">
                  <Flag className="h-3.5 w-3.5 text-[#EDB40B]" />
                  <span>Interactive 4-Regime Matrix</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RACE_REGIMES.map((reg) => (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => setSelectedRegime(reg)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        selectedRegime.id === reg.id
                          ? 'border-[#EDB40B] bg-[#EDB40B]/15 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="font-mono text-[10px] text-white/50 uppercase">Pit Loss</div>
                    <div className="mt-1 text-lg font-bold" style={{ color: selectedRegime.color }}>
                      {selectedRegime.pitLoss}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="font-mono text-[10px] text-white/50 uppercase">Pace Mult</div>
                    <div className="mt-1 text-lg font-bold text-white">
                      {selectedRegime.paceMultiplier}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2.5">
                    <div className="font-mono text-[10px] text-white/50 uppercase">Window</div>
                    <div className="mt-1 text-xs font-semibold text-white/90">
                      {selectedRegime.optimalWindow}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-white/60">{selectedRegime.note}</p>
              </div>
            )}

            {activeModule.visualType === 'weather' && (
              <div>
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-white/60 uppercase">
                  <span className="flex items-center gap-2">
                    <CloudRain className="h-3.5 w-3.5 text-sky-400" />
                    <span>Weather Crossover Scrubber</span>
                  </span>
                  <span className="text-sky-400">Rain: {rainIntensity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={rainIntensity}
                  onChange={(e) => setRainIntensity(Number(e.target.value))}
                  className="w-full accent-[#EDB40B]"
                />
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-white/60">Recommended Compound:</span>
                  <span className="font-mono font-semibold text-[#EDB40B]">
                    {rainIntensity < 25
                      ? 'SLICK (Dry)'
                      : rainIntensity < 68
                        ? 'INTERMEDIATE (Crossover Zone)'
                        : 'FULL WET (Heavy Standing Water)'}
                  </span>
                </div>
              </div>
            )}

            {activeModule.visualType === 'replay' && activeModule.replayRace && (
              <div>
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-white/60 uppercase">
                  <span>{REPLAY_COMPARISONS[activeModule.replayRace].gp}</span>
                  <span className="text-[#EDB40B]">
                    {REPLAY_COMPARISONS[activeModule.replayRace].deltaSummary}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="font-mono text-[10px] text-white/40 uppercase">
                      Real Pit-Wall Call
                    </div>
                    <div className="mt-1 text-xs font-semibold text-white">
                      {REPLAY_COMPARISONS[activeModule.replayRace].realStrategy}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#EDB40B]/40 bg-[#EDB40B]/10 p-3">
                    <div className="font-mono text-[10px] text-[#EDB40B] uppercase">
                      Hybrid MCTS Call
                    </div>
                    <div className="mt-1 text-xs font-semibold text-white">
                      {REPLAY_COMPARISONS[activeModule.replayRace].mctsStrategy}
                    </div>
                  </div>
                </div>
                <p className="mt-2.5 text-xs text-white/65">
                  {REPLAY_COMPARISONS[activeModule.replayRace].keyMoment}
                </p>
              </div>
            )}

            {(activeModule.visualType === 'monte-carlo' ||
              activeModule.visualType === 'grid' ||
              activeModule.visualType === 'pipeline') && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {activeModule.visualType === 'grid' ? (
                    <Layers className="h-5 w-5 text-sky-400" />
                  ) : (
                    <Sliders className="h-5 w-5 text-[#EDB40B]" />
                  )}
                  <div>
                    <div className="font-mono text-[11px] text-white/50 uppercase">
                      Source Module
                    </div>
                    <div className="font-mono text-xs text-white">{activeModule.file}</div>
                  </div>
                </div>
                <span className="rounded border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/70">
                  {activeModule.category}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
