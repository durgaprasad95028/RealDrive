import React from 'react';
import { Fuel, Thermometer, Wind, Compass, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VehicleHealth } from '../../types';

interface TelemetryOverlayProps {
  fuelPct: number;
  engineTempC: number;
  roadGripPct: number;
  throttlePct: number; // 0 - 100
  brakePct: number;    // 0 - 100
  headingDeg: number;
  turnSignal: 'left' | 'right' | 'hazard' | 'off';
  absActive: boolean;
  tractionActive: boolean;
  className?: string;
}

export const TelemetryOverlay: React.FC<TelemetryOverlayProps> = ({
  fuelPct,
  engineTempC,
  roadGripPct,
  throttlePct,
  brakePct,
  headingDeg,
  turnSignal,
  absActive,
  tractionActive,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-surface/90 border border-app-border backdrop-blur-md ${className}`}>
      {/* Fuel Level */}
      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background-secondary/60 border border-app-border/80">
        <div className={`p-2 rounded-lg ${fuelPct < 20 ? 'bg-red-950 text-danger' : 'bg-blue-950 text-sky-400'}`}>
          <Fuel className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-muted-text uppercase">Fuel Tank</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-primary-text">{fuelPct}%</span>
            {fuelPct < 20 && <span className="text-[10px] text-danger font-bold">LOW</span>}
          </div>
        </div>
      </div>

      {/* Engine Temp */}
      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background-secondary/60 border border-app-border/80">
        <div className={`p-2 rounded-lg ${engineTempC > 105 ? 'bg-red-950 text-danger' : 'bg-slate-900 text-slate-300'}`}>
          <Thermometer className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-muted-text uppercase">Engine Temp</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-primary-text">{engineTempC}°C</span>
            <span className="text-[10px] text-muted-text">{engineTempC > 100 ? 'HOT' : 'NORM'}</span>
          </div>
        </div>
      </div>

      {/* Road Grip & Weather Traction */}
      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background-secondary/60 border border-app-border/80">
        <div className={`p-2 rounded-lg ${roadGripPct < 70 ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'}`}>
          <Wind className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-muted-text uppercase">Surface Grip</p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-primary-text">{roadGripPct}%</span>
            <span className="text-[10px] text-muted-text">{roadGripPct < 75 ? 'WET' : 'DRY'}</span>
          </div>
        </div>
      </div>

      {/* Pedal Inputs & Electronic Assists */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-background-secondary/60 border border-app-border/80">
        <div className="space-y-1.5 flex-1 pr-2">
          {/* Throttle */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="w-6 text-muted-text">GAS</span>
            <div className="flex-1 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-75" style={{ width: `${throttlePct}%` }} />
            </div>
          </div>
          {/* Brake */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            <span className="w-6 text-muted-text">BRK</span>
            <div className="flex-1 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
              <div className="h-full bg-danger transition-all duration-75" style={{ width: `${brakePct}%` }} />
            </div>
          </div>
        </div>

        {/* ABS / TCS Badges */}
        <div className="flex flex-col gap-1 text-[9px] font-mono font-bold">
          <span className={`px-1 rounded text-center ${absActive ? 'bg-amber-500 text-black animate-pulse' : 'text-slate-600 bg-surface-elevated'}`}>
            ABS
          </span>
          <span className={`px-1 rounded text-center ${tractionActive ? 'bg-sky-400 text-black animate-pulse' : 'text-slate-600 bg-surface-elevated'}`}>
            TCS
          </span>
        </div>
      </div>
    </div>
  );
};

export const VehicleHealthGrid: React.FC<{ health: VehicleHealth; className?: string }> = ({ health, className = '' }) => {
  const parts: Array<{ key: keyof VehicleHealth; label: string; value: number }> = [
    { key: 'engine', label: 'Engine', value: health.engine },
    { key: 'brakes', label: 'Brakes', value: health.brakes },
    { key: 'tyres', label: 'Tyres', value: health.tyres },
    { key: 'transmission', label: 'Transmission', value: health.transmission },
    { key: 'suspension', label: 'Suspension', value: health.suspension },
    { key: 'battery', label: 'Battery', value: health.battery },
    { key: 'body', label: 'Bodywork', value: health.body },
  ];

  const getColor = (val: number) => {
    if (val < 40) return 'text-danger bg-red-950/60 border-red-800/60';
    if (val < 75) return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
    return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 ${className}`}>
      {parts.map(p => (
        <div key={p.key} className={`p-2.5 rounded-xl border flex flex-col justify-between ${getColor(p.value)}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">{p.label}</span>
            <span className="text-xs font-mono font-bold">{p.value}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-300 ${
                p.value < 40 ? 'bg-danger' : p.value < 75 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${p.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
