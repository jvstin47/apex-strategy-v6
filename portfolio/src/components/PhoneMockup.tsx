import React, { useEffect, useRef, useState } from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable iPhone-style frame that scales a 390px-wide internal layout
 * smoothly to any responsive phone-frame width via ResizeObserver.
 */
export const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, className = '' }) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentH, setContentH] = useState(844);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w > 0 && h > 0) {
        const nextScale = w / 390;
        setScale(nextScale);
        setContentH(Math.round(h / nextScale));
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="phone-frame relative rounded-[clamp(28px,3.6vw,50px)] bg-black p-[clamp(6px,0.9vw,11px)] shadow-2xl shadow-black/70">
        {/* Subtle metallic outer bezel ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[clamp(28px,3.6vw,50px)] ring-1 ring-white/15" />

        {/* Side hardware buttons */}
        <div className="pointer-events-none absolute -left-[2.5px] top-[19%] h-[4.5%] w-[3px] rounded-l bg-neutral-700" />
        <div className="pointer-events-none absolute -left-[2.5px] top-[26%] h-[7.3%] w-[3px] rounded-l bg-neutral-700" />
        <div className="pointer-events-none absolute -left-[2.5px] top-[35.5%] h-[7.3%] w-[3px] rounded-l bg-neutral-700" />
        <div className="pointer-events-none absolute -right-[2.5px] top-[30.8%] h-[11.4%] w-[3px] rounded-r bg-neutral-700" />

        {/* Screen viewport */}
        <div
          ref={screenRef}
          className="relative h-full w-full overflow-hidden rounded-[clamp(22px,2.9vw,40px)] bg-[#0a0e1c]"
        >
          {/* Dynamic Island */}
          <div className="pointer-events-none absolute left-1/2 top-[2.6%] z-50 h-[3.6%] w-[30%] -translate-x-1/2 rounded-full bg-black" />

          {/* Scaled 390px-wide canvas */}
          <div
            style={{
              width: 390,
              height: contentH,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            className="relative overflow-hidden"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
