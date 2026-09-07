import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Gauge, 
  Wrench, 
  Briefcase, 
  MoreHorizontal,
  Map,
  Wallet,
  Fuel,
  ShieldCheck,
  ShoppingBag,
  Award,
  Settings,
  X
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface MobileNavProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activePath, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/drive', label: 'Drive', icon: Gauge },
    { path: '/garage', label: 'Garage', icon: Wrench },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
  ];

  const moreItems = [
    { path: '/map', label: 'World Map', icon: Map },
    { path: '/wallet', label: 'Wallet & Ledger', icon: Wallet },
    { path: '/fuel', label: 'Fuel Station', icon: Fuel },
    { path: '/maintenance', label: 'Maintenance Hub', icon: Wrench },
    { path: '/insurance', label: 'Insurance', icon: ShieldCheck },
    { path: '/marketplace', label: 'Dealership', icon: ShoppingBag },
    { path: '/achievements', label: 'Achievements', icon: Award },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (path: string) => {
    audioService.playClick();
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* More Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-end">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)} 
          />
          <div className="relative z-50 bg-surface border-t border-app-border rounded-t-2xl p-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-app-border mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-text">RealDrive Navigation</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-lg text-secondary-text hover:text-primary-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = activePath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isActive 
                        ? 'bg-primary-blue text-white border-blue-500' 
                        : 'bg-surface-elevated text-secondary-text border-app-border hover:text-primary-text'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#0D1117]/95 border-t border-[#1F2937] backdrop-blur-md px-2 py-1.5 flex items-center justify-around">
        {mainItems.map(item => {
          const Icon = item.icon;
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-primary-blue font-bold' : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-primary-blue scale-110' : ''}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => {
            audioService.playClick();
            setIsMenuOpen(!isMenuOpen);
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium ${
            isMenuOpen ? 'text-sky-400' : 'text-secondary-text'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  );
};
