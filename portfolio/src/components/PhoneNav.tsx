import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PhoneNavProps {
  badge?: string;
  onJumpSection?: (id: string) => void;
}

export const PhoneNav: React.FC<PhoneNavProps> = ({ badge = 'APEX v6', onJumpSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Engine Drum', target: 'engine-explorer' },
    { label: 'Architecture', target: 'architecture' },
    { label: 'Benchmarks', target: 'quickstart' },
  ];

  return (
    <>
      <div className="absolute left-0 right-0 top-0 z-30 mt-[24px] flex h-12 items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#E10600]" />
          <span className="text-[13px] font-bold tracking-[0.14em] text-white uppercase">
            {badge}
          </span>
        </div>

        <div className="flex items-center">
          <div className="flex h-11 w-11 items-center justify-center bg-white text-[10px] font-bold tracking-tight text-black">
            F1
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open phone menu"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            className="flex h-11 w-11 flex-col items-end justify-center gap-[5px] px-3 transition-colors hover:bg-white/25"
          >
            <span className="block h-[2px] w-[20px] rounded-full bg-white" />
            <span className="block h-[2px] w-[10px] rounded-full bg-white" />
          </button>
        </div>
      </div>

      {/* Full-screen F1 Red Gradient Menu Overlay */}
      <div
        style={{
          background: 'linear-gradient(160deg, #1a0000 0%, #8B0000 40%, #E10600 100%)',
        }}
        className={`absolute inset-0 z-50 flex flex-col justify-between p-6 transition-opacity duration-300 ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-[0.18em] text-white/70 uppercase">
            Apex Strategy v6
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close phone menu"
            className="flex h-10 w-10 items-center justify-center bg-white/15 text-white hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {navItems.map((item, i) => (
            <button
              key={item.target}
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onJumpSection?.(item.target);
              }}
              style={{
                transitionDelay: menuOpen ? `${0.08 + i * 0.07}s` : '0s',
                transform: menuOpen ? 'translateX(0)' : 'translateX(-20px)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="text-left text-3xl font-bold tracking-tight text-white transition-all duration-300 hover:text-[#EDB40B]"
            >
              {item.label}
            </button>
          ))}
        </div>

        <a
          href="https://github.com/jvstin47/apex-strategy-v6"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center bg-white py-3.5 text-sm font-semibold text-black transition-colors hover:bg-[#EDB40B]"
        >
          View Source on GitHub
        </a>
      </div>
    </>
  );
};
