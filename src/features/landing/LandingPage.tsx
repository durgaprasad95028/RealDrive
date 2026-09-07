import React from 'react';
import { 
  Gauge, 
  ShieldCheck, 
  Wrench, 
  Fuel, 
  Map, 
  Briefcase, 
  Flame, 
  Award, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Zap,
  Play
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { INITIAL_VEHICLES } from '../../data/mockData';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#07090D] text-[#F8FAFC] selection:bg-blue-600 selection:text-white">
      {/* Landing Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0D1117]/90 border-b border-[#1F2937] backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-7xl mx-auto rounded-b-2xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-glow-blue">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <span className="font-display font-black tracking-wider text-xl text-primary-text">
              REAL<span className="text-primary-blue">DRIVE</span>
            </span>
            <span className="text-[10px] font-mono text-muted-text block uppercase tracking-widest">
              Realistic Car Life Sim
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-secondary-text">
          <a href="#features" className="hover:text-primary-text transition-colors">Features</a>
          <a href="#vehicles" className="hover:text-primary-text transition-colors">Vehicles</a>
          <a href="#consequences" className="hover:text-primary-text transition-colors">Consequences</a>
          <a href="#career" className="hover:text-primary-text transition-colors">Career</a>
          <a href="#economy" className="hover:text-primary-text transition-colors">Economy</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('/login')}>
            Sign In
          </Button>
          <Button variant="primary" size="sm" glow rightIcon={<ChevronRight className="w-4 h-4" />} onClick={() => onNavigate('/register')}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-sky-400 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>PHASE 1 SIMULATOR ONLINE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-none text-primary-text">
              REALISTIC DRIVING.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300">
                REAL CONSEQUENCES.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-secondary-text leading-relaxed font-sans max-w-2xl mx-auto">
              RealDrive is not an arcade racer. It is a complete automotive life ecosystem — from obtaining your license, buying and maintaining realistic vehicles, running taxi and courier contracts, to paying for fuel, insurance, and traffic fines.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                glow
                leftIcon={<Play className="w-5 h-5 fill-current" />}
                onClick={() => onNavigate('/drive/game')}
                className="w-full sm:w-auto text-base tracking-wider font-black shadow-glow-blue"
              >
                START 3D DRIVING NOW
              </Button>
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => onNavigate('/login')}
                className="w-full sm:w-auto"
              >
                CAREER & GARAGE
              </Button>
            </div>

            {/* Quick Demo Credentials pill */}
            <div className="pt-2">
              <span className="text-xs text-muted-text font-mono">
                Instant Demo Access: Player (<code className="text-sky-400">player / player123</code>) • Admin (<code className="text-purple-400">admin / admin123</code>)
              </span>
            </div>
          </div>

          {/* Interactive Hero Showcase Dashboard Frame */}
          <div className="mt-16 rounded-2xl border border-[#1F2937] bg-surface/90 shadow-2xl p-4 sm:p-6 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-app-border pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-danger/80" />
                <span className="w-3 h-3 rounded-full bg-warning/80" />
                <span className="w-3 h-3 rounded-full bg-success/80" />
                <span className="text-xs font-mono text-muted-text ml-2">SIMULATED VEHICLE TELEMETRY • FALCON S SEDAN</span>
              </div>
              <Badge variant="success" dot size="sm">TELEMETRY LIVE</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="elevated" padding="sm" className="border-l-4 border-l-primary-blue">
                <p className="text-[11px] font-mono text-secondary-text uppercase">Speed & Gear</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold font-gauge text-primary-text">94</span>
                  <span className="text-xs font-mono text-muted-text">KM/H</span>
                  <span className="text-xs font-mono text-sky-400 font-bold ml-auto">GEAR 4</span>
                </div>
              </Card>

              <Card variant="elevated" padding="sm" className="border-l-4 border-l-emerald-500">
                <p className="text-[11px] font-mono text-secondary-text uppercase">Engine & Health</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold font-gauge text-emerald-400">92%</span>
                  <span className="text-xs font-mono text-muted-text">3,200 RPM</span>
                </div>
              </Card>

              <Card variant="elevated" padding="sm" className="border-l-4 border-l-amber-500">
                <p className="text-[11px] font-mono text-secondary-text uppercase">Fuel Tank</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold font-gauge text-amber-400">76%</span>
                  <span className="text-xs font-mono text-muted-text">42L / 55L</span>
                </div>
              </Card>

              <Card variant="elevated" padding="sm" className="border-l-4 border-l-sky-500">
                <p className="text-[11px] font-mono text-secondary-text uppercase">Driver Safe Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold font-gauge text-sky-400">92</span>
                  <span className="text-xs font-mono text-muted-text">/ 100</span>
                  <span className="text-[10px] text-emerald-400 font-bold ml-auto">+15% BONUS</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Pillars Section */}
      <section id="features" className="py-20 bg-background-secondary/60 border-y border-app-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="accent" size="sm" className="mb-3">COMPLETE SIMULATION ECOSYSTEM</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary-text">
              More Than Just Speed
            </h2>
            <p className="text-sm sm:text-base text-secondary-text mt-3">
              Every turn, every brake pedal press, and every job you complete ripples across your financial balance, vehicle health, insurance quotes, and driver reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default" className="hover:border-blue-500/50 group">
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-sky-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">Driver License & Points</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Progress from Learner to Commercial and Master certifications. Accumulate points for red lights or speeding, risking temporary suspension.
              </p>
            </Card>

            <Card variant="default" className="hover:border-blue-500/50 group">
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-sky-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">8-Point Health Diagnostics</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Engine wear, brake fade, tyre degradation, battery drain, and transmission calibration require regular shop maintenance to avoid sudden breakdowns.
              </p>
            </Card>

            <Card variant="default" className="hover:border-blue-500/50 group">
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-sky-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">Dynamic Job Economy</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Accept airport VIP taxi fares, multi-stop cargo deliveries, scheduled bus routes, and high-priority trauma hospital escorts.
              </p>
            </Card>

            <Card variant="default" className="hover:border-blue-500/50 group">
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-sky-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Fuel className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">Fuel & Energy Dynamics</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Real fuel consumption scales with engine RPM and speed. Top up at 24/7 petrol pumps or fast-charge electric sports cars.
              </p>
            </Card>

            <Card variant="default" className="hover:border-blue-500/50 group">
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-sky-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">Dynamic World & Weather</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                7 metropolitan zones, live traffic congestion zones, day/night cycles, and wet road grip degradation in rainy conditions.
              </p>
            </Card>

            <Card variant="default" className="hover:border-blue-500/50 group">
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-sky-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">Consequence Engine</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Violations trigger instant fines, license points, reputation loss, and elevated insurance premiums. Safe driving earns lucrative payouts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Vehicle Showcase Section */}
      <section id="vehicles" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="blue" size="sm" className="mb-2">FLEET SELECTION</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary-text">
                Fictional Automotive Engineering
              </h2>
              <p className="text-secondary-text text-sm mt-1">
                From sensible daily sedans to twin-turbocharged track monsters and silent EV grand tourers.
              </p>
            </div>
            <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />} onClick={() => onNavigate('/marketplace')}>
              Browse All Cars
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_VEHICLES.slice(0, 3).map((car) => (
              <Card key={car.id} variant="elevated" className="overflow-hidden group hover:border-blue-500/50">
                <div className="h-40 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 p-6 flex flex-col justify-between border-b border-app-border relative">
                  <div className="flex justify-between items-start">
                    <Badge variant="blue" size="sm">{car.category}</Badge>
                    <span className="font-mono text-sm font-bold text-emerald-400">₹{car.price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-text font-mono">{car.brand}</span>
                    <h4 className="text-xl font-bold text-primary-text group-hover:text-sky-400 transition-colors">{car.name}</h4>
                  </div>
                  {/* Subtle decorative glow */}
                  <div className="absolute right-4 -bottom-4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-secondary-text leading-relaxed line-clamp-2">
                    {car.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-app-border">
                    <div className="p-2 rounded-lg bg-surface-elevated">
                      <p className="text-[10px] text-muted-text uppercase font-mono">Power</p>
                      <p className="text-xs font-mono font-bold text-primary-text">{car.powerHp} HP</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-elevated">
                      <p className="text-[10px] text-muted-text uppercase font-mono">0-100</p>
                      <p className="text-xs font-mono font-bold text-sky-400">{car.acceleration0To100}s</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-elevated">
                      <p className="text-[10px] text-muted-text uppercase font-mono">Top Speed</p>
                      <p className="text-xs font-mono font-bold text-primary-text">{car.topSpeedKmH} km/h</p>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => onNavigate('/vehicles')}
                  >
                    View Specifications
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Consequences Breakdown Section */}
      <section id="consequences" className="py-20 bg-background-secondary/60 border-y border-app-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="danger" size="sm">CORE PHILOSOPHY</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary-text">
                Every Action Produces a Consequence
              </h2>
              <p className="text-secondary-text leading-relaxed">
                Unlike games where accidents and traffic tickets vanish on the next screen, RealDrive connects every driving habit directly to your career balance sheet.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-950/30 border border-red-900/40">
                  <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-danger">Reckless Driving & Speeding</h4>
                    <p className="text-xs text-secondary-text mt-0.5">
                      Fines are deducted from your balance, penalty points accumulate on your license, driver reputation drops, and insurance underwriters increase your policy premium.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400">Safe Driving Score & Maintenance</h4>
                    <p className="text-xs text-secondary-text mt-0.5">
                      Smooth driving keeps brake pads and tyres intact, unlocks higher-paying VIP contracts, earns cash bonuses, and unlocks premium dealership discounts.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="primary" glow onClick={() => onNavigate('/register')}>
                Create Your Driver Account
              </Button>
            </div>

            {/* Visual Consequence Chain Node Map */}
            <div className="p-6 rounded-2xl bg-surface border border-app-border space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-text">
                Simulated Consequence Pathway
              </h4>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-red-300 font-bold">Speed Camera Citation (+20 km/h)</span>
                  <Badge variant="danger" size="sm">-₹250 Fine</Badge>
                </div>
                <div className="flex justify-center text-secondary-text text-sm">↓</div>
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-300 font-bold">License Points Assessed</span>
                  <Badge variant="warning" size="sm">+2 Penalty Points</Badge>
                </div>
                <div className="flex justify-center text-secondary-text text-sm">↓</div>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-300 font-bold">Driver Reputation & Career Impact</span>
                  <Badge variant="purple" size="sm">-4 Rep / -10% Contracts</Badge>
                </div>
                <div className="flex justify-center text-secondary-text text-sm">↓</div>
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-sky-300 font-bold">Insurance Risk Adjustment</span>
                  <Badge variant="blue" size="sm">+4% Monthly Premium</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="py-16 bg-[#090D14] border-t border-[#1F2937]">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-display font-extrabold text-primary-text">
              Ready to Start Your Driver Life?
            </h2>
            <p className="text-secondary-text text-sm">
              Log in with instant demo accounts or register your custom driver profile today.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="lg" glow onClick={() => onNavigate('/login')}>
                LAUNCH SIMULATION
              </Button>
            </div>
          </div>

          <div className="border-t border-app-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-text font-mono gap-4">
            <p>© 2026 RealDrive Simulator. Frontend Master Build.</p>
            <div className="flex gap-6">
              <span className="hover:text-primary-text cursor-pointer" onClick={() => onNavigate('/login')}>Demo Login</span>
              <span className="hover:text-primary-text cursor-pointer" onClick={() => onNavigate('/settings')}>Preferences</span>
              <span className="hover:text-primary-text cursor-pointer" onClick={() => onNavigate('/admin')}>Admin Console</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
