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
      {/* 1. TOP HERO GAME BANNER */}
      {/* ========================================================================= */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-slate-950 border border-blue-500/30 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 text-left w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{driver?.avatar || '🏎️'}</span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
              {driver?.careerLevel || 'ROOKIE'} • SIMULATOR ACTIVE
            </span>
            <Badge variant="success" size="sm">ONLINE</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
            WELCOME TO REAL<span className="text-primary-blue">DRIVE</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-xl">
            Driver: <strong className="text-white">{driver?.name || user?.fullName || 'Player'}</strong> • Location: <span className="text-sky-400 font-mono font-semibold">{driver?.currentLocation || 'City Center Plaza'}</span>
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
            className="w-full sm:w-auto px-8 py-4 font-bold text-sm tracking-wider uppercase shadow-glow-blue"
          >
            DRIVE NOW
          </Button>
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<Car className="w-5 h-5 text-sky-400" />}
            onClick={() => onNavigate('/cars')}
            className="w-full sm:w-auto px-6 py-4 font-bold text-sm tracking-wider uppercase"
          >
            CARS / GARAGE
          </Button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Unpaid Fine Urgent Alert Banner if any */}
      {unpaidFines.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-950/70 border border-red-800 text-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 animate-bounce" />
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
      {/* 2. MAIN DRIVER TELEMETRY / STATS GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between">
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
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Driver License Status */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 transition flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              License Status
            </span>
            <span className="text-xl font-bold font-mono text-sky-400">
              {driver?.license.status || 'VALID'}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block">
              Points: {driver?.license.penaltyPoints || 0}/12 Max
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/60 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Safe Driving Score */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between">
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
          <div className="w-12 h-12 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/60 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Total Distance Driven */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition flex items-center justify-between">
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
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 flex items-center justify-center">
            <Gauge className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SELECTED ACTIVE CAR SPOTLIGHT */}
      {/* ========================================================================= */}
      {selectedVehicle && (
        <div className="p-6 rounded-3xl bg-slate-950/90 border border-blue-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                  ACTIVE VEHICLE READY FOR ROAD
                </span>
                <Badge variant="blue" size="sm">SELECTED</Badge>
              </div>
              <h2 className="text-2xl font-black font-display text-white mt-1">
                {selectedVehicle.brand} {selectedVehicle.name} ({selectedVehicle.category})
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Car className="w-4 h-4 text-sky-400" />}
                onClick={() => onNavigate('/cars')}
              >
                SWITCH CAR
              </Button>
              <Button
                variant="primary"
                size="md"
                glow
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={() => onNavigate('/game')}
              >
                LAUNCH 3D DRIVE
              </Button>
            </div>
          </div>

          {/* Vehicle Stats Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Top Speed</span>
              <span className="text-base font-bold text-sky-400">{selectedVehicle.topSpeedKmH} km/h</span>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400" style={{ width: `${(selectedVehicle.topSpeedKmH / 320) * 100}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Engine Power</span>
              <span className="text-base font-bold text-amber-400">{selectedVehicle.powerHp} HP</span>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${(selectedVehicle.powerHp / 600) * 100}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Fuel Capacity</span>
              <span className="text-base font-bold text-cyan-400">{selectedVehicle.fuelCapacityL} L ({selectedVehicle.fuelType})</span>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${selectedVehicle.health.fuel}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase">Condition</span>
              <span className="text-base font-bold text-emerald-400">{selectedVehicle.overallCondition}%</span>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${selectedVehicle.overallCondition}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN GAME MENU NAVIGATION GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
        <button
          onClick={() => onNavigate('/cars')}
          className="p-4 rounded-2xl bg-slate-950/80 hover:bg-blue-950/80 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            DRIVE
          </span>
          <span className="text-[10px] font-mono text-slate-500">3D Simulation</span>
        </button>

        <button
          onClick={() => onNavigate('/cars')}
          className="p-4 rounded-2xl bg-slate-950/80 hover:bg-sky-950/80 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Car className="w-5 h-5" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            CARS / GARAGE
          </span>
          <span className="text-[10px] font-mono text-slate-500">Fleet Showroom</span>
        </button>

        <button
          onClick={() => onNavigate('/missions')}
          className="p-4 rounded-2xl bg-slate-950/80 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            MISSIONS
          </span>
          <span className="text-[10px] font-mono text-slate-500">Airport Taxi & Jobs</span>
        </button>

        <button
          onClick={() => onNavigate('/profile')}
          className="p-4 rounded-2xl bg-slate-950/80 hover:bg-purple-950/80 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            PROFILE
          </span>
          <span className="text-[10px] font-mono text-slate-500">License & Stats</span>
        </button>

        <button
          onClick={() => onNavigate('/settings')}
          className="p-4 rounded-2xl bg-slate-950/80 hover:bg-amber-950/80 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            SETTINGS
          </span>
          <span className="text-[10px] font-mono text-slate-500">Audio & Controls</span>
        </button>

        <button
          onClick={handleLogout}
          className="p-4 rounded-2xl bg-slate-950/80 hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 transition-all flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-xs font-black font-display text-white uppercase tracking-wider">
            LOGOUT
          </span>
          <span className="text-[10px] font-mono text-slate-500">Exit Session</span>
        </button>
      </div>
    </PageContainer>
  );
};
