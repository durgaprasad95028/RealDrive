import React from 'react';
import { 
  Gauge, 
  Car, 
  Wrench, 
  Briefcase, 
  Map, 
  ShieldCheck, 
  Fuel, 
  TrendingUp, 
  AlertTriangle,
  Play,
  ArrowRight,
  Clock,
  Compass,
  Zap,
  Sparkles,
  Settings,
  LogOut,
  Target,
  Award,
  DollarSign
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { 
    driver, 
    user, 
    wallet, 
    selectedVehicle, 
    activeJob, 
    currentWeather, 
    timeOfDay, 
    gameTime, 
    violations,
    logout 
  } = useGame();

  const unpaidFines = violations.filter(v => !v.isPaid);

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  return (
    <PageContainer>
      {/* ========================================================================= */}
      {/* 1. TOP HERO GAME BANNER (STITCH GLASSMORPHIC HERO) */}
      {/* ========================================================================= */}
      <div className="relative p-6 sm:p-8 rounded-3xl stitch-glass-elevated border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="relative z-10 space-y-2.5 text-left w-full lg:w-auto">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-2xl">{driver?.avatar || '🏎️'}</span>
            <span className="stitch-pill text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {driver?.careerLevel || 'ROOKIE'} • SIMULATOR ACTIVE
            </span>
            <Badge variant="success" size="sm">ONLINE</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
            WELCOME TO REAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">DRIVE</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-xl">
            Driver: <strong className="text-white">{driver?.name || user?.fullName || 'Player'}</strong> • Location: <span className="text-cyan-400 font-mono font-semibold">{driver?.currentLocation || 'City Center Plaza'}</span>
          </p>
        </div>

        {/* Quick Start Drive Button */}
        <div className="relative z-10 flex items-center gap-3 w-full lg:w-auto flex-wrap">
          <Button
            variant="primary"
            size="lg"
            glow
            leftIcon={<Play className="w-5 h-5 fill-current" />}
            onClick={() => onNavigate('/cars')}
            className="w-full sm:w-auto px-8 py-4 font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(59,130,246,0.4)] rounded-2xl"
          >
            DRIVE NOW
          </Button>
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<Car className="w-5 h-5 text-cyan-400" />}
            onClick={() => onNavigate('/cars')}
            className="w-full sm:w-auto px-6 py-4 font-bold text-sm tracking-wider uppercase stitch-glass rounded-2xl"
          >
            CARS / GARAGE
          </Button>
        </div>

        {/* Ambient Radial Glow */}
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Unpaid Fine Urgent Alert Banner if any */}
      {unpaidFines.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-950/70 border border-rose-800/80 text-rose-200 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 animate-bounce" />
            <span className="text-xs sm:text-sm font-mono">
              You have <strong>{unpaidFines.length} unpaid traffic citation(s)</strong>. Settle them to prevent license suspension.
            </span>
          </div>
          <Button variant="danger" size="sm" onClick={() => onNavigate('/police')}>
            Pay Fines
          </Button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN DRIVER TELEMETRY / STATS BENTO GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <div className="p-5 rounded-3xl stitch-glass border border-white/10 hover:border-emerald-500/40 transition flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Wallet Balance
            </span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              ₹{wallet.balance.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">
              Today: +₹{wallet.todayIncome.toLocaleString()}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center justify-center group-hover:scale-105 transition-transform">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Driver License Status */}
        <div className="p-5 rounded-3xl stitch-glass border border-white/10 hover:border-cyan-500/40 transition flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              License Status
            </span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              {driver?.license.status || 'VALID'}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">
              Points: {driver?.license.penaltyPoints || 0}/12 Max
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-950/80 text-cyan-400 border border-blue-800/60 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Safe Driving Score */}
        <div className="p-5 rounded-3xl stitch-glass border border-white/10 hover:border-amber-500/40 transition flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Safe Driving Score
            </span>
            <span className="text-2xl font-black font-mono text-amber-400">
              {driver?.stats.safeDrivingScore || 100}%
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">
              Reputation: {driver?.reputation || 85}/100
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 text-amber-400 border border-amber-800/60 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Total Distance Driven */}
        <div className="p-5 rounded-3xl stitch-glass border border-white/10 hover:border-cyan-500/40 transition flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Distance Driven
            </span>
            <span className="text-2xl font-black font-mono text-cyan-400">
              {driver?.stats.totalDistanceKm || 0} KM
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">
              Jobs Done: {driver?.stats.jobsCompleted || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Gauge className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SELECTED ACTIVE CAR SPOTLIGHT (STITCH BENTO CARD) */}
      {/* ========================================================================= */}
      {selectedVehicle && (
        <div className="p-6 sm:p-8 rounded-3xl stitch-glass-elevated border border-white/10 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  ACTIVE VEHICLE READY FOR ROAD
                </span>
                <span className="stitch-pill text-cyan-300">SELECTED</span>
              </div>
              <h2 className="text-2xl font-black font-display text-white mt-1">
                {selectedVehicle.brand} {selectedVehicle.name} ({selectedVehicle.category})
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Car className="w-4 h-4 text-cyan-400" />}
                onClick={() => onNavigate('/cars')}
                className="stitch-glass rounded-xl"
              >
                SWITCH CAR
              </Button>
              <Button
                variant="primary"
                size="md"
                glow
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={() => onNavigate('/game')}
                className="shadow-[0_0_20px_rgba(59,130,246,0.4)] rounded-xl uppercase font-bold text-xs"
              >
                LAUNCH 3D DRIVE
              </Button>
            </div>
          </div>

          {/* Vehicle Stats Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3.5 rounded-2xl stitch-glass border border-white/5 space-y-1.5">
              <span className="text-slate-400 block text-[10px] uppercase">Top Speed</span>
              <span className="text-base font-bold text-cyan-400">{selectedVehicle.topSpeedKmH} km/h</span>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${(selectedVehicle.topSpeedKmH / 320) * 100}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl stitch-glass border border-white/5 space-y-1.5">
              <span className="text-slate-400 block text-[10px] uppercase">Engine Power</span>
              <span className="text-base font-bold text-amber-400">{selectedVehicle.powerHp} HP</span>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${(selectedVehicle.powerHp / 600) * 100}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl stitch-glass border border-white/5 space-y-1.5">
              <span className="text-slate-400 block text-[10px] uppercase">Fuel Capacity</span>
              <span className="text-base font-bold text-cyan-400">{selectedVehicle.fuelCapacityL} L ({selectedVehicle.fuelType})</span>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${selectedVehicle.health.fuel}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl stitch-glass border border-white/5 space-y-1.5">
              <span className="text-slate-400 block text-[10px] uppercase">Condition</span>
              <span className="text-base font-bold text-emerald-400">{selectedVehicle.overallCondition}%</span>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${selectedVehicle.overallCondition}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN GAME MENU NAVIGATION GRID (STITCH BENTO QUICK LAUNCHPAD) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        <button
          onClick={() => onNavigate('/cars')}
          className="p-5 rounded-3xl stitch-glass hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all flex flex-col items-center text-center space-y-2 group shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600/30 transition-transform">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            DRIVE
          </span>
          <span className="text-[10px] font-mono text-slate-400">3D Simulation</span>
        </button>

        <button
          onClick={() => onNavigate('/cars')}
          className="p-5 rounded-3xl stitch-glass hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all flex flex-col items-center text-center space-y-2 group shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-600/30 transition-transform">
            <Car className="w-6 h-6" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            CARS / GARAGE
          </span>
          <span className="text-[10px] font-mono text-slate-400">Fleet Showroom</span>
        </button>

        <button
          onClick={() => onNavigate('/missions')}
          className="p-5 rounded-3xl stitch-glass hover:border-emerald-400/50 hover:bg-white/[0.06] transition-all flex flex-col items-center text-center space-y-2 group shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600/30 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            MISSIONS
          </span>
          <span className="text-[10px] font-mono text-slate-400">Airport Taxi & Jobs</span>
        </button>

        <button
          onClick={() => onNavigate('/profile')}
          className="p-5 rounded-3xl stitch-glass hover:border-purple-400/50 hover:bg-white/[0.06] transition-all flex flex-col items-center text-center space-y-2 group shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600/30 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            PROFILE
          </span>
          <span className="text-[10px] font-mono text-slate-400">License & Stats</span>
        </button>

        <button
          onClick={() => onNavigate('/settings')}
          className="p-5 rounded-3xl stitch-glass hover:border-amber-400/50 hover:bg-white/[0.06] transition-all flex flex-col items-center text-center space-y-2 group shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600/30 transition-transform">
            <Settings className="w-6 h-6" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            SETTINGS
          </span>
          <span className="text-[10px] font-mono text-slate-400">Audio & Controls</span>
        </button>

        <button
          onClick={handleLogout}
          className="p-5 rounded-3xl stitch-glass hover:border-rose-400/50 hover:bg-white/[0.06] transition-all flex flex-col items-center text-center space-y-2 group shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-600/30 transition-transform">
            <LogOut className="w-6 h-6" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            LOGOUT
          </span>
          <span className="text-[10px] font-mono text-slate-400">Exit Session</span>
        </button>
      </div>
    </PageContainer>
  );
};
