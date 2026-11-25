import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

/**
 * F1 5-Red-Lights Start Sequence preloader.
 * Plays quickly (~1.35s) and supports instant skip or reduced-motion bypass.
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [litCount, setLitCount] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    const timers: number[] = [];
    for (let i = 1; i <= 5; i++) {
      timers.push(window.setTimeout(() => setLitCount(i), i * 160));
    }
    timers.push(window.setTimeout(() => setFading(true), 1050));
    timers.push(window.setTimeout(() => onComplete(), 1400));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070a14] transition-opacity duration-350 ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="mb-5 font-mono text-[11px] tracking-[0.26em] text-white/50 uppercase">
        Apex Strategy v6 // Pit-Wall Init
      </div>

      {/* 5 F1 Starting Lights */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111522] px-6 py-4 shadow-2xl">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = litCount >= n && !fading;
          return (
            <div
              key={n}
              className={`h-7 w-7 rounded-full border transition-all duration-150 sm:h-9 sm:w-9 ${
                active
                  ? 'border-[#ff4d4d] bg-[#E10600] shadow-[0_0_22px_#E10600]'
                  : 'border-white/10 bg-white/5'
              }`}
            />
          );
        })}
      </div>

      <div className="mt-4 font-mono text-xs text-[#EDB40B]">
        {fading ? 'LIGHTS OUT — ENGINE ONLINE' : 'CALIBRATING MONTE CARLO...'}
      </div>

      <button
        type="button"
        onClick={onComplete}
        className="mt-8 font-mono text-[10px] tracking-widest text-white/35 uppercase transition-colors hover:text-white/80"
      >
        Skip →
      </button>
    </div>
  );
};
