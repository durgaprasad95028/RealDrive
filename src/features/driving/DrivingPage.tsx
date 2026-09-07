import React, { useState, useEffect, useRef } from 'react';
import { 
  Gauge, 
  Play, 
  Square, 
  RotateCcw, 
  Navigation, 
  Fuel, 
  ShieldAlert, 
  CheckCircle2, 
  Flame, 
  Sun, 
  CloudRain, 
  Clock, 
  MapPin,
  Sliders,
  Volume2,
  VolumeX,
  Radio,
  ArrowRight,
  Car
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Slider } from '../../components/common/Slider';
import { Speedometer, Tachometer } from '../../components/hud/Speedometer';
import { TelemetryOverlay, VehicleHealthGrid } from '../../components/hud/TelemetryOverlay';
import { MiniMapHUD } from '../../components/hud/MiniMapHUD';
import { audioService } from '../../services/audioService';
import { WeatherType, TimePeriod } from '../../types';

interface DrivingPageProps {
  onNavigate: (path: string) => void;
}

export const DrivingPage: React.FC<DrivingPageProps> = ({ onNavigate }) => {
  const { 
    selectedVehicle, 
    activeJob, 
    completeJob, 
    cancelJob, 
    recordDriveSession, 
    issueViolation, 
    currentWeather, 
    setWeather, 
    timeOfDay, 
    gameTime,
    settings 
  } = useGame();

  // Mode Selection State
  const [driveMode, setDriveMode] = useState<'FREE_DRIVE' | 'CAREER' | 'JOB' | 'RACE' | 'TEST'>('FREE_DRIVE');
  const [selectedLocation, setSelectedLocation] = useState('Grand Central Expressway');
  const [sessionActive, setSessionActive] = useState(false);

  // Live Driving Telemetry State
  const [speedKmh, setSpeedKmh] = useState(0);
  const [rpm, setRpm] = useState(900); // Idle RPM
  const [gear, setGear] = useState('D');
  const [throttle, setThrottle] = useState(0); // 0 - 100
  const [brake, setBrake] = useState(0);       // 0 - 100
  const [steeringDeg, setSteeringDeg] = useState(0); // -45 to +45
  const [distanceDrivenKm, setDistanceDrivenKm] = useState(0);
  const [topSpeedSession, setTopSpeedSession] = useState(0);
  const [engineTemp, setEngineTemp] = useState(90);
  const [turnSignal, setTurnSignal] = useState<'left' | 'right' | 'hazard' | 'off'>('off');
  const [speedLimit, setSpeedLimit] = useState(80);
  const [hasSpeedFineIssued, setHasSpeedFineIssued] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<{
    distance: number;
    topSpeed: number;
    fuelUsed: number;
    jobCompleted?: boolean;
    rewardEarned?: number;
  } | null>(null);

  const keyState = useRef<{ [key: string]: boolean }>({});

  // Keyboard controls listener for driving session
  useEffect(() => {
    if (!sessionActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keyState.current[e.key.toLowerCase()] = true;
      if (e.key === 'q' || e.key === 'Q') handleShiftDown();
      if (e.key === 'e' || e.key === 'E') handleShiftUp();
      if (e.key === 'a' || e.key === 'ArrowLeft') setTurnSignal(prev => prev === 'left' ? 'off' : 'left');
      if (e.key === 'd' || e.key === 'ArrowRight') setTurnSignal(prev => prev === 'right' ? 'off' : 'right');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keyState.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [sessionActive, gear]);

  // Turn signal audio blinker loop
  useEffect(() => {
    if (turnSignal === 'off' || !sessionActive) return;
    const interval = setInterval(() => {
      audioService.playBlinker();
    }, 450);
    return () => clearInterval(interval);
  }, [turnSignal, sessionActive]);

  // Main Driving Physics Simulation Loop (Runs at 20Hz / 50ms)
  useEffect(() => {
    if (!sessionActive || !selectedVehicle) return;

    audioService.startEngine(900);

    const interval = setInterval(() => {
      const keys = keyState.current;
      const isAccelerating = keys['w'] || keys['arrowup'];
      const isBraking = keys['s'] || keys['arrowdown'];

      setThrottle(prev => isAccelerating ? Math.min(100, prev + 15) : Math.max(0, prev - 20));
      setBrake(prev => isBraking ? Math.min(100, prev + 25) : Math.max(0, prev - 30));

      const maxCarSpeed = selectedVehicle.topSpeedKmH;
      const powerMultiplier = selectedVehicle.powerHp / 150;
      const gripFactor = currentWeather.roadGripPct / 100;

      setSpeedKmh(prevSpeed => {
        let newSpeed = prevSpeed;
        if (isAccelerating && !isBraking) {
          const accelRate = (2.2 * powerMultiplier * gripFactor) * (1 - prevSpeed / (maxCarSpeed + 10));
          newSpeed = Math.min(maxCarSpeed, prevSpeed + accelRate);
        } else if (isBraking) {
          newSpeed = Math.max(0, prevSpeed - 4.5 * gripFactor);
        } else {
          // Coasting drag
          newSpeed = Math.max(0, prevSpeed - 0.4);
        }

        // Check speed trap fine
        if (newSpeed > speedLimit + 15 && !hasSpeedFineIssued) {
          setHasSpeedFineIssued(true);
          issueViolation('Speeding', 250, 2, Math.round(newSpeed), speedLimit);
        }

        setTopSpeedSession(top => Math.max(top, newSpeed));
        return newSpeed;
      });

      // Calculate RPM & Gear
      setSpeedKmh(curSpeed => {
        let calculatedRpm = 900;
        if (curSpeed > 0) {
          const gearRatio = curSpeed < 30 ? 1 : curSpeed < 60 ? 2 : curSpeed < 95 ? 3 : curSpeed < 135 ? 4 : curSpeed < 180 ? 5 : 6;
          if (settings.transmission === 'Automatic') {
            setGear(`${gearRatio}`);
          }
          calculatedRpm = Math.min(7500, 1000 + (curSpeed % 40) * 140 + (curSpeed / maxCarSpeed) * 2000);
        }
        setRpm(calculatedRpm);
        audioService.updateEngineRpm(calculatedRpm);
        return curSpeed;
      });

      // Advance distance & fuel
      setSpeedKmh(curSpeed => {
        if (curSpeed > 0) {
          const kmDelta = (curSpeed / 3600) * 0.05; // 50ms interval
          setDistanceDrivenKm(d => Number((d + kmDelta).toFixed(2)));
        }
        return curSpeed;
      });

    }, 50);

    return () => {
      clearInterval(interval);
      audioService.stopEngine();
    };
  }, [sessionActive, selectedVehicle, currentWeather, speedLimit, hasSpeedFineIssued, settings.transmission]);

  const handleShiftUp = () => {
    audioService.playGearShift();
    setGear(prev => {
      if (prev === 'P') return 'R';
      if (prev === 'R') return 'N';
      if (prev === 'N') return '1';
      const num = parseInt(prev, 10);
      return isNaN(num) ? '1' : `${Math.min(6, num + 1)}`;
    });
  };

  const handleShiftDown = () => {
    audioService.playGearShift();
    setGear(prev => {
      const num = parseInt(prev, 10);
      if (!isNaN(num)) {
        if (num > 1) return `${num - 1}`;
        return 'N';
      }
      if (prev === 'N') return 'R';
      return 'P';
    });
  };

  const startDriveSession = () => {
    setDistanceDrivenKm(0);
    setTopSpeedSession(0);
    setHasSpeedFineIssued(false);
    setSessionSummary(null);
    setSessionActive(true);
  };

  const endDriveSession = (completeActiveJob: boolean = false) => {
    audioService.stopEngine();
    setSessionActive(false);

    if (selectedVehicle) {
      const fuelUsed = Number((distanceDrivenKm / selectedVehicle.fuelEconomyKmPerL).toFixed(2));
      recordDriveSession(distanceDrivenKm, topSpeedSession, fuelUsed, {
        tyres: Math.min(5, Math.ceil(distanceDrivenKm / 10)),
        brakes: Math.min(5, Math.ceil(distanceDrivenKm / 12)),
        engine: Math.min(3, Math.ceil(distanceDrivenKm / 20)),
      });

      let payout = 0;
      if (completeActiveJob && activeJob) {
        completeJob(activeJob.id, true, hasSpeedFineIssued);
        payout = activeJob.reward;
      }

      setSessionSummary({
        distance: distanceDrivenKm,
        topSpeed: Math.round(topSpeedSession),
        fuelUsed,
        jobCompleted: completeActiveJob,
        rewardEarned: payout,
      });
    }
  };

  if (!selectedVehicle) return null;

  return (
    <PageContainer>
      <PageHeader
        title="Driving Hub & Telemetry Simulator"
        subtitle="Full automotive cockpit controls, dynamic weather grip, radial instrumentation, and active road routing"
      />

      {!sessionActive ? (
        /* DRIVING HUB LAUNCHPAD */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Mode Selection & Setup */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="default">
              <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-sky-400" />
                <span>Select Simulation Mode</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'FREE_DRIVE' as const, title: 'Free Drive', desc: 'Open city exploration, highway cruising, test dynamics.', badge: 'ANY CAR' },
                  { id: 'JOB' as const, title: 'Job Contract', desc: activeJob ? `Active: ${activeJob.title}` : 'Select a contract from the Job Center.', badge: activeJob ? 'READY' : 'NO JOB' },
                  { id: 'RACE' as const, title: 'Track Time Attack', desc: 'Closed circuit lap timing against regional records.', badge: 'RACE CLASS' },
                ].map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setDriveMode(mode.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      driveMode === mode.id
                        ? 'bg-blue-950/60 border-sky-400 shadow-glow-blue'
                        : 'bg-surface border-app-border hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-primary-text">{mode.title}</span>
                        <Badge variant={driveMode === mode.id ? 'accent' : 'neutral'} size="sm">{mode.badge}</Badge>
                      </div>
                      <p className="text-xs text-secondary-text leading-relaxed">{mode.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Location & Environmental Conditions */}
            <Card variant="default">
              <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Sector & World Conditions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                    Drive Sector
                  </label>
                  <div className="space-y-1.5">
                    {[
                      'Grand Central Expressway (Speed Limit 100)',
                      'Downtown Commerce Ave (Speed Limit 50)',
                      'Pine Crest Alpine Mountain Pass (Speed Limit 60)',
                      'International Airport Link (Speed Limit 80)',
                    ].map(loc => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          if (loc.includes('100')) setSpeedLimit(100);
                          else if (loc.includes('50')) setSpeedLimit(50);
                          else if (loc.includes('60')) setSpeedLimit(60);
                          else setSpeedLimit(80);
                        }}
                        className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono transition-all ${
                          selectedLocation === loc ? 'bg-blue-950/60 border-sky-400 text-sky-300' : 'bg-surface border-app-border text-secondary-text'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                    Dynamic Weather
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['SUNNY', 'CLOUDY', 'RAIN', 'HEAVY_RAIN', 'FOG'] as WeatherType[]).map(w => (
                      <button
                        key={w}
                        onClick={() => setWeather(w)}
                        className={`p-2 rounded-lg border text-left text-xs font-mono capitalize transition-all ${
                          currentWeather.type === w ? 'bg-blue-950/60 border-sky-400 text-sky-300 font-bold' : 'bg-surface border-app-border text-secondary-text'
                        }`}
                      >
                        {w.toLowerCase().replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-text mt-2 font-mono">
                    Road Grip: <strong>{currentWeather.roadGripPct}%</strong> • Temp: <strong>{currentWeather.temperatureC}°C</strong>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right 1 Col: Vehicle Ready Checklist & Launch Button */}
          <div className="space-y-6">
            <Card variant="elevated">
              <div className="flex items-center justify-between pb-3 border-b border-app-border mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-text">Vehicle Ready Check</span>
                <Badge variant="success" size="sm">INSPECTION OK</Badge>
              </div>

              <div className="space-y-3 font-mono text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-text">Car:</span>
                  <span className="font-bold text-primary-text">{selectedVehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Fuel:</span>
                  <span className="font-bold text-sky-400">{selectedVehicle.health.fuel}% ({selectedVehicle.fuelCurrentL}L)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Engine:</span>
                  <span className="font-bold text-emerald-400">{selectedVehicle.health.engine}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Tyres:</span>
                  <span className="font-bold text-emerald-400">{selectedVehicle.health.tyres}%</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                glow
                leftIcon={<Play className="w-5 h-5 fill-current" />}
                className="w-full"
                onClick={() => onNavigate('/drive/game')}
              >
                START DRIVING GAMEPLAY
              </Button>
            </Card>

            {/* Session Summary modal / card after completion */}
            {sessionSummary && (
              <Card variant="glow-accent" className="animate-fadeIn">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-primary-text">Session Telemetry Logged</h4>
                </div>
                <div className="space-y-2 text-xs font-mono mb-3">
                  <div className="flex justify-between">
                    <span className="text-muted-text">Distance Driven:</span>
                    <span className="text-primary-text font-bold">{sessionSummary.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-text">Peak Velocity:</span>
                    <span className="text-sky-400 font-bold">{sessionSummary.topSpeed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-text">Fuel Consumed:</span>
                    <span className="text-amber-400 font-bold">{sessionSummary.fuelUsed} L</span>
                  </div>
                  {sessionSummary.rewardEarned && sessionSummary.rewardEarned > 0 ? (
                    <div className="flex justify-between pt-2 border-t border-app-border text-emerald-400 font-bold">
                      <span>Job Payout:</span>
                      <span>+₹{sessionSummary.rewardEarned.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>
                <Button variant="secondary" size="sm" className="w-full" onClick={() => onNavigate('/wallet')}>
                  View in Wallet Ledger
                </Button>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* LIVE DRIVING HUD & ACTIVE COCKPIT */
        <div className="space-y-6 animate-fadeIn">
          {/* Active Navigation & Speed Trap Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface/90 border border-blue-500/30 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white animate-pulse">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-primary-text text-sm sm:text-base">{selectedLocation}</h3>
                  <Badge variant="blue" size="sm">LIMIT {speedLimit} KM/H</Badge>
                </div>
                <p className="text-xs font-mono text-sky-400">
                  {activeJob ? `Active Contract: ${activeJob.title}` : 'Free Roam Simulation'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeJob && (
                <Button
                  variant="primary"
                  size="sm"
                  glow
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => endDriveSession(true)}
                >
                  Complete Job Contract
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Square className="w-4 h-4" />}
                onClick={() => endDriveSession(false)}
              >
                End Drive
              </Button>
            </div>
          </div>

          {/* Primary Radial Gauges & Live Mini-Map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Speedometer Radial Gauge */}
            <Speedometer speedKmh={speedKmh} speedLimit={speedLimit} />

            {/* Tachometer / RPM / Gear */}
            <Tachometer rpm={rpm} gear={gear} />

            {/* MiniMap HUD */}
            <MiniMapHUD
              currentLocationName={selectedLocation}
              objectiveName={activeJob ? activeJob.destination : undefined}
              objectiveDistanceKm={activeJob ? activeJob.distanceKm : undefined}
              speedCameraNear={speedKmh > speedLimit + 10}
            />
          </div>

          {/* Secondary Telemetry & Pedal Readouts */}
          <TelemetryOverlay
            fuelPct={selectedVehicle.health.fuel}
            engineTempC={engineTemp}
            roadGripPct={currentWeather.roadGripPct}
            throttlePct={throttle}
            brakePct={brake}
            headingDeg={steeringDeg}
            turnSignal={turnSignal}
            absActive={brake > 80}
            tractionActive={throttle > 80 && currentWeather.roadGripPct < 70}
          />

          {/* Interactive Keyboard & On-Screen Control Sliders */}
          <Card variant="default">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-app-border mb-4">
              <div>
                <h4 className="text-sm font-bold text-primary-text">Vehicle Cockpit Controls</h4>
                <p className="text-xs text-secondary-text">
                  Use Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated font-mono text-sky-400">W</kbd> Accelerate • <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated font-mono text-danger">S</kbd> Brake • <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated font-mono text-primary-text">Q/E</kbd> Shift • <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated font-mono text-primary-text">A/D</kbd> Turn Signals
                </p>
              </div>

              {/* Turn Signal Control Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTurnSignal(prev => prev === 'left' ? 'off' : 'left')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    turnSignal === 'left' ? 'bg-amber-500 text-black animate-pulse shadow-glow-cyan' : 'bg-surface-elevated border-app-border text-secondary-text'
                  }`}
                >
                  ◀ LEFT BLINKER
                </button>
                <button
                  onClick={() => setTurnSignal(prev => prev === 'hazard' ? 'off' : 'hazard')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    turnSignal === 'hazard' ? 'bg-red-500 text-white animate-pulse shadow-glow-danger' : 'bg-surface-elevated border-app-border text-secondary-text'
                  }`}
                >
                  ⚠ HAZARD
                </button>
                <button
                  onClick={() => setTurnSignal(prev => prev === 'right' ? 'off' : 'right')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    turnSignal === 'right' ? 'bg-amber-500 text-black animate-pulse shadow-glow-cyan' : 'bg-surface-elevated border-app-border text-secondary-text'
                  }`}
                >
                  RIGHT BLINKER ▶
                </button>
              </div>
            </div>

            {/* Interactive Touch/Click Pedal Pads */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <button
                onMouseDown={() => { keyState.current['w'] = true; }}
                onMouseUp={() => { keyState.current['w'] = false; }}
                onTouchStart={() => { keyState.current['w'] = true; }}
                onTouchEnd={() => { keyState.current['w'] = false; }}
                className="p-4 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-600/60 text-sky-300 font-mono font-bold text-center select-none active:scale-95 shadow-glow-blue"
              >
                HOLD GAS (W)
              </button>

              <button
                onMouseDown={() => { keyState.current['s'] = true; }}
                onMouseUp={() => { keyState.current['s'] = false; }}
                onTouchStart={() => { keyState.current['s'] = true; }}
                onTouchEnd={() => { keyState.current['s'] = false; }}
                className="p-4 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-600/60 text-red-300 font-mono font-bold text-center select-none active:scale-95 shadow-glow-danger"
              >
                HOLD BRAKE (S)
              </button>

              <button
                onClick={handleShiftDown}
                className="p-4 rounded-xl bg-surface-elevated hover:bg-slate-800 border border-app-border text-primary-text font-mono font-bold text-center select-none active:scale-95"
              >
                SHIFT DOWN (Q)
              </button>

              <button
                onClick={handleShiftUp}
                className="p-4 rounded-xl bg-surface-elevated hover:bg-slate-800 border border-app-border text-sky-400 font-mono font-bold text-center select-none active:scale-95"
              >
                SHIFT UP (E)
              </button>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};
