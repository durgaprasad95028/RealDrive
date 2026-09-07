import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGame } from '../../../context/GameContext';
import { RoadRenderer } from './engine/RoadRenderer';
import { CarRenderer } from './engine/CarRenderer';
import { TrafficSystem } from './engine/TrafficSystem';
import { PhysicsEngine, PlayerControls } from './engine/PhysicsEngine';
import { RoadSegment, CameraMode, GameTelemetry } from './engine/types';
import { GameHUDOverlay } from './ui/GameHUDOverlay';
import { PauseMenuModal } from './ui/PauseMenuModal';
import { MissionCompleteModal } from './ui/MissionCompleteModal';
import { audioService } from '../../../services/audioService';

interface DrivingGamePageProps {
  onNavigate: (path: string) => void;
}

export const DrivingGamePage: React.FC<DrivingGamePageProps> = ({ onNavigate }) => {
  const { 
    selectedVehicle, 
    activeJob, 
    completeJob, 
    issueViolation, 
    currentWeather, 
    timeOfDay,
    settings 
  } = useGame();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Engine Instances
  const physicsRef = useRef(new PhysicsEngine());
  const trafficRef = useRef(new TrafficSystem());
  const segmentsRef = useRef<RoadSegment[]>([]);

  // Camera & Game State
  const [cameraMode, setCameraMode] = useState<CameraMode>('THIRD_PERSON');
  const [isPaused, setIsPaused] = useState(false);
  const [isMissionComplete, setIsMissionComplete] = useState(false);
  const [speedTrapAlert, setSpeedTrapAlert] = useState(false);
  const [lastViolationTime, setLastViolationTime] = useState(0);

  // Job Details
  const initialDistanceKm = activeJob ? activeJob.distanceKm : 12.0;
  const destinationName = activeJob ? activeJob.destination : 'Grand Central Metropolis';
  const jobTitle = activeJob ? activeJob.title : 'Free Highway Roam';
  const rewardAmount = activeJob ? activeJob.reward : 600;
  const xpAmount = activeJob ? activeJob.xpReward : 100;

  // Active Controls State
  const controlsRef = useRef<PlayerControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    handbrake: false,
  });

  // Telemetry state for HUD
  const [telemetry, setTelemetry] = useState<GameTelemetry>({
    speedKmh: 0,
    rpm: 900,
    gear: 'P',
    fuelPct: selectedVehicle?.health.fuel || 80,
    engineHealthPct: selectedVehicle?.health.engine || 90,
    bodyHealthPct: 100,
    distanceRemainingKm: initialDistanceKm,
    totalTripKm: 0,
    elapsedSeconds: 0,
    violationsCount: 0,
    speedLimit: 80,
    currentInstruction: 'Continue straight on Metropolitan Expressway',
    destinationName,
    safeScore: 98,
    isSpeeding: false,
    cameraMode: 'THIRD_PERSON',
  });

  const totalRoadLength = 200 * RoadRenderer.SEGMENT_LENGTH;

  // Initialize Road Track Segments
  useEffect(() => {
    const segments: RoadSegment[] = [];
    const numSegments = 200;

    for (let i = 0; i < numSegments; i++) {
      const isCurvingLeft = i > 40 && i < 70;
      const isCurvingRight = i > 110 && i < 150;
      const curve = isCurvingLeft ? -2.4 : isCurvingRight ? 2.8 : 0;

      const isAlternate = Math.floor(i / 3) % 2 === 0;

      segments.push({
        index: i,
        p1: {
          world: { x: 0, y: 0, z: i * RoadRenderer.SEGMENT_LENGTH },
          screen: { x: 0, y: 0, w: 0, scale: 0 },
        },
        p2: {
          world: { x: 0, y: 0, z: (i + 1) * RoadRenderer.SEGMENT_LENGTH },
          screen: { x: 0, y: 0, w: 0, scale: 0 },
        },
        curve,
        color: {
          road: isAlternate ? '#1E293B' : '#0F172A',
          grass: isAlternate ? '#064E3B' : '#065F46',
          rumble: isAlternate ? '#EF4444' : '#FFFFFF',
          lane: isAlternate ? '#F8FAFC' : '',
        },
        hasLight: i % 8 === 0,
        hasSignal: i === 60 || i === 140,
        signalState: 'GREEN',
        speedLimit: i > 80 && i < 130 ? 100 : 80,
      });
    }

    segmentsRef.current = segments;
    trafficRef.current.init(totalRoadLength);
  }, [totalRoadLength]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPaused(prev => !prev);
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        setCameraMode(prev => prev === 'THIRD_PERSON' ? 'FIRST_PERSON' : 'THIRD_PERSON');
        return;
      }

      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') controlsRef.current.forward = true;
      if (k === 's' || e.key === 'ArrowDown') controlsRef.current.backward = true;
      if (k === 'a' || e.key === 'ArrowLeft') controlsRef.current.left = true;
      if (k === 'd' || e.key === 'ArrowRight') controlsRef.current.right = true;
      if (e.key === ' ') controlsRef.current.handbrake = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp') controlsRef.current.forward = false;
      if (k === 's' || e.key === 'ArrowDown') controlsRef.current.backward = false;
      if (k === 'a' || e.key === 'ArrowLeft') controlsRef.current.left = false;
      if (k === 'd' || e.key === 'ArrowRight') controlsRef.current.right = false;
      if (e.key === ' ') controlsRef.current.handbrake = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main 60fps Canvas Simulation & Render Loop
  useEffect(() => {
    if (!selectedVehicle) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let skyOffset = 0;
    let elapsed = 0;
    let rainDrops = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 14 + Math.random() * 8,
      l: 18 + Math.random() * 12,
    }));

    audioService.startEngine(900);

    const gameLoop = (currentTime: number) => {
      const dt = Math.min(0.05, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle Resize dynamically
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const width = canvas.width;
      const height = canvas.height;

      if (!isPaused && !isMissionComplete) {
        elapsed += dt;

        // 1. Update Physics
        const physics = physicsRef.current;
        physics.update(dt, controlsRef.current, selectedVehicle, currentWeather, totalRoadLength);

        audioService.updateEngineRpm(physics.rpm);

        // 2. Traffic Signal Cycles (Every 16 seconds)
        const cycleSec = Math.floor(elapsed) % 16;
        const activeSignal: 'GREEN' | 'YELLOW' | 'RED' = cycleSec < 10 ? 'GREEN' : cycleSec < 13 ? 'YELLOW' : 'RED';

        // 3. Update Traffic
        const traffic = trafficRef.current;
        traffic.update(dt, totalRoadLength, physics.playerZ, activeSignal);

        // 4. Collision Detection
        const collision = traffic.checkCollision(physics.playerZ, physics.posX, physics.speedKmh);
        if (collision.collided) {
          physics.applyCollision(collision.damagePct);
          audioService.playAlert();
        }

        // 5. Speeding Violation Check
        const currentSegmentIndex = Math.floor(physics.playerZ / RoadRenderer.SEGMENT_LENGTH) % segmentsRef.current.length;
        const currentLimit = segmentsRef.current[currentSegmentIndex]?.speedLimit || 80;

        if (physics.speedKmh > currentLimit + 18 && currentTime - lastViolationTime > 12000) {
          setLastViolationTime(currentTime);
          setSpeedTrapAlert(true);
          issueViolation('Speeding', 250, 2, Math.round(physics.speedKmh), currentLimit);
          setTimeout(() => setSpeedTrapAlert(false), 3000);
        }

        // 6. Navigation Distance & Turn Guidance
        const remainingKm = Math.max(0, initialDistanceKm - physics.totalDistanceDrivenKm);

        let navInstruction = 'Continue straight on Expressway';
        if (remainingKm < 0.3) navInstruction = 'Destination on right. Prepare to stop!';
        else if (remainingKm < 1.2) navInstruction = 'Take exit towards Airport Terminal in 800m';
        else if (remainingKm < 3.5) navInstruction = 'Merge left onto High-Speed Bypass';

        // 7. Check Mission Complete!
        if (remainingKm <= 0 && !isMissionComplete) {
          setIsMissionComplete(true);
          audioService.stopEngine();
          audioService.playCash();
          if (activeJob) {
            completeJob(activeJob.id, true, false);
          }
        }

        // Update HUD Telemetry
        setTelemetry({
          speedKmh: physics.speedKmh,
          rpm: physics.rpm,
          gear: physics.gear,
          fuelPct: Math.max(0, Math.round(selectedVehicle.health.fuel - (physics.fuelUsedL / selectedVehicle.fuelCapacityL) * 100)),
          engineHealthPct: selectedVehicle.health.engine,
          bodyHealthPct: Math.max(20, 100 - physics.bodyDamagePct),
          distanceRemainingKm: remainingKm,
          totalTripKm: physics.totalDistanceDrivenKm,
          elapsedSeconds: elapsed,
          violationsCount: lastViolationTime > 0 ? 1 : 0,
          speedLimit: currentLimit,
          currentInstruction: navInstruction,
          destinationName,
          safeScore: Math.max(50, 100 - physics.bodyDamagePct - (lastViolationTime > 0 ? 10 : 0)),
          isSpeeding: physics.speedKmh > currentLimit,
          cameraMode,
        });

        skyOffset -= physics.speedKmh * 0.05 * dt;

        // Update rain particles
        if (currentWeather.type === 'RAIN' || currentWeather.type === 'HEAVY_RAIN') {
          rainDrops.forEach((d) => {
            d.y += d.speed;
            if (d.y > height) {
              d.y = -20;
              d.x = Math.random() * width;
            }
          });
        }
      }

      // ==========================================
      // CANVAS RENDERING PASS
      // ==========================================
      ctx.clearRect(0, 0, width, height);

      // 1. Render Sky, Horizon & Distant City Skyline
      RoadRenderer.renderSky(ctx, width, height, timeOfDay, currentWeather.type, skyOffset);

      // 2. Project Road Segments in Perspective Depth
      const physics = physicsRef.current;
      const cameraDepth = RoadRenderer.CAMERA_DEPTH;
      const cameraHeight = cameraMode === 'FIRST_PERSON' ? 750 : 1000;
      const playerSegment = Math.floor(physics.playerZ / RoadRenderer.SEGMENT_LENGTH);

      let maxScreenY = height;
      let curveOffset = 0;

      const baseSegment = segmentsRef.current[playerSegment % segmentsRef.current.length];

      for (let n = 0; n < RoadRenderer.DRAW_DISTANCE; n++) {
        const segIdx = (playerSegment + n) % segmentsRef.current.length;
        const segment = segmentsRef.current[segIdx];

        curveOffset += segment.curve;

        const p1Z = segment.p1.world.z + (n >= segmentsRef.current.length - playerSegment ? totalRoadLength : 0);
        const p2Z = segment.p2.world.z + (n >= segmentsRef.current.length - playerSegment ? totalRoadLength : 0);

        segment.p1.screen = RoadRenderer.project(
          { x: segment.p1.world.x - physics.posX * RoadRenderer.ROAD_WIDTH + curveOffset * 2, y: 0, z: p1Z },
          0,
          cameraHeight,
          physics.playerZ,
          cameraDepth,
          width,
          height,
          RoadRenderer.ROAD_WIDTH
        );

        segment.p2.screen = RoadRenderer.project(
          { x: segment.p2.world.x - physics.posX * RoadRenderer.ROAD_WIDTH + curveOffset * 2, y: 0, z: p2Z },
          0,
          cameraHeight,
          physics.playerZ,
          cameraDepth,
          width,
          height,
          RoadRenderer.ROAD_WIDTH
        );

        if (segment.p1.screen.y >= maxScreenY || segment.p2.screen.y >= segment.p1.screen.y) {
          continue;
        }

        // Render Road Surface & Lanes
        RoadRenderer.renderSegment(
          ctx,
          width,
          4, // 4-lane highway
          segment.p1.screen.x,
          segment.p1.screen.y,
          segment.p1.screen.w,
          segment.p2.screen.x,
          segment.p2.screen.y,
          segment.p2.screen.w,
          segment.color
        );

        // Render Street Lights
        if (segment.hasLight) {
          RoadRenderer.renderStreetLight(
            ctx,
            segment.p1.screen.x - segment.p1.screen.w * 1.15,
            segment.p1.screen.y,
            segment.p1.screen.scale,
            'left',
            timeOfDay === 'NIGHT'
          );
        }

        // Render Overhead Traffic Signal Gantries
        if (segment.hasSignal) {
          const cycleSec = Math.floor(elapsed) % 16;
          const sigState: 'GREEN' | 'YELLOW' | 'RED' = cycleSec < 10 ? 'GREEN' : cycleSec < 13 ? 'YELLOW' : 'RED';
          RoadRenderer.renderTrafficSignalGantry(
            ctx,
            segment.p1.screen.x,
            segment.p1.screen.y,
            segment.p1.screen.w,
            segment.p1.screen.scale,
            sigState
          );
        }

        // Render Speed Limit Signs
        if (segment.index === 30 || segment.index === 110) {
          RoadRenderer.renderSpeedLimitSign(
            ctx,
            segment.p1.screen.x + segment.p1.screen.w * 1.18,
            segment.p1.screen.y,
            segment.p1.screen.scale,
            segment.speedLimit || 80
          );
        }

        maxScreenY = segment.p1.screen.y;
      }

      // 3. Render AI Traffic Vehicles
      const traffic = trafficRef.current;
      traffic.cars.forEach((car) => {
        let relZ = car.z - physics.playerZ;
        if (relZ < 0) relZ += totalRoadLength;

        if (relZ > 50 && relZ < RoadRenderer.DRAW_DISTANCE * RoadRenderer.SEGMENT_LENGTH) {
          const scale = cameraDepth / relZ;
          const screenX = Math.round(width / 2 + (scale * (car.x * RoadRenderer.ROAD_WIDTH - physics.posX * RoadRenderer.ROAD_WIDTH) * width) / 2);
          const screenY = Math.round(height / 2 - (scale * (0 - cameraHeight) * height) / 2);

          traffic.renderCar(ctx, car, screenX, screenY, scale * 3.8, timeOfDay === 'NIGHT');
        }
      });

      // 4. Render Player Vehicle
      if (cameraMode === 'THIRD_PERSON') {
        const playerScreenX = width / 2;
        const playerScreenY = height - 90;
        CarRenderer.renderPlayerCarThirdPerson(
          ctx,
          playerScreenX,
          playerScreenY,
          1.1,
          physics.steerAngle,
          controlsRef.current.backward,
          controlsRef.current.forward,
          'off',
          timeOfDay === 'NIGHT',
          selectedVehicle.customization,
          selectedVehicle.color
        );
      } else {
        // First Person Cockpit
        CarRenderer.renderCockpitView(
          ctx,
          width,
          height,
          physics.steerAngle,
          physics.speedKmh,
          physics.rpm,
          physics.gear
        );
      }

      // 5. Render Weather Rain/Fog Effects on Top
      RoadRenderer.renderWeatherOverlay(ctx, width, height, currentWeather.type, rainDrops);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      audioService.stopEngine();
    };
  }, [selectedVehicle, isPaused, isMissionComplete, cameraMode, currentWeather, timeOfDay, totalRoadLength, initialDistanceKm, destinationName, activeJob, completeJob, issueViolation, lastViolationTime]);

  const handleRestart = () => {
    physicsRef.current = new PhysicsEngine();
    trafficRef.current.init(totalRoadLength);
    setIsPaused(false);
    setIsMissionComplete(false);
  };

  return (
    <div className="fixed inset-0 bg-[#07090D] overflow-hidden select-none">
      {/* 60FPS Hardware-Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Modern Automotive Minimal Game HUD */}
      <GameHUDOverlay
        telemetry={telemetry}
        onToggleCamera={() => setCameraMode(prev => prev === 'THIRD_PERSON' ? 'FIRST_PERSON' : 'THIRD_PERSON')}
        onPause={() => setIsPaused(true)}
        controlsRef={controlsRef}
        touchControlsActive={true}
      />

      {/* Speeding Camera Ticket Alert Banner */}
      {speedTrapAlert && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 px-6 py-2 rounded-full bg-red-950/90 border-2 border-red-600 text-white font-mono font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <span>⚠ RADAR CITATION ISSUED: +2 PENALTY POINTS (-₹250)</span>
        </div>
      )}

      {/* In-Game ESC Pause Menu */}
      <PauseMenuModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onRestart={handleRestart}
        onNavigate={onNavigate}
      />

      {/* Mission Complete Summary Modal */}
      <MissionCompleteModal
        isOpen={isMissionComplete}
        jobTitle={jobTitle}
        distanceKm={telemetry.totalTripKm}
        elapsedSeconds={telemetry.elapsedSeconds}
        safeScore={telemetry.safeScore}
        violationsCount={telemetry.violationsCount}
        fuelUsedL={physicsRef.current.fuelUsedL}
        bodyDamagePct={telemetry.bodyHealthPct < 100 ? 100 - telemetry.bodyHealthPct : 0}
        passengerRating={4.9}
        cashReward={rewardAmount}
        xpReward={xpAmount}
        onContinue={() => onNavigate('/dashboard')}
        onNextJob={() => onNavigate('/jobs')}
      />
    </div>
  );
};
