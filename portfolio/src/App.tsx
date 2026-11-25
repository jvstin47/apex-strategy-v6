import React from 'react';
import { HeroSection } from './components/HeroSection';
import { EngineDrumSection } from './components/EngineDrumSection';
import { ArchitectureSection } from './components/ArchitectureSection';

export const App: React.FC = () => {
  const handleJumpSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#0a0e1c] text-white">
      <HeroSection onJumpSection={handleJumpSection} />
      <EngineDrumSection />
      <ArchitectureSection />
    </main>
  );
};

export default App;
