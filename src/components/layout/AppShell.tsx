import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';

interface AppShellProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activePath, onNavigate }) => {
  const { advanceTime } = useGame();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Background game time ticker (1 game minute every 8 real seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      advanceTime(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [advanceTime]);

  return (
    <div className="min-h-screen bg-[#07090D] text-[#F8FAFC] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar */}
      <Topbar 
        activePath={activePath} 
        onNavigate={onNavigate}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Automotive Sidebar */}
        <Sidebar 
          activePath={activePath} 
          onNavigate={onNavigate} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8 bg-grid-pattern bg-[#07090D]/90 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-gradient pointer-events-none opacity-60" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav activePath={activePath} onNavigate={onNavigate} />
    </div>
  );
};
