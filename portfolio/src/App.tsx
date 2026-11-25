import React, { useEffect, useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { TelemetryTicker } from './components/TelemetryTicker';
import { EngineDrumSection } from './components/EngineDrumSection';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { AboutSection } from './components/AboutSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { LoadingScreen } from './components/LoadingScreen';
import { RevealOnScroll } from './components/RevealOnScroll';

export const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0) {
        setScrollPct(Math.min(100, Math.max(0, (window.scrollY / docH) * 100)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleJumpSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* Top Scroll Progress Racing Line */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-[2px] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#EDB40B] to-[#E10600] transition-[width] duration-75"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      <main className="min-h-screen w-full bg-[#0a0e1c] text-white">
        <HeroSection onJumpSection={handleJumpSection} />
        <TelemetryTicker />
        <RevealOnScroll>
          <EngineDrumSection />
        </RevealOnScroll>
        <InteractiveSandbox />
        <AboutSection />
        <RevealOnScroll>
          <ArchitectureSection />
        </RevealOnScroll>
      </main>
    </>
  );
};

export default App;
