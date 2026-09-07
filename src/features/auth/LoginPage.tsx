import React, { useState } from 'react';
import { 
  Gauge, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Car,
  Compass,
  Radio,
  Flame
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { audioService } from '../../services/audioService';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useGame();
  const [username, setUsername] = useState('player');
  const [password, setPassword] = useState('player123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      audioService.playAlert();
      setError('Please enter both username/email and password.');
      return;
    }
    setError(null);
    setIsLoading(true);
    audioService.playClick();

    setTimeout(() => {
      const res = login(username.trim(), password);
      setIsLoading(false);
      if (res.success) {
        audioService.playGearShift();
        onNavigate('/dashboard');
      } else {
        audioService.playAlert();
        setError(res.message || 'Invalid credentials. Use demo player (player / player123)');
      }
    }, 350);
  };

  const handleQuickDemo = (demoType: 'player' | 'admin') => {
    setIsLoading(true);
    setError(null);
    audioService.playClick();
    
    setTimeout(() => {
      if (demoType === 'player') {
        login('player', 'player123');
        audioService.playGearShift();
        onNavigate('/dashboard');
      } else {
        login('admin', 'admin123');
        audioService.playGearShift();
        onNavigate('/admin');
      }
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="relative w-screen h-screen min-h-screen max-h-screen m-0 p-0 overflow-hidden box-border select-none bg-[#05070B] flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC REALISTIC SUPERCAR / DARK HIGHWAY BACKGROUND (100vw x 100vh) */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat pointer-events-none z-0 scale-100 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=90&w=2560&auto=format&fit=crop')`,
          backgroundPosition: 'center 42%',
        }}
      />

      {/* Atmospheric dark gradient & cockpit lighting overlays */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(90deg, rgba(5, 7, 11, 0.40) 0%, rgba(5, 7, 11, 0.65) 42%, rgba(5, 7, 11, 0.94) 75%, rgba(5, 7, 11, 0.98) 100%)',
        }}
      />

      {/* Vertical vignette for cinematic depth */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5, 7, 11, 0.85) 100%)',
        }}
      />
      
      {/* Volumetric Neon Ambient Glows */}
      <div className="absolute -bottom-28 -left-28 w-[650px] h-[650px] bg-blue-600/25 rounded-full blur-[160px] pointer-events-none z-[2]" />
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-[2]" />
      
      {/* High-Tech Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none z-[2]" />

      {/* ========================================================================= */}
      {/* 2. TOP BRAND HEADER BAR */}
      {/* ========================================================================= */}
      <header className="relative z-10 w-full px-6 sm:px-12 py-5 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('/')} 
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-glow-blue group-hover:scale-105 transition-transform">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black tracking-wider text-2xl text-white">
                REAL<span className="text-primary-blue">DRIVE</span>
              </span>
              <Badge variant="blue" size="sm" className="hidden sm:inline-flex">
                3D SIMULATOR
              </Badge>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
              Realistic Car Life Simulation
            </p>
          </div>
        </div>

        {/* Top Right Live Telemetry & Registration Link */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SERVER: ASIA-SOUTH (MUMBAI)</span>
            <span className="text-slate-600">|</span>
            <span className="text-sky-400 font-bold">60 FPS WEBGL</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="hidden sm:inline">New Driver?</span>
            <button
              onClick={() => {
                audioService.playClick();
                onNavigate('/register');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-sky-300 hover:text-white font-semibold transition flex items-center gap-1.5"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Create Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN HERO & FLOATING GLASSMORPHISM LOGIN PANEL */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full flex-1 px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-7xl mx-auto py-2">
        
        {/* LEFT / CENTER: BRAND HERO SECTION */}
        <div className="w-full lg:max-w-xl text-left space-y-5 hidden md:block">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-sky-400 text-xs font-mono font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>3D WEBGL DRIVING PLATFORM • READY</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-none drop-shadow-xl">
              DRIVE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">
                LIVE. PROGRESS.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-sans max-w-lg leading-relaxed drop-shadow">
              Experience the complete automotive life simulation. Sit in the cockpit, navigate living city traffic, accept courier and chauffeur contracts, tune your fleet, and build your driver reputation.
            </p>
          </div>

          {/* Feature Highlights Matrix */}
          <div className="grid grid-cols-2 gap-3 pt-2 max-w-md font-mono text-xs text-slate-200">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-slate-800/80 hover:border-blue-500/40 transition">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>1st-Person Cockpit View</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-slate-800/80 hover:border-blue-500/40 transition">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Two-Way Traffic & Bikes</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-slate-800/80 hover:border-blue-500/40 transition">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Dynamic Traffic Lights</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950/70 backdrop-blur-md border border-slate-800/80 hover:border-blue-500/40 transition">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Economy & Maintenance</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: MODERN GLASSMORPHISM LOGIN PANEL */}
        <div className="w-full sm:w-[420px] lg:w-[450px] flex-shrink-0">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-blue-500/35 shadow-[0_0_60px_rgba(0,0,0,0.85)] space-y-5 relative">
            
            {/* Panel Top Title */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                  DRIVER AUTHENTICATION
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black font-display text-white mt-1">
                ACCESS COCKPIT
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Sign in to manage your garage, cars, and driving career.
              </p>
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/85 border border-red-700 text-red-300 text-xs font-mono flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span>USERNAME OR EMAIL</span>
                </label>
                <div className="relative flex items-center">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="player or user@realdrive.sim"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300">
                    <span>PASSWORD</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      audioService.playClick();
                      onNavigate('/forgot-password');
                    }}
                    className="text-[11px] font-mono text-sky-400 hover:text-sky-300 transition"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Stay Logged In Checkbox */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-mono">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Stay logged in</span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                glow
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full py-3.5 text-sm font-bold tracking-wider font-display uppercase shadow-glow-blue"
              >
                Sign In to RealDrive
              </Button>
            </form>

            {/* 1-Click Instant Demo Login Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Demo Accounts
                </span>
                <span>Click to Login</span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('player')}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-950/80 border border-slate-700 hover:border-blue-500 text-left transition group shadow-sm"
                >
                  <span className="text-[10px] text-slate-400 block uppercase">Driver Account</span>
                  <span className="font-bold text-white group-hover:text-sky-400">player</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-purple-950/80 border border-slate-700 hover:border-purple-500 text-left transition group shadow-sm"
                >
                  <span className="text-[10px] text-slate-400 block uppercase">Admin Console</span>
                  <span className="font-bold text-white group-hover:text-purple-400">admin</span>
                </button>
              </div>
            </div>

            {/* Mobile Registration Link */}
            <div className="sm:hidden text-center pt-2">
              <button
                onClick={() => {
                  audioService.playClick();
                  onNavigate('/register');
                }}
                className="text-xs font-mono text-sky-400 hover:underline"
              >
                Don't have an account? Register Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. MINIMALIST AUTOMOTIVE FOOTER */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full px-6 sm:px-12 py-3.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/50 bg-slate-950/40 backdrop-blur-md">
        <span>© 2026 REALDRIVE SIMULATION ENGINE</span>
        <span className="hidden sm:inline">WEBGL 3D REAL-TIME DRIVING PLATFORM • 60 FPS</span>
        <span className="text-emerald-400 font-semibold">STATUS: SIMULATOR ONLINE</span>
      </footer>
    </div>
  );
};
