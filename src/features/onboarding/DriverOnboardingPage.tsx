import React, { useState } from 'react';
import { 
  Gauge, 
  User as UserIcon, 
  ShieldCheck, 
  Car, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Sliders,
  Award,
  Zap
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ExperienceLevel } from '../../types';

interface DriverOnboardingPageProps {
  onNavigate: (path: string) => void;
}

export const DriverOnboardingPage: React.FC<DriverOnboardingPageProps> = ({ onNavigate }) => {
  const { user, completeOnboarding, vehicles } = useGame();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [driverName, setDriverName] = useState(user?.fullName || 'Alex Reynolds');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🏎️');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Learner');
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [starterCarId, setStarterCarId] = useState('veh-falcon-s');

  const avatarOptions = ['🏎️', '⚡', '🌌', '🚗', '🔥', '🦅', '🎯', '🕶️', '🚀', '👑'];
  const starterCars = vehicles.filter(v => v.isStarterCar);

  const handleFinish = () => {
    completeOnboarding(driverName, selectedAvatar, experienceLevel, transmission, starterCarId);
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-blue-600 selection:text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full relative z-10 space-y-6">
        {/* Step Indicator Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-sky-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DRIVER ONBOARDING PROTOCOL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-primary-text">
            WELCOME TO REAL<span className="text-primary-blue">DRIVE</span>
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text">
            Configure your official simulated driver license, preferences, and starter vehicle
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 pt-3">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === step
                    ? 'w-8 bg-primary-blue shadow-glow-blue'
                    : currentStep > step
                    ? 'w-3 bg-emerald-500'
                    : 'w-3 bg-surface-elevated border border-app-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Step 1: Profile & Identity */}
        {currentStep === 1 && (
          <Card variant="elevated" padding="lg" className="shadow-2xl space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-primary-text flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-accent" />
                <span>Step 1: Driver Profile & Avatar</span>
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Choose the name and badge that will appear on your official driver license.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Official Driver Name"
                placeholder="Enter driver name"
                value={driverName}
                onChange={e => setDriverName(e.target.value)}
                leftIcon={<UserIcon className="w-4 h-4" />}
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                  Select Driver Avatar
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {avatarOptions.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedAvatar(emoji)}
                      className={`h-12 rounded-xl text-2xl flex items-center justify-center border transition-all ${
                        selectedAvatar === emoji
                          ? 'bg-blue-950/80 border-sky-400 scale-110 shadow-glow-blue'
                          : 'bg-surface border-app-border hover:bg-surface-elevated'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-app-border">
              <Button
                variant="primary"
                glow
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => setCurrentStep(2)}
                disabled={!driverName.trim()}
              >
                Next: Experience & License
              </Button>
            </div>
          </Card>
        )}

        {/* Wizard Step 2: Experience & License */}
        {currentStep === 2 && (
          <Card variant="elevated" padding="lg" className="shadow-2xl space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-primary-text flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span>Step 2: Experience Level & License Class</span>
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Your experience level sets your initial license class and starting reputation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'Learner' as ExperienceLevel,
                  title: 'Learner',
                  desc: 'New to simulation. Beginner driving assists enabled and Class L license.',
                  badge: 'Class L',
                },
                {
                  id: 'Beginner' as ExperienceLevel,
                  title: 'Beginner',
                  desc: 'Some driving familiarity. Balanced assist levels and standard contracts.',
                  badge: 'Class C',
                },
                {
                  id: 'Experienced' as ExperienceLevel,
                  title: 'Experienced',
                  desc: 'Pro driver. Immediate access to commercial contracts and manual gearbox.',
                  badge: 'Class PRO',
                },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setExperienceLevel(item.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    experienceLevel === item.id
                      ? 'bg-blue-950/40 border-sky-400 shadow-glow-blue'
                      : 'bg-surface border-app-border hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-primary-text">{item.title}</span>
                      <Badge variant={experienceLevel === item.id ? 'accent' : 'neutral'} size="sm">
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-secondary-text leading-relaxed">{item.desc}</p>
                  </div>
                  {experienceLevel === item.id && (
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-mono text-sky-400 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>SELECTED</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-app-border">
              <Button
                variant="outline"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                glow
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => setCurrentStep(3)}
              >
                Next: Driving Preferences
              </Button>
            </div>
          </Card>
        )}

        {/* Wizard Step 3: Driving Preferences */}
        {currentStep === 3 && (
          <Card variant="elevated" padding="lg" className="shadow-2xl space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-primary-text flex items-center gap-2">
                <Sliders className="w-5 h-5 text-accent" />
                <span>Step 3: Driving Physics & Transmission</span>
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Customize your control scheme. These preferences can be adjusted at any time in Settings.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                  Transmission Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTransmission('Automatic')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      transmission === 'Automatic'
                        ? 'bg-blue-950/50 border-sky-400 shadow-glow-blue'
                        : 'bg-surface border-app-border'
                    }`}
                  >
                    <p className="font-bold text-sm text-primary-text">Automatic (PRND)</p>
                    <p className="text-xs text-secondary-text mt-1">
                      Engine shifts gears automatically based on velocity and load. Recommended for city contracts.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransmission('Manual')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      transmission === 'Manual'
                        ? 'bg-blue-950/50 border-sky-400 shadow-glow-blue'
                        : 'bg-surface border-app-border'
                    }`}
                  >
                    <p className="font-bold text-sm text-primary-text">Manual (Sequential)</p>
                    <p className="text-xs text-secondary-text mt-1">
                      Full manual RPM control with clutch & sequential paddle shift (Q / E keys).
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-app-border">
              <Button
                variant="outline"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                glow
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => setCurrentStep(4)}
              >
                Next: Choose Starter Car
              </Button>
            </div>
          </Card>
        )}

        {/* Wizard Step 4: Starter Vehicle Selection */}
        {currentStep === 4 && (
          <Card variant="elevated" padding="lg" className="shadow-2xl space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-primary-text flex items-center gap-2">
                <Car className="w-5 h-5 text-accent" />
                <span>Step 4: Choose Your Starter Vehicle</span>
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Select the first car to be registered in your personal garage. (Free starter allocation).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {starterCars.map(car => (
                <div
                  key={car.id}
                  onClick={() => setStarterCarId(car.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    starterCarId === car.id
                      ? 'bg-blue-950/50 border-sky-400 shadow-glow-blue'
                      : 'bg-surface border-app-border hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="blue" size="sm">{car.category}</Badge>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">STARTER FREE</span>
                    </div>
                    <h4 className="font-bold text-base text-primary-text">{car.name}</h4>
                    <p className="text-[11px] text-muted-text font-mono mb-2">{car.brand} • {car.modelYear}</p>
                    <p className="text-xs text-secondary-text leading-relaxed line-clamp-3 mb-3">
                      {car.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-app-border text-[11px] font-mono grid grid-cols-2 gap-1 text-muted-text">
                    <span>Power: <strong className="text-primary-text">{car.powerHp} HP</strong></span>
                    <span>Top: <strong className="text-primary-text">{car.topSpeedKmH} km/h</strong></span>
                    <span>Fuel: <strong className="text-primary-text">{car.fuelEconomyKmPerL} km/L</strong></span>
                    <span>0-100: <strong className="text-sky-400">{car.acceleration0To100}s</strong></span>
                  </div>

                  {starterCarId === car.id && (
                    <div className="mt-3 py-1 px-2 rounded bg-sky-500/20 text-sky-300 font-mono text-xs font-bold text-center border border-sky-500/30">
                      ✓ SELECTED STARTER
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-app-border">
              <Button
                variant="outline"
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(3)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                glow
                rightIcon={<Zap className="w-5 h-5" />}
                onClick={handleFinish}
              >
                Enter RealDrive
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
