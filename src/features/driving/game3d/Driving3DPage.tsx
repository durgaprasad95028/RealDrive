import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ThreeEngine } from './engine/ThreeEngine';
import { HUDOverlay3D } from './ui/HUDOverlay3D';
import { PauseMenuModal } from '../game/ui/PauseMenuModal';
import { MissionCompleteModal } from '../game/ui/MissionCompleteModal';
import { DynoWorkshopModal } from '../../garage/ui/DynoWorkshopModal';
import { TuningStudioModal } from '../../garage/ui/TuningStudioModal';
import { SuspensionAlignmentModal } from '../../garage/ui/SuspensionAlignmentModal';
import { LiveryEditorModal } from '../../garage/ui/LiveryEditorModal';
import { CareerDispatchModal } from '../../career/ui/CareerDispatchModal';
import { UsedCarMarketModal } from '../../economy/ui/UsedCarMarketModal';
import { RealEstateModal } from '../../economy/ui/RealEstateModal';
import { BankingFinanceModal } from '../../economy/ui/BankingFinanceModal';
import { GameTelemetry, NavigationInstruction, AITrafficVehicle } from './types';
import { audioService } from '../../../services/audioService';
import { useGame } from '../../../context/GameContext';
import { Gauge, Cpu, Compass, Palette, Briefcase, ShoppingBag, Building2, Landmark } from 'lucide-react';
import * as THREE from 'three';

interface Driving3DPageProps {
  onNavigate?: (path: string) => void;
}

export const Driving3DPage: React.FC<Driving3DPageProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ThreeEngine | null>(null);
  const { selectedVehicle, addTransaction, issueViolation, recordDriveSession, playerCredits, updatePlayerCredits, creditScore } = useGame() as any;

  // Modals state
  const [isDynoOpen, setIsDynoOpen] = useState(false);
  const [isTuningOpen, setIsTuningOpen] = useState(false);
  const [isAlignmentOpen, setIsAlignmentOpen] = useState(false);
  const [isLiveryOpen, setIsLiveryOpen] = useState(false);
  const [isCareerOpen, setIsCareerOpen] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [isRealEstateOpen, setIsRealEstateOpen] = useState(false);
  const [isBankingOpen, setIsBankingOpen] = useState(false);

  // Local HUD state
  const [telemetry, setTelemetry] = useState<GameTelemetry>({
    speedKmh: 0,
    rpm: 900,
    gear: 'D1',
    fuelPercent: 88,
    vehicleHealth: 100,
    speedLimit: 70,
    distanceRemaining: 1100,
    destinationName: 'Airport International Terminal',
    currentStreet: 'Metro Parkway',
    timeElapsed: 0,
    headlightsOn: true,
    blinkerLeft: false,
    blinkerRight: false,
    cameraMode: 'first_person',
    violations: 0,
    weather: 'sunny',
    timeOfDay: 'afternoon',
    isPaused: false,
    isMissionComplete: false,
    score: 100,
    cashEarned: 350,
    xpEarned: 180,
  });

  const [navInstruction, setNavInstruction] = useState<NavigationInstruction>({
    action: 'straight',
    text: 'CONTINUE STRAIGHT ON METRO PKWY',
    streetName: 'Metro Parkway',
    distance: 700,
  });

  const [playerPos, setPlayerPos] = useState<THREE.Vector3>(new THREE.Vector3(2.2, 0, 0));
  const [playerHeading, setPlayerHeading] = useState<number>(0);
  const [trafficVehicles, setTrafficVehicles] = useState<AITrafficVehicle[]>([]);

  const [isPaused, setIsPaused] = useState(false);
  const [isMissionComplete, setIsMissionComplete] = useState(false);
  const [violationToast, setViolationToast] = useState<string | null>(null);

  // Initialize Three.js 3D Engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const paintHex = selectedVehicle?.customization?.exterior?.paintColor
      ? parseInt(selectedVehicle.customization.exterior.paintColor.replace('#', '0x'), 16)
      : (selectedVehicle?.color ? parseInt(selectedVehicle.color.replace('#', '0x'), 16) : 0x0066ff);

    const category = selectedVehicle?.category || 'sports';

    const engine = new ThreeEngine(canvasRef.current, paintHex, category);
    engineRef.current = engine;

    // Start Web Audio engine sound
    audioService.startEngine();

    // Telemetry Update hook
    engine.onTelemetryUpdate = (t, nav) => {
      setTelemetry(t);
      setNavInstruction(nav);
      setPlayerPos(engine.getPlayerPosition().clone());
      setPlayerHeading(engine.playerPhysics.state.rotation.y);
      setTrafficVehicles([...engine.getTrafficVehicles()]);

      // Update Audio Engine Sound
      audioService.updateEngineRpm(t.rpm);
    };

    // Collision Impact Hook
    engine.playerPhysics.onCollisionCallback = (severity) => {
      audioService.playAlert();
    };

    // Mission Completion Hook
    engine.onMissionCompleteCallback = () => {
      setIsMissionComplete(true);
      audioService.playCash();
      addTransaction('INCOME', 'JOB_PAYOUT', 850, 'Airport Taxi Mission Payout');
      recordDriveSession(1.2, 90, 1.8, { tyres: 1, brakes: 1 });
    };

    // Traffic Violation Hook
    engine.onViolationCallback = (reason) => {
      setViolationToast(reason);
      audioService.playAlert();
      issueViolation('Red Light', 500, 2);
      setTimeout(() => setViolationToast(null), 3000);
    };

    engine.start();

    return () => {
      audioService.stopEngine();
      engine.dispose();
      engineRef.current = null;
    };
  }, [selectedVehicle, addTransaction, issueViolation, recordDriveSession]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          engine.input.throttle = 1.0;
          break;
        case 'KeyS':
        case 'ArrowDown':
          engine.input.brake = 1.0;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          engine.input.steer = 1.0; // steer left
          break;
        case 'KeyD':
        case 'ArrowRight':
          engine.input.steer = -1.0; // steer right
          break;
        case 'Space':
          engine.input.handbrake = true;
          break;
        case 'KeyC':
        case 'KeyV':
          engine.toggleCamera();
          break;
        case 'KeyH':
        case 'KeyL':
          engine.toggleHeadlights();
          break;
        case 'KeyT':
          engine.toggleTimeOfDay();
          break;
        case 'KeyY':
          setIsDynoOpen((prev) => !prev);
          break;
        case 'KeyK':
          setIsTuningOpen((prev) => !prev);
          break;
        case 'KeyO':
          setIsAlignmentOpen((prev) => !prev);
          break;
        case 'KeyX':
          setIsLiveryOpen((prev) => !prev);
          break;
        case 'KeyJ':
        case 'KeyM':
          setIsCareerOpen((prev) => !prev);
          break;
        case 'KeyU':
          setIsMarketOpen((prev) => !prev);
          break;
        case 'KeyG':
          setIsRealEstateOpen((prev) => !prev);
          break;
        case 'KeyB':
          setIsBankingOpen((prev) => !prev);
          break;
        case 'Escape':
        case 'KeyP':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          engine.input.throttle = 0;
          break;
        case 'KeyS':
        case 'ArrowDown':
          engine.input.brake = 0;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          if (engine.input.steer > 0) engine.input.steer = 0;
          break;
        case 'KeyD':
        case 'ArrowRight':
          if (engine.input.steer < 0) engine.input.steer = 0;
          break;
        case 'Space':
          engine.input.handbrake = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pause / Resume handler
  useEffect(() => {
    if (engineRef.current) {
      if (isPaused) {
        engineRef.current.stop();
        audioService.stopEngine();
      } else {
        engineRef.current.start();
        audioService.startEngine();
      }
    }
  }, [isPaused]);

  const handleToggleCamera = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.toggleCamera();
    }
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleRestart = useCallback(() => {
    window.location.reload();
  }, []);

  const handleExitToGarage = useCallback(() => {
    if (onNavigate) onNavigate('/garage');
    else window.location.pathname = '/garage';
  }, [onNavigate]);

  const handleExitToDashboard = useCallback(() => {
    if (onNavigate) onNavigate('/dashboard');
    else window.location.pathname = '/dashboard';
  }, [onNavigate]);

  const handleNextJob = useCallback(() => {
    if (onNavigate) onNavigate('/jobs');
    else window.location.pathname = '/jobs';
  }, [onNavigate]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* Three.js 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair focus:outline-none"
      />

      {/* Tactical Driver HUD Overlay */}
      <HUDOverlay3D
        telemetry={telemetry}
        navInstruction={navInstruction}
        playerPos={playerPos}
        playerHeading={playerHeading}
        trafficVehicles={trafficVehicles}
        onToggleCamera={handleToggleCamera}
        onPause={() => setIsPaused(true)}
      />

      {/* Tactical Quick Action Bay Drawer (Bottom Dock) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-2xl">
        <button
          onClick={() => setIsDynoOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-amber-600/20 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 text-xs font-bold transition-all"
          title="Dyno Workshop (Y)"
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>Dyno (Y)</span>
        </button>

        <button
          onClick={() => setIsTuningOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 border border-slate-800 hover:border-blue-500/40 text-xs font-bold transition-all"
          title="ECU Tuning (K)"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Tuning (K)</span>
        </button>

        <button
          onClick={() => setIsAlignmentOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-purple-600/20 text-slate-300 hover:text-purple-400 border border-slate-800 hover:border-purple-500/40 text-xs font-bold transition-all"
          title="Laser Alignment (O)"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Align (O)</span>
        </button>

        <button
          onClick={() => setIsLiveryOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-pink-600/20 text-slate-300 hover:text-pink-400 border border-slate-800 hover:border-pink-500/40 text-xs font-bold transition-all"
          title="Paint & Wrap Livery (X)"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Wrap (X)</span>
        </button>

        <button
          onClick={() => setIsCareerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold transition-all"
          title="Career Dispatch (J/M)"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Dispatch (J)</span>
        </button>

        <button
          onClick={() => setIsMarketOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-amber-600/20 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 text-xs font-bold transition-all"
          title="Used Car Market (U)"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Market (U)</span>
        </button>

        <button
          onClick={() => setIsRealEstateOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-purple-600/20 text-slate-300 hover:text-purple-400 border border-slate-800 hover:border-purple-500/40 text-xs font-bold transition-all"
          title="Real Estate Garages (G)"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Garages (G)</span>
        </button>

        <button
          onClick={() => setIsBankingOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold transition-all"
          title="National Bank & Stocks (B)"
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Bank (B)</span>
        </button>
      </div>

      {/* Traffic Violation Toast Banner */}
      {violationToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-900/95 border-2 border-red-500 shadow-2xl text-white font-mono text-sm animate-bounce">
          <span className="w-3 h-3 rounded-full bg-red-400 animate-ping" />
          <span className="font-bold uppercase tracking-wider">{violationToast}</span>
          <span className="text-xs text-red-200">(Fine: ₹500)</span>
        </div>
      )}

      {/* Modals */}
      {isDynoOpen && (
        <DynoWorkshopModal
          vehicleName={selectedVehicle?.name || 'Vortex GT V10'}
          vehicleId={selectedVehicle?.id || 'veh_default'}
          baseHp={selectedVehicle?.performance?.horsePower || 520}
          baseTorque={selectedVehicle?.performance?.torque || 600}
          redlineRpm={selectedVehicle?.performance?.redlineRpm || 8500}
          drivetrain={(selectedVehicle?.drivetrain as any) || 'RWD'}
          isTurbocharged={true}
          onClose={() => setIsDynoOpen(false)}
        />
      )}

      {isTuningOpen && (
        <TuningStudioModal
          vehicleName={selectedVehicle?.name || 'Vortex GT V10'}
          baseHp={selectedVehicle?.performance?.horsePower || 520}
          baseTorque={selectedVehicle?.performance?.torque || 600}
          baseRedline={selectedVehicle?.performance?.redlineRpm || 8500}
          baseWeightKg={1450}
          isNaturallyAspirated={false}
          playerCredits={playerCredits || 45000}
          onApplyTune={(cost, metrics) => {
            if (updatePlayerCredits) updatePlayerCredits(-cost);
            audioService.playCash();
          }}
          onClose={() => setIsTuningOpen(false)}
        />
      )}

      {isAlignmentOpen && (
        <SuspensionAlignmentModal
          vehicleName={selectedVehicle?.name || 'Vortex GT V10'}
          baseWeightKg={1450}
          baseLateralG={1.15}
          playerCredits={playerCredits || 45000}
          onApplyAlignment={(cost, config) => {
            if (updatePlayerCredits) updatePlayerCredits(-cost);
            audioService.playCash();
          }}
          onClose={() => setIsAlignmentOpen(false)}
        />
      )}

      {isLiveryOpen && (
        <LiveryEditorModal
          vehicleName={selectedVehicle?.name || 'Vortex GT V10'}
          playerCredits={playerCredits || 45000}
          onSaveLivery={(scheme, cost) => {
            if (updatePlayerCredits) updatePlayerCredits(-cost);
            audioService.playCash();
          }}
          onClose={() => setIsLiveryOpen(false)}
        />
      )}

      {isCareerOpen && (
        <CareerDispatchModal
          currentDistrict={telemetry.currentStreet.split('•')[0].trim() || 'Downtown'}
          driverLevel={12}
          onAcceptMission={(mission, type) => {
            audioService.playAlert();
          }}
          onClose={() => setIsCareerOpen(false)}
        />
      )}

      {isMarketOpen && (
        <UsedCarMarketModal
          playerCredits={playerCredits || 45000}
          onBuyCar={(listing, price) => {
            if (updatePlayerCredits) updatePlayerCredits(-price);
            audioService.playCash();
          }}
          onClose={() => setIsMarketOpen(false)}
        />
      )}

      {isRealEstateOpen && (
        <RealEstateModal
          playerCredits={playerCredits || 45000}
          onBuyProperty={(propId, price) => {
            if (updatePlayerCredits) updatePlayerCredits(-price);
            audioService.playCash();
          }}
          onClose={() => setIsRealEstateOpen(false)}
        />
      )}

      {isBankingOpen && (
        <BankingFinanceModal
          playerCredits={playerCredits || 45000}
          creditScore={creditScore || 745}
          onUpdateCredits={(delta) => {
            if (updatePlayerCredits) updatePlayerCredits(delta);
          }}
          onClose={() => setIsBankingOpen(false)}
        />
      )}

      {/* Pause Menu Modal */}
      <PauseMenuModal
        isOpen={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
        onNavigate={(path) => {
          if (onNavigate) onNavigate(path);
          else window.location.pathname = path;
        }}
      />

      {/* Mission Complete Modal */}
      <MissionCompleteModal
        isOpen={isMissionComplete}
        jobTitle="Airport Taxi Service"
        distanceKm={1.2}
        elapsedSeconds={telemetry.timeElapsed}
        safeScore={telemetry.score}
        violationsCount={telemetry.violations}
        fuelUsedL={1.8}
        bodyDamagePct={100 - telemetry.vehicleHealth}
        passengerRating={5.0}
        cashReward={850}
        xpReward={250}
        onContinue={handleExitToDashboard}
        onNextJob={handleNextJob}
      />
    </div>
  );
};
