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
    <div className="relative w-screen h-screen min-h-screen max-h-screen m-0 p-0 overflow-hidden box-border select-none bg-[#090A0F] flex flex-col justify-between">
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

      {/* Stitch Atmospheric Radial Glow & Dark Overlays */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(90deg, rgba(9, 10, 15, 0.45) 0%, rgba(9, 10, 15, 0.70) 42%, rgba(9, 10, 15, 0.94) 75%, rgba(9, 10, 15, 0.98) 100%)',
        }}
      />

      {/* Radial atmospheric glows */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-radial-stitch opacity-80" />
      <div className="absolute -bottom-28 -left-28 w-[650px] h-[650px] bg-blue-600/20 rounded-full blur-[160px] pointer-events-none z-[2]" />
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-[2]" />
      
      {/* Stitch High-Tech Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-[2]" />

      {/* ========================================================================= */}
      {/* 2. TOP BRAND HEADER BAR (STITCH FLOATING GLASS) */}
      {/* ========================================================================= */}
      <header className="relative z-10 w-full px-6 sm:px-12 py-5 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('/')} 
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black tracking-wider text-2xl text-white">
                REAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">DRIVE</span>
              </span>
              <span className="stitch-pill text-cyan-300 hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                3D SIMULATOR
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
              Realistic Car Life Simulation
            </p>
          </div>
        </div>

        {/* Top Right Live Telemetry & Registration Link */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full stitch-glass text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SERVER: ASIA-SOUTH (MUMBAI)</span>
            <span className="text-white/20">|</span>
            <span className="text-cyan-400 font-bold">60 FPS WEBGL</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="hidden sm:inline text-slate-400">New Driver?</span>
            <button
              onClick={() => {
                audioService.playClick();
                onNavigate('/register');
              }}
              className="px-4 py-1.5 rounded-full stitch-glass border-blue-500/30 hover:border-blue-500/60 text-cyan-300 hover:text-white font-semibold transition-all flex items-center gap-1.5"
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
          <div className="stitch-pill text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>3D WEBGL DRIVING PLATFORM • READY</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-none drop-shadow-xl">
              DRIVE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                LIVE. PROGRESS.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-sans max-w-lg leading-relaxed drop-shadow">
              Experience the complete automotive life simulation. Sit in the cockpit, navigate living city traffic, accept courier and chauffeur contracts, tune your fleet, and build your driver reputation.
            </p>
          </div>

          {/* Stitch Bento Feature Highlights Matrix */}
          <div className="grid grid-cols-2 gap-3 pt-2 max-w-md font-mono text-xs text-slate-200">
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl stitch-glass hover:border-cyan-500/40 transition">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>1st-Person Cockpit View</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl stitch-glass hover:border-cyan-500/40 transition">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Two-Way Traffic & Bikes</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl stitch-glass hover:border-cyan-500/40 transition">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Dynamic Traffic Lights</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl stitch-glass hover:border-cyan-500/40 transition">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Economy & Maintenance</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: MODERN GOOGLE STITCH GLASSMORPHISM LOGIN PANEL */}
        <div className="w-full sm:w-[420px] lg:w-[450px] flex-shrink-0">
          <div className="p-6 sm:p-8 rounded-3xl stitch-glass-elevated border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.85)] space-y-5 relative">
            
            {/* Panel Top Title */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
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
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-600/60 text-rose-300 text-xs font-mono flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
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
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all"
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
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition"
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
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all"
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
                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0 cursor-pointer"
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
                className="w-full py-4 text-sm font-bold tracking-wider font-display uppercase shadow-[0_0_25px_rgba(59,130,246,0.4)] rounded-2xl"
              >
                Sign In to RealDrive
              </Button>
            </form>

            {/* 1-Click Instant Demo Login Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Demo Accounts
                </span>
                <span>Click to Login</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('player')}
                  className="p-3 rounded-2xl stitch-glass hover:border-cyan-400/50 text-left transition group shadow-sm"
                >
                  <span className="text-[10px] text-slate-400 block uppercase">Driver Account</span>
                  <span className="font-bold text-white group-hover:text-cyan-400">player</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="p-3 rounded-2xl stitch-glass hover:border-purple-400/50 text-left transition group shadow-sm"
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
                className="text-xs font-mono text-cyan-400 hover:underline"
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
      <footer className="relative z-10 w-full px-6 sm:px-12 py-3.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/10 stitch-glass">
        <span>© 2026 REALDRIVE SIMULATION ENGINE</span>
        <span className="hidden sm:inline">WEBGL 3D REAL-TIME DRIVING PLATFORM • 60 FPS</span>
        <span className="text-emerald-400 font-semibold">STATUS: SIMULATOR ONLINE</span>
      </footer>
    </div>
  );
};
