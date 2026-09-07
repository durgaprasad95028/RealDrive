import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ThreeEngine } from './engine/ThreeEngine';
import { HUDOverlay3D } from './ui/HUDOverlay3D';
import { PauseMenuModal } from '../game/ui/PauseMenuModal';
import { MissionCompleteModal } from '../game/ui/MissionCompleteModal';
import { GameTelemetry, NavigationInstruction, AITrafficVehicle } from './types';
import { audioService } from '../../../services/audioService';
import { useGame } from '../../../context/GameContext';
import * as THREE from 'three';

interface Driving3DPageProps {
  onNavigate?: (path: string) => void;
}

export const Driving3DPage: React.FC<Driving3DPageProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ThreeEngine | null>(null);
  const { selectedVehicle, addTransaction, issueViolation, recordDriveSession } = useGame();

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
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
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

      {/* Traffic Violation Toast Banner */}
      {violationToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-650/95 bg-red-900 border-2 border-red-500 shadow-2xl text-white font-mono text-sm animate-bounce">
          <span className="w-3 h-3 rounded-full bg-red-400 animate-ping" />
          <span className="font-bold uppercase tracking-wider">{violationToast}</span>
          <span className="text-xs text-red-200">(Fine: ₹500)</span>
        </div>
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
