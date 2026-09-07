import React, { useState } from 'react';
import { 
  Gauge, 
  ShieldCheck, 
  Wrench, 
  Fuel, 
  MapPin, 
  Briefcase, 
  Flame, 
  Award, 
  ChevronRight, 
  ArrowRight,
  Zap,
  Play,
  Car,
  Eye,
  Activity,
  Cpu,
  Radio,
  Sparkles,
  TrendingUp,
  Compass,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { INITIAL_VEHICLES } from '../../data/mockData';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [selectedFleetCategory, setSelectedFleetCategory] = useState<string>('all');
  const [previewCarIndex, setPreviewCarIndex] = useState<number>(0);

  const categories = [
    { id: 'all', label: 'All Fleet' },
    { id: 'supercar', label: 'Hypercars & GT' },
    { id: 'sedan', label: 'Sport Sedans' },
    { id: 'muscle', label: 'Muscle & Drift' },
    { id: 'suv', label: 'SUVs & Utility' },
    { id: 'commercial', label: 'Taxi & Transport' },
  ];

  const filteredVehicles = INITIAL_VEHICLES.filter(v => {
    if (selectedFleetCategory === 'all') return true;
    if (selectedFleetCategory === 'supercar') return v.category === 'Sports' || v.powerHp >= 500;
    if (selectedFleetCategory === 'sedan') return v.category === 'Sedan';
    if (selectedFleetCategory === 'muscle') return v.powerHp >= 400;
    if (selectedFleetCategory === 'suv') return v.category === 'SUV';
    if (selectedFleetCategory === 'commercial') return v.category === 'Utility' || v.category === 'Hatchback';
    return true;
  });

  const activeCar = filteredVehicles[previewCarIndex] || INITIAL_VEHICLES[0];

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#F8FAFC] selection:bg-blue-600 selection:text-white font-sans">
      {/* Google Stitch Ambient Background Radial Glow */}
      <div className="fixed inset-0 bg-radial-stitch pointer-events-none z-0" />
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none z-0" />

      {/* 1. Header / Navigation Bar (Google Stitch Sleek Glass) */}
      <header className="sticky top-0 z-50 stitch-glass border-b border-white/10 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-black tracking-wider text-xl text-white flex items-center gap-1.5">
                REAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">DRIVE</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  v2.0 3D
                </span>
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 stitch-pill px-3 py-1.5 border-white/10">
            <a href="#hero" className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors">Overview</a>
            <a href="#features" className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors">3D Cockpit & Physics</a>
            <a href="#fleet" className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors">Vehicles</a>
            <a href="#career" className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors">Career & Missions</a>
            <a href="#economy" className="px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition-colors">Stock Market</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Driving</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Stitch Style with Visual Hierarchy) */}
      <section id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold tracking-wide">AUTHENTIC FIRST-PERSON 3D DRIVING ENGINE</span>
              <span className="text-slate-400">|</span>
              <span className="text-cyan-300 font-mono">60 FPS WEBGL</span>
            </div>

            {/* Grand Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.08] text-white">
              REALISTIC DRIVING.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
                LIVING 3D CITY.
              </span>
            </h1>

            {/* Subhead Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
              Sit in the driver's seat with a physical animated steering wheel, interactive dashboard telemetry, moving two-way AI traffic, dynamic weather, and career logistics.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('/drive/game')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_35px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>LAUNCH 3D DRIVER SEAT</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('/cars')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white backdrop-blur-md flex items-center justify-center gap-2.5 transition-all"
              >
                <Car className="w-5 h-5 text-cyan-400" />
                <span>Explore 50+ Vehicles</span>
              </button>
            </div>

            {/* 1-Click Demo Fillers */}
            <div className="flex items-center justify-center gap-3 text-xs text-slate-400 pt-2">
              <span>Quick Login Credentials:</span>
              <button 
                onClick={() => onNavigate('/login')}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 font-mono"
              >
                player / player123
              </button>
              <button 
                onClick={() => onNavigate('/login')}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 font-mono"
              >
                admin / admin123
              </button>
            </div>
          </div>

          {/* Hero Interactive Showcase Card (Stitch Bento Highlight) */}
          <div className="mt-14 relative rounded-3xl stitch-glass-elevated border border-white/15 p-6 md:p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Vehicle Telemetry Highlight */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-mono font-bold">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>FEATURED SUPERCAR</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">ACTIVE CHASSIS</span>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-black text-white">{activeCar.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{activeCar.description}</p>
                </div>

                {/* Performance Stat Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">Horsepower</span>
                    <span className="text-lg font-bold font-gauge text-cyan-400">{activeCar.powerHp} <span className="text-xs font-normal">HP</span></span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">Top Speed</span>
                    <span className="text-lg font-bold font-gauge text-white">{activeCar.topSpeedKmH} <span className="text-xs font-normal">KM/H</span></span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">0-100 KM/H</span>
                    <span className="text-lg font-bold font-gauge text-rose-400">{activeCar.acceleration0To100} <span className="text-xs font-normal">s</span></span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">Fuel Type</span>
                    <span className="text-lg font-bold font-gauge text-amber-400">{activeCar.fuelType}</span>
                  </div>
                </div>

                {/* Quick Drive CTA */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('/drive/game')}
                    className="flex-1 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Test Drive This Car</span>
                  </button>
                  <button
                    onClick={() => onNavigate('/cars')}
                    className="py-3 px-5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
                  >
                    Showroom
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Cockpit & Gauges Simulation Card */}
              <div className="lg:col-span-7 bg-[#0b0c10]/90 rounded-2xl border border-white/10 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-semibold text-emerald-400">TELEMETRY STREAM: 60 HZ ONLINE</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>PACEJKA '96 TIRE SOLVER</span>
                  </div>
                </div>

                {/* Cockpit HUD Visual Indicator */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Gauge 1: Tachometer */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>ENGINE RPM</span>
                      <span className="font-mono text-cyan-400">7,400 RPM</span>
                    </div>
                    <div className="my-3 flex items-baseline gap-1">
                      <span className="text-3xl font-black font-gauge text-white">7.4</span>
                      <span className="text-xs font-mono text-slate-400">x1000</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-rose-500 h-full w-[82%]" />
                    </div>
                  </div>

                  {/* Gauge 2: Speedometer */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>GROUND SPEED</span>
                      <span className="font-mono text-emerald-400">GEAR 5</span>
                    </div>
                    <div className="my-3 flex items-baseline gap-1">
                      <span className="text-3xl font-black font-gauge text-white">218</span>
                      <span className="text-xs font-mono text-slate-400">KM/H</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[65%]" />
                    </div>
                  </div>

                  {/* Gauge 3: G-Force Friction Circle */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>LATERAL G-FORCE</span>
                      <span className="font-mono text-rose-400">1.35 G</span>
                    </div>
                    <div className="my-3 flex items-baseline gap-1">
                      <span className="text-3xl font-black font-gauge text-rose-400">+1.35</span>
                      <span className="text-xs font-mono text-slate-400">G LAT</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full w-[75%]" />
                    </div>
                  </div>
                </div>

                {/* Key Controls Quick Guide */}
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-blue-300">🎮 KEYBOARD CONTROLS:</span>
                  <span className="text-slate-300"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">W</kbd> Accelerate</span>
                  <span className="text-slate-300"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">S</kbd> Brake/Reverse</span>
                  <span className="text-slate-300"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">A/D</kbd> Steer</span>
                  <span className="text-slate-300"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">C</kbd> Camera View</span>
                  <span className="text-slate-300"><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono">SPACE</kbd> Handbrake</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bento Grid: 6 Core Pillars (Google Stitch Reference) */}
      <section id="features" className="py-20 relative z-10 border-t border-white/10 bg-[#0a0b0e]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full stitch-pill text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
              ENGINEERED FOR REALISM
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Every system is simulated with deep physics, from combustion flame propagation to multi-lane IDM traffic networks.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento Card 1: 3D Cockpit Camera */}
            <div className="stitch-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">First-Person Cockpit View</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Sit directly in the driver's seat. Experience real-time windshield perspective, turning steering wheel, working analog gauges, and dynamic audio synthesis.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold">→ TOGGLE CAMERA VIEW WITH 'C' KEY</span>
              </div>
            </div>

            {/* Bento Card 2: 3D City & AI Traffic */}
            <div className="stitch-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Two-Way AI Traffic & Signals</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Navigate realistic multi-lane city streets with two-way traffic flow, motorcycles with animated riders, active 3D traffic lights, and pedestrian crossings.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-emerald-400 font-semibold">→ INTELLIGENT DRIVER MODEL (IDM)</span>
              </div>
            </div>

            {/* Bento Card 3: Virtual Dyno Lab & Tuning */}
            <div className="stitch-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Virtual Dyno & ECU Tuning</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Test your vehicles on the virtual chassis dynamometer. Remap ECU fuel maps, adjust turbo wastegate boost, and observe real-time BHP and torque curves.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-rose-400 font-semibold">→ STAGE 1–4 PERFORMANCE PARTS</span>
              </div>
            </div>

            {/* Bento Card 4: Career & Freight Logistics */}
            <div className="stitch-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Career Missions & Haulage</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Take on Airport Taxi fares, VIP rideshare contracts, and fragile freight haulage manifests to earn driver XP and expand your personal automotive empire.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-amber-400 font-semibold">→ DYNAMIC CONTRACT DISPATCH</span>
              </div>
            </div>

            {/* Bento Card 5: Police Pursuit Scanner */}
            <div className="stitch-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Law Enforcement & Speed Traps</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Excessive speeding triggers automatic speed radars and police dispatchers. Evade 5-star pursuit units, roadblocks, and spike strips across urban districts.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-purple-400 font-semibold">→ ACTIVE POLICE SCANNER HUD</span>
              </div>
            </div>

            {/* Bento Card 6: RDFX Stock Market & Economy */}
            <div className="stitch-card p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">RDFX Financial Stock Exchange</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Trade shares in automotive manufacturers, tire suppliers, and logistics conglomerates. Review 10-year OHLCV candlestick charts and manage your bank ledger.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold">→ LIVE ORDER BOOK EXECUTION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Vehicle Fleet Section */}
      <section id="fleet" className="py-20 relative z-10 border-t border-white/10 bg-[#0d0e12]">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full stitch-pill text-blue-400 mb-2">
                <Car className="w-3.5 h-3.5" />
                <span>SHOWROOM SHOWCASE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
                50+ MULTI-CLASS VEHICLES
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedFleetCategory(cat.id);
                    setPreviewCarIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedFleetCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.slice(0, 6).map((vehicle, idx) => (
              <div 
                key={vehicle.id} 
                className="stitch-card p-6 flex flex-col justify-between space-y-5 hover:border-blue-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                        {vehicle.category} CLASS
                      </span>
                      <h4 className="text-xl font-display font-black text-white group-hover:text-blue-400 transition-colors">
                        {vehicle.name}
                      </h4>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                      ${vehicle.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{vehicle.description}</p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-[10px] font-mono text-slate-400 block">HP</span>
                    <span className="text-sm font-bold font-gauge text-white">{vehicle.powerHp}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-[10px] font-mono text-slate-400 block">SPEED</span>
                    <span className="text-sm font-bold font-gauge text-white">{vehicle.topSpeedKmH}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03]">
                    <span className="text-[10px] font-mono text-slate-400 block">0-100</span>
                    <span className="text-sm font-bold font-gauge text-cyan-400">{vehicle.acceleration0To100}s</span>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => onNavigate('/cars')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-white flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Select & Drive</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Complete Application Flow Banner */}
      <section className="py-16 relative z-10 border-t border-white/10 bg-[#090a0d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="stitch-glass-elevated rounded-3xl p-8 md:p-12 border border-blue-500/20 text-center relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto space-y-6 relative z-10">
              <h3 className="text-3xl md:text-5xl font-display font-black text-white">
                READY TO ENTER THE DRIVER'S SEAT?
              </h3>
              <p className="text-slate-300 text-base md:text-lg">
                Experience full-screen 3D WebGL driving simulation with authentic cockpit cameras, live telemetry HUDs, and endless open-world road freedom.
              </p>

              {/* Step Progression */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 text-xs font-mono text-left">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-blue-400 font-bold block mb-1">01. LOGIN</span>
                  <span className="text-slate-300">Authenticate driver profile</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-cyan-400 font-bold block mb-1">02. DASHBOARD</span>
                  <span className="text-slate-300">View stats & launchpad</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-amber-400 font-bold block mb-1">03. SELECT CAR</span>
                  <span className="text-slate-300">Pick vehicle from fleet</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-emerald-400 font-bold block mb-1">04. 3D DRIVING</span>
                  <span className="text-slate-300">First-person cockpit world</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-8 py-4 rounded-xl text-base font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] inline-flex items-center gap-3 transition-transform hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>START DRIVING NOW</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer (Google Stitch Clean Architecture) */}
      <footer className="border-t border-white/10 bg-[#07080a] py-12 text-slate-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold text-white">REALDRIVE SIMULATOR</span>
              <p className="text-[11px] text-slate-500">React 18 + Three.js WebGL 3D Driving Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => onNavigate('/cars')} className="hover:text-white transition-colors">Vehicles</button>
            <button onClick={() => onNavigate('/login')} className="hover:text-white transition-colors">Driver Login</button>
            <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => onNavigate('/game')} className="hover:text-white transition-colors">3D Game</button>
          </div>

          <div className="text-slate-500 text-[11px]">
            &copy; 2026 RealDrive. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
