import React from 'react';
import { 
  Navigation, 
  MapPin, 
  Fuel, 
  Wrench, 
  Camera, 
  Pause, 
  ShieldAlert, 
  Volume2, 
  VolumeX,
  Compass
} from 'lucide-react';
import { GameTelemetry } from '../engine/types';
import { Badge } from '../../../../components/common/Badge';
import { PlayerControls } from '../engine/PhysicsEngine';

interface GameHUDOverlayProps {
  telemetry: GameTelemetry;
  onToggleCamera: () => void;
  onPause: () => void;
  controlsRef: React.MutableRefObject<PlayerControls>;
  touchControlsActive: boolean;
}

export const GameHUDOverlay: React.FC<GameHUDOverlayProps> = ({
  telemetry,
  onToggleCamera,
  onPause,
  controlsRef,
  touchControlsActive,
}) => {
  const isSpeeding = telemetry.speedKmh > telemetry.speedLimit;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 select-none font-sans">
      {/* TOP BAR: NAVIGATION GUIDANCE & MINIMAP RADAR */}
      <div className="flex items-start justify-between gap-4">
        {/* Top-Left: Navigation & Objective Banner */}
        <div className="pointer-events-auto max-w-sm sm:max-w-md p-3.5 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-md shadow-2xl space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white animate-pulse">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                GPS ROUTE GUIDANCE
              </span>
              <h4 className="text-sm font-bold text-white truncate">{telemetry.destinationName}</h4>
            </div>
          </div>

          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-sky-300 font-semibold">{telemetry.currentInstruction}</span>
            <span className="text-amber-400 font-extrabold ml-2 whitespace-nowrap">
              {telemetry.distanceRemainingKm.toFixed(1)} km
            </span>
          </div>
        </div>

        {/* Top-Right: Mini Map Radar & Control Actions */}
        <div className="flex items-start gap-3 pointer-events-auto">
          {/* Radar Mini Map Frame */}
          <div className="relative w-36 h-36 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full border border-sky-500 rounded-full scale-75" />
              <div className="w-full h-full border border-sky-500 rounded-full scale-50 absolute inset-0" />
            </div>

            {/* Destination Marker */}
            <div className="absolute top-4 right-5 flex flex-col items-center animate-bounce">
              <div className="p-1 rounded-full bg-amber-500 text-black shadow-lg">
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Player Center Blip */}
            <div className="relative z-10 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_10px_#38BDF8] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>

            {/* Radar status label */}
            <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-emerald-400 font-bold">
              GPS 3D
            </span>
          </div>

          {/* Action Buttons: Camera & Pause */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onToggleCamera}
              className="p-2.5 rounded-xl bg-black/75 hover:bg-slate-800 border border-white/15 text-white backdrop-blur-md transition-all shadow-lg active:scale-95"
              title="Switch Camera (Press C)"
            >
              <Camera className="w-5 h-5 text-sky-400" />
            </button>

            <button
              onClick={onPause}
              className="p-2.5 rounded-xl bg-black/75 hover:bg-slate-800 border border-white/15 text-white backdrop-blur-md transition-all shadow-lg active:scale-95"
              title="Pause Simulation (Press ESC)"
            >
              <Pause className="w-5 h-5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR: SPEEDOMETER, GAUGES & TOUCH PEDALS */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
        {/* Bottom-Left: On-Screen Touch D-Pad Controls for Mobile / Touch */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-md">
            <div />
            <button
              onMouseDown={() => { controlsRef.current.forward = true; }}
              onMouseUp={() => { controlsRef.current.forward = false; }}
              onTouchStart={() => { controlsRef.current.forward = true; }}
              onTouchEnd={() => { controlsRef.current.forward = false; }}
              className="w-12 h-12 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold flex items-center justify-center active:scale-90 shadow-lg text-lg"
            >
              ▲
            </button>
            <div />

            <button
              onMouseDown={() => { controlsRef.current.left = true; }}
              onMouseUp={() => { controlsRef.current.left = false; }}
              onTouchStart={() => { controlsRef.current.left = true; }}
              onTouchEnd={() => { controlsRef.current.left = false; }}
              className="w-12 h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold flex items-center justify-center active:scale-90 text-lg"
            >
              ◀
            </button>

            <button
              onMouseDown={() => { controlsRef.current.backward = true; }}
              onMouseUp={() => { controlsRef.current.backward = false; }}
              onTouchStart={() => { controlsRef.current.backward = true; }}
              onTouchEnd={() => { controlsRef.current.backward = false; }}
              className="w-12 h-12 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold flex items-center justify-center active:scale-90 text-lg"
            >
              ▼
            </button>

            <button
              onMouseDown={() => { controlsRef.current.right = true; }}
              onMouseUp={() => { controlsRef.current.right = false; }}
              onTouchStart={() => { controlsRef.current.right = true; }}
              onTouchEnd={() => { controlsRef.current.right = false; }}
              className="w-12 h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold flex items-center justify-center active:scale-90 text-lg"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Bottom-Center: Digital Glowing Speedometer Dial & Speed Limit */}
        <div className="pointer-events-auto flex flex-col items-center">
          <div className="p-4 rounded-3xl bg-black/80 border border-white/15 backdrop-blur-md shadow-2xl flex flex-col items-center min-w-[200px]">
            {/* Speed Limit & Alert badge */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full border-2 border-red-500 bg-white text-black flex items-center justify-center font-bold text-[10px] font-mono">
                {telemetry.speedLimit}
              </div>
              {isSpeeding && (
                <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800 animate-pulse">
                  ⚠ SPEEDING
                </span>
              )}
            </div>

            {/* Velocity Readout */}
            <div className="flex items-baseline gap-1.5">
              <span className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${
                isSpeeding ? 'text-red-400 animate-pulse' : 'text-white'
              }`}>
                {Math.round(telemetry.speedKmh)}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">KM/H</span>
            </div>

            {/* Gear & RPM Bar */}
            <div className="flex items-center gap-3 mt-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-blue-950 text-sky-300 font-bold border border-blue-800">
                GEAR {telemetry.gear}
              </span>
              <span className="text-slate-300 font-semibold">
                {Math.round(telemetry.rpm)} RPM
              </span>
            </div>
          </div>
        </div>

        {/* Bottom-Right: Vehicle Health, Fuel, and Wear Readout */}
        <div className="pointer-events-auto p-3.5 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-md shadow-2xl space-y-2 min-w-[180px] font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-text flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              <span>Fuel:</span>
            </span>
            <span className={`font-bold ${telemetry.fuelPct < 20 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {telemetry.fuelPct}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-text flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-sky-400" />
              <span>Engine:</span>
            </span>
            <span className="font-bold text-emerald-400">{telemetry.engineHealthPct}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-text flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>Body:</span>
            </span>
            <span className={`font-bold ${telemetry.bodyHealthPct < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {telemetry.bodyHealthPct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
