import React from 'react';
import { Navigation, AlertTriangle, Flag, Radio } from 'lucide-react';
import { POI } from '../../types';

interface MiniMapHUDProps {
  currentLocationName?: string;
  headingDeg?: number;
  objectiveName?: string;
  objectiveDistanceKm?: number;
  pois?: POI[];
  speedCameraNear?: boolean;
  className?: string;
}

export const MiniMapHUD: React.FC<MiniMapHUDProps> = ({
  currentLocationName = 'Expressway Hub',
  headingDeg = 45,
  objectiveName,
  objectiveDistanceKm,
  pois = [],
  speedCameraNear = false,
  className = '',
}) => {
  return (
    <div className={`relative flex flex-col p-3 rounded-2xl bg-surface/90 border border-app-border backdrop-blur-md overflow-hidden ${className}`}>
      {/* Header bar with location & Radar indicator */}
      <div className="flex items-center justify-between text-xs mb-2 z-10">
        <div className="flex items-center gap-1.5 font-mono">
          <Navigation className="w-3.5 h-3.5 text-accent transform" style={{ transform: `rotate(${headingDeg}deg)` }} />
          <span className="font-semibold text-primary-text truncate max-w-[140px]">{currentLocationName}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>GPS 3D</span>
        </div>
      </div>

      {/* Radar Map Canvas Representation */}
      <div className="relative w-full h-44 rounded-xl bg-[#090D14] border border-app-border/80 overflow-hidden flex items-center justify-center">
        {/* Animated Radar Sweep */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-36 h-36 rounded-full border border-sky-500" />
          <div className="w-24 h-24 rounded-full border border-sky-500 absolute" />
          <div className="w-12 h-12 rounded-full border border-sky-500 absolute" />
        </div>

        {/* Road Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-40">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
          {/* Curving highway path */}
          <path d="M 20 120 Q 90 40 180 80" fill="none" stroke="#2563EB" strokeWidth="3" />
        </svg>

        {/* Objective Path Marker */}
        {objectiveName && (
          <div className="absolute top-6 right-8 flex flex-col items-center z-10 animate-bounce">
            <div className="p-1 rounded-full bg-amber-500 text-black shadow-lg">
              <Flag className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Center Vehicle Arrow */}
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400">
          <Navigation 
            className="w-4 h-4 text-white filter drop-shadow-[0_0_4px_rgba(56,189,248,0.9)]" 
            style={{ transform: `rotate(${headingDeg}deg)` }} 
          />
        </div>

        {/* Nearby Speed Camera warning */}
        {speedCameraNear && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/90 border border-red-700 text-danger text-[10px] font-mono font-bold animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>RADAR 400M</span>
          </div>
        )}
      </div>

      {/* Footer Navigation Target */}
      {objectiveName && (
        <div className="mt-2.5 p-2 rounded-lg bg-background-secondary/80 border border-app-border flex items-center justify-between text-xs font-mono">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] text-muted-text block uppercase">NAV ROUTE</span>
            <span className="text-sky-300 font-bold truncate block">{objectiveName}</span>
          </div>
          {typeof objectiveDistanceKm === 'number' && (
            <span className="text-amber-400 font-extrabold whitespace-nowrap">{objectiveDistanceKm.toFixed(1)} km</span>
          )}
        </div>
      )}
    </div>
  );
};
