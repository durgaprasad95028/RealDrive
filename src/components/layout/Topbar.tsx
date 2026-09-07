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
    <header className="h-16 stitch-glass-elevated border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white stitch-glass"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => onNavigate('/dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black tracking-wider text-lg sm:text-xl text-white group-hover:text-cyan-400 transition-colors">
                REAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">DRIVE</span>
              </span>
              <span className="stitch-pill text-cyan-300 hidden sm:inline-flex text-[9px] py-0.5 px-2">
                SIM v1.0
              </span>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400 hidden sm:block">
              Realistic Car Life Simulator
            </p>
          </div>
        </div>
      </div>

      {/* Center Simulated Environment Telemetry Widget */}
      <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full stitch-glass border border-white/10">
        {/* Game Clock & Time Period */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold">{gameTime}</span>
          <span className="text-slate-400 text-[10px]">({timeOfDay})</span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Dynamic Weather & Temperature */}
        <div 
          onClick={() => onNavigate('/map')}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-300 cursor-pointer transition-colors"
          title={`Weather: ${currentWeather.name} - Road Grip: ${currentWeather.roadGripPct}%`}
        >
          {getWeatherIcon()}
          <span className="font-medium">{currentWeather.temperatureC}°C</span>
          <span className="text-[10px] text-slate-400 hidden xl:inline">({currentWeather.name})</span>
        </div>

        {/* Active Car Quick Readout */}
        {selectedVehicle && (
          <>
            <div className="w-px h-4 bg-white/10" />
            <div 
              onClick={() => onNavigate('/garage')}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-300 cursor-pointer"
              title="Selected Vehicle"
            >
              <span className="text-slate-400">Car:</span>
              <span className="font-mono text-white font-semibold">{selectedVehicle.name}</span>
              <span className={`text-[10px] font-mono ${selectedVehicle.health.fuel < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
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
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full stitch-glass border-cyan-500/40 text-cyan-300 text-xs font-semibold animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>ACTIVE JOB: {activeJob.title.slice(0, 14)}...</span>
          </button>
        )}

        {/* Wallet Balance Card */}
        <button
          onClick={() => onNavigate('/wallet')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl stitch-glass border border-white/10 hover:border-emerald-500/50 transition-all group"
        >
          <div className="p-1 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
            <WalletIcon className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-medium uppercase text-slate-400 leading-none">Wallet</p>
            <p className="text-xs sm:text-sm font-mono font-bold text-emerald-400 leading-tight">
              ₹{wallet.balance.toLocaleString()}
            </p>
          </div>
        </button>

        {/* Reputation & Driver Level */}
        {driver && (
          <button
            onClick={() => onNavigate('/profile')}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-2xl stitch-glass border border-white/10 hover:border-cyan-500/50 transition-all"
          >
            <div className="p-1 rounded-xl bg-blue-950 text-cyan-400 border border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-medium uppercase text-slate-400 leading-none">Reputation</p>
              <p className="text-xs font-mono font-bold text-cyan-400 leading-tight">
                {driver.reputation}/100
              </p>
            </div>
          </button>
        )}

        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigate('/notifications')}
          className="relative p-2 rounded-2xl stitch-glass border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          title="Notification Center"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-pulse">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => onNavigate('/profile')}
          className="w-9 h-9 rounded-2xl stitch-glass border border-white/10 flex items-center justify-center text-lg hover:border-cyan-400 transition-colors"
          title="Driver Profile"
        >
          {driver?.avatar || <UserIcon className="w-4 h-4 text-slate-400" />}
        </button>
      </div>
    </header>
  );
};
