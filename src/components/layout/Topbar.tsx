import React from 'react';
import { 
  Menu, 
  Wallet as WalletIcon, 
  ShieldCheck, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudFog,
  Bell,
  Gauge,
  Flame,
  User as UserIcon
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Badge } from '../common/Badge';

interface TopbarProps {
  activePath: string;
  onNavigate: (path: string) => void;
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onNavigate, onToggleSidebar }) => {
  const { wallet, driver, currentWeather, timeOfDay, gameTime, notifications, activeJob, selectedVehicle } = useGame();

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const getWeatherIcon = () => {
    switch (currentWeather.type) {
      case 'SUNNY': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'CLOUDY': return <Cloud className="w-4 h-4 text-slate-400" />;
      case 'RAIN': return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'HEAVY_RAIN': return <CloudLightning className="w-4 h-4 text-indigo-400" />;
      case 'FOG': return <CloudFog className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <header className="h-16 bg-[#0D1117]/95 border-b border-[#1F2937] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-secondary-text hover:text-primary-text hover:bg-surface-elevated"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => onNavigate('/dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-glow-blue">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black tracking-wider text-lg sm:text-xl text-primary-text group-hover:text-sky-400 transition-colors">
                REAL<span className="text-primary-blue">DRIVE</span>
              </span>
              <Badge variant="blue" size="sm" className="hidden sm:inline-flex">
                SIM v1.0
              </Badge>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-muted-text hidden sm:block">
              Realistic Car Life Simulator
            </p>
          </div>
        </div>
      </div>

      {/* Center Simulated Environment Telemetry Widget */}
      <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-surface/80 border border-app-border">
        {/* Game Clock & Time Period */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-primary-text">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold">{gameTime}</span>
          <span className="text-muted-text text-[10px]">({timeOfDay})</span>
        </div>

        <div className="w-px h-4 bg-app-border" />

        {/* Dynamic Weather & Temperature */}
        <div 
          onClick={() => onNavigate('/map')}
          className="flex items-center gap-1.5 text-xs text-secondary-text hover:text-sky-300 cursor-pointer transition-colors"
          title={`Weather: ${currentWeather.name} - Road Grip: ${currentWeather.roadGripPct}%`}
        >
          {getWeatherIcon()}
          <span className="font-medium">{currentWeather.temperatureC}°C</span>
          <span className="text-[10px] text-muted-text hidden xl:inline">({currentWeather.name})</span>
        </div>

        {/* Active Car Quick Readout */}
        {selectedVehicle && (
          <>
            <div className="w-px h-4 bg-app-border" />
            <div 
              onClick={() => onNavigate('/garage')}
              className="flex items-center gap-1.5 text-xs text-secondary-text hover:text-sky-300 cursor-pointer"
              title="Selected Vehicle"
            >
              <span className="text-muted-text">Car:</span>
              <span className="font-mono text-primary-text font-semibold">{selectedVehicle.name}</span>
              <span className={`text-[10px] font-mono ${selectedVehicle.health.fuel < 20 ? 'text-danger' : 'text-emerald-400'}`}>
                {selectedVehicle.health.fuel}% fuel
              </span>
            </div>
          </>
        )}
      </div>

      {/* Right User Stats, Wallet, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Mission / Job indicator */}
        {activeJob && (
          <button
            onClick={() => onNavigate('/drive')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-600/50 text-sky-400 text-xs font-semibold animate-pulse shadow-glow-blue"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>ACTIVE JOB: {activeJob.title.slice(0, 14)}...</span>
          </button>
        )}

        {/* Wallet Balance Card */}
        <button
          onClick={() => onNavigate('/wallet')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface/90 border border-app-border hover:border-emerald-500/50 transition-all group"
        >
          <div className="p-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
            <WalletIcon className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-medium uppercase text-muted-text leading-none">Wallet</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-emerald-400 leading-tight">
              ₹{wallet.balance.toLocaleString()}
            </p>
          </div>
        </button>

        {/* Reputation & Driver Level */}
        {driver && (
          <button
            onClick={() => onNavigate('/profile')}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface/90 border border-app-border hover:border-blue-500/50 transition-all"
          >
            <div className="p-1 rounded-md bg-blue-950 text-blue-400 border border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-medium uppercase text-muted-text leading-none">Reputation</p>
              <p className="text-xs font-mono font-bold text-sky-400 leading-tight">
                {driver.reputation}/100
              </p>
            </div>
          </button>
        )}

        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigate('/notifications')}
          className="relative p-2 rounded-xl bg-surface/80 border border-app-border text-secondary-text hover:text-primary-text hover:bg-surface-elevated transition-colors"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-mono font-bold flex items-center justify-center animate-pulse">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => onNavigate('/profile')}
          className="w-9 h-9 rounded-xl bg-surface-elevated border border-app-border-light flex items-center justify-center text-lg hover:border-sky-400 transition-colors"
          title="Driver Profile"
        >
          {driver?.avatar || <UserIcon className="w-4 h-4 text-secondary-text" />}
        </button>
      </div>
    </header>
  );
};
