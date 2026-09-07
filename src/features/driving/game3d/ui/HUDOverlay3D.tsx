import React, { useEffect, useRef } from 'react';
import { GameTelemetry, NavigationInstruction, AITrafficVehicle } from '../types';
import {
  Navigation,
  ArrowUp,
  CornerUpLeft,
  CornerUpRight,
  Shield,
  Fuel,
  Gauge,
  Camera,
  Pause,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import * as THREE from 'three';

interface HUDOverlay3DProps {
  telemetry: GameTelemetry;
  navInstruction: NavigationInstruction;
  playerPos: THREE.Vector3;
  playerHeading: number;
  trafficVehicles: AITrafficVehicle[];
  onToggleCamera: () => void;
  onPause: () => void;
  onTouchThrottle?: (val: number) => void;
  onTouchBrake?: (val: number) => void;
  onTouchSteer?: (val: number) => void;
}

export const HUDOverlay3D: React.FC<HUDOverlay3DProps> = ({
  telemetry,
  navInstruction,
  playerPos,
  playerHeading,
  trafficVehicles,
  onToggleCamera,
  onPause,
  onTouchThrottle,
  onTouchBrake,
  onTouchSteer,
}) => {
  const miniMapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render MiniMap Radar on HTML Canvas
  useEffect(() => {
    const canvas = miniMapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const center = width / 2;
    const scale = 0.55; // pixels per world meter

    ctx.clearRect(0, 0, width, height);

    // Background circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, center - 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00f5d4';
    ctx.stroke();
    ctx.clip();

    // Radar concentric grid rings
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.15)';
    ctx.lineWidth = 1;
    [30, 60, 90].forEach((r) => {
      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Translate & Rotate map to follow player
    ctx.translate(center, center);
    ctx.rotate(-playerHeading);

    // 1. Draw 3D Road Corridors relative to player
    ctx.fillStyle = 'rgba(51, 65, 85, 0.6)';
    // Metro Parkway (Z corridor)
    ctx.fillRect(
      (-8 - playerPos.x) * scale,
      (-150 - playerPos.z) * scale,
      16 * scale,
      1350 * scale
    );
    // Airport Highway (Z = 800)
    ctx.fillRect(
      (-400 - playerPos.x) * scale,
      (800 - 8 - playerPos.z) * scale,
      800 * scale,
      16 * scale
    );
    // Terminal Way (X = 300)
    ctx.fillRect(
      (300 - 7 - playerPos.x) * scale,
      (800 - playerPos.z) * scale,
      14 * scale,
      350 * scale
    );

    // 2. Draw Destination Flag (300, 1100)
    const destRelX = (300 - playerPos.x) * scale;
    const destRelZ = (1100 - playerPos.z) * scale;
    ctx.fillStyle = '#00f5d4';
    ctx.beginPath();
    ctx.arc(destRelX, destRelZ, 6, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw AI Traffic Blips
    for (const v of trafficVehicles) {
      const relX = (v.position.x - playerPos.x) * scale;
      const relZ = (v.position.z - playerPos.z) * scale;

      // Only draw if within radar range
      if (Math.hypot(relX, relZ) < center - 4) {
        ctx.fillStyle = v.direction === 'forward' ? '#10b981' : '#ef4444';
        ctx.beginPath();
        if (v.category === 'motorcycle') {
          ctx.arc(relX, relZ, 2.5, 0, Math.PI * 2);
        } else if (v.category === 'bus' || v.category === 'truck') {
          ctx.rect(relX - 3, relZ - 5, 6, 10);
        } else {
          ctx.rect(relX - 2.5, relZ - 4, 5, 8);
        }
        ctx.fill();
      }
    }

    ctx.restore();

    // 4. Draw Player Vehicle marker at exact center (pointing up)
    ctx.save();
    ctx.translate(center, center);
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 6);
    ctx.lineTo(0, 3);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [playerPos, playerHeading, trafficVehicles]);

  const isSpeeding = telemetry.speedKmh > telemetry.speedLimit;

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 overflow-hidden z-20">
      {/* =================================================== */}
      {/* TOP BAR: GPS GUIDANCE & MINI-MAP RADAR */}
      {/* =================================================== */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left: Quick Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 transition"
            title="Pause [ESC]"
          >
            <Pause className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold">ESC</span>
          </button>

          <button
            onClick={onToggleCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 transition"
            title="Switch Camera [C / V]"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold">
              {telemetry.cameraMode === 'first_person' ? '1ST PERSON' : '3RD PERSON'}
            </span>
          </button>
        </div>

        {/* Top-Center: Turn-by-Turn GPS Navigation Banner */}
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 shadow-lg shadow-cyan-500/10 max-w-md">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center flex-shrink-0 text-cyan-400">
            {navInstruction.action === 'left' ? (
              <CornerUpLeft className="w-6 h-6 stroke-[2.5]" />
            ) : navInstruction.action === 'right' ? (
              <CornerUpRight className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <ArrowUp className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide uppercase">
              {navInstruction.text}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{navInstruction.streetName}</span>
              <span>•</span>
              <span className="text-cyan-400 font-mono font-semibold">
                {navInstruction.distance}m
              </span>
            </div>
          </div>
        </div>

        {/* Top-Right: Mini-Map Radar */}
        <div className="flex flex-col items-end gap-1 pointer-events-auto">
          <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-2xl border-2 border-cyan-500/50 bg-slate-950/90">
            <canvas ref={miniMapCanvasRef} width={144} height={144} className="w-full h-full" />
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-[10px] text-slate-300 font-mono">
            <Navigation className="w-3 h-3 text-cyan-400" />
            <span>DEST: {telemetry.distanceRemaining}m</span>
          </div>
        </div>
      </div>

      {/* =================================================== */}
      {/* SPEED LIMIT WARNING (if speeding) */}
      {/* =================================================== */}
      {isSpeeding && (
        <div className="self-center flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/90 border border-red-400 text-white text-xs font-bold animate-pulse shadow-lg shadow-red-600/30">
          <AlertTriangle className="w-4 h-4" />
          <span>SPEED LIMIT EXCEEDED ({telemetry.speedLimit} KM/H)</span>
        </div>
      )}

      {/* =================================================== */}
      {/* BOTTOM CLUSTER: SLEEK TELEMETRY HUD STRIP */}
      {/* =================================================== */}
      <div className="flex items-end justify-between w-full">
        {/* Bottom-Left: Vehicle Status Bars */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 w-52">
          {/* Health Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                CONDITION
              </span>
              <span className={telemetry.vehicleHealth < 40 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {telemetry.vehicleHealth}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  telemetry.vehicleHealth < 40 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${telemetry.vehicleHealth}%` }}
              />
            </div>
          </div>

          {/* Fuel Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Fuel className="w-3 h-3 text-amber-400" />
                FUEL
              </span>
              <span className="text-amber-400 font-bold">{telemetry.fuelPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-200"
                style={{ width: `${telemetry.fuelPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom-Center: Big Digital Speedometer & Gear */}
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 shadow-2xl">
          {/* Speed Limit Badge */}
          <div className="w-11 h-11 rounded-full border-2 border-red-500 bg-white text-slate-950 flex flex-col items-center justify-center font-bold">
            <span className="text-[9px] leading-none uppercase text-slate-700">LIMIT</span>
            <span className="text-xs leading-none font-black">{telemetry.speedLimit}</span>
          </div>

          {/* Speed Numbers */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black font-mono tracking-tight text-white">
                {telemetry.speedKmh}
              </span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                KM/H
              </span>
            </div>

            {/* RPM Bar */}
            <div className="w-36 flex flex-col gap-0.5 mt-1">
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-100 ${
                    telemetry.rpm > 6500 ? 'bg-red-500' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.min(100, (telemetry.rpm / 7500) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>0</span>
                <span>{telemetry.rpm} RPM</span>
                <span className="text-red-400">REDLINE</span>
              </div>
            </div>
          </div>

          {/* Current Gear */}
          <div className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700">
            <span className="text-[10px] text-slate-400 font-mono">GEAR</span>
            <span className="text-2xl font-black font-mono text-cyan-400">
              {telemetry.gear}
            </span>
          </div>
        </div>

        {/* Bottom-Right: Keyboard Controls Hint */}
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-400">
          <div className="flex justify-between gap-3">
            <span className="text-white font-bold">W / ↑</span>
            <span>Accelerate</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white font-bold">S / ↓</span>
            <span>Brake / Reverse</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white font-bold">A / D</span>
            <span>Steer Left / Right</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white font-bold">SPACE</span>
            <span>Handbrake</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white font-bold">H</span>
            <span>Headlights</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-white font-bold">C / V</span>
            <span>Switch Camera</span>
          </div>
        </div>
      </div>
    </div>
  );
};
