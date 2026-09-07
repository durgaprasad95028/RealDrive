import React, { useState } from 'react';
import {
  SuspensionAlignmentBay,
  SuspensionAlignmentConfig,
  ChassisHandlingEvaluation,
} from '../tuning/SuspensionAlignmentBay';
import { Compass, RotateCw, Move, Shield, Check, X, Sliders, Gauge } from 'lucide-react';

interface SuspensionAlignmentModalProps {
  vehicleName: string;
  baseWeightKg: number;
  baseLateralG: number;
  playerCredits: number;
  onApplyAlignment: (cost: number, config: SuspensionAlignmentConfig) => void;
  onClose: () => void;
}

export const SuspensionAlignmentModal: React.FC<SuspensionAlignmentModalProps> = ({
  vehicleName,
  baseWeightKg,
  baseLateralG,
  playerCredits,
  onApplyAlignment,
  onClose,
}) => {
  const [config, setConfig] = useState<SuspensionAlignmentConfig>(
    SuspensionAlignmentBay.STREET_OEM_PRESET
  );

  const evalResult = SuspensionAlignmentBay.evaluateHandling(baseWeightKg, baseLateralG, config);

  const handleApply = () => {
    const cost = 250; // $250 alignment service charge
    if (playerCredits >= cost) {
      onApplyAlignment(cost, config);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                4-Wheel Laser Alignment & Chassis Setup
              </h2>
              <p className="text-xs text-slate-400">{vehicleName} • Geometry Calibration Bay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Handling Readout Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                Max Lateral G
              </span>
              <div className="text-3xl font-black text-white mt-1 font-mono">
                {evalResult.maxLateralG} <span className="text-sm font-normal text-slate-400">G</span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                Turn-In Response
              </span>
              <div className="text-3xl font-black text-white mt-1 font-mono">
                {evalResult.turnInResponsiveness}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                High-Speed Stability
              </span>
              <div className="text-3xl font-black text-white mt-1 font-mono">
                {evalResult.highSpeedStability}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Handling Balance
              </span>
              <div className="text-lg font-black text-amber-400 mt-2 font-mono">
                {evalResult.handlingBalance.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Presets Row */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Presets:</span>
            <button
              onClick={() => setConfig(SuspensionAlignmentBay.STREET_OEM_PRESET)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              Street OEM
            </button>
            <button
              onClick={() => setConfig(SuspensionAlignmentBay.TRACK_ATTACK_PRESET)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/40"
            >
              Track Attack
            </button>
            <button
              onClick={() => setConfig(SuspensionAlignmentBay.PRO_DRIFT_PRESET)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border border-amber-500/40"
            >
              Pro Drift
            </button>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front Axle */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Front Axle Geometry
              </h3>

              {/* Front Camber */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Front Camber</span>
                  <span className="text-purple-400 font-mono">{config.frontCamberDeg.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min={-5.0}
                  max={0.5}
                  step={0.1}
                  value={config.frontCamberDeg}
                  onChange={(e) => setConfig({ ...config, frontCamberDeg: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Front Caster */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Front Caster</span>
                  <span className="text-blue-400 font-mono">+{config.frontCasterDeg.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min={3.0}
                  max={9.5}
                  step={0.1}
                  value={config.frontCasterDeg}
                  onChange={(e) => setConfig({ ...config, frontCasterDeg: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Front Toe */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Front Toe</span>
                  <span className="text-emerald-400 font-mono">{config.frontToeMm.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min={-3.0}
                  max={3.0}
                  step={0.2}
                  value={config.frontToeMm}
                  onChange={(e) => setConfig({ ...config, frontToeMm: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Front Ride Height */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Front Ride Height Offset</span>
                  <span className="text-amber-400 font-mono">{config.rideHeightFrontMm} mm</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={40}
                  step={5}
                  value={config.rideHeightFrontMm}
                  onChange={(e) => setConfig({ ...config, rideHeightFrontMm: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Rear Axle */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Rear Axle Geometry
              </h3>

              {/* Rear Camber */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Rear Camber</span>
                  <span className="text-purple-400 font-mono">{config.rearCamberDeg.toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min={-4.0}
                  max={0.5}
                  step={0.1}
                  value={config.rearCamberDeg}
                  onChange={(e) => setConfig({ ...config, rearCamberDeg: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Rear Toe */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Rear Toe</span>
                  <span className="text-emerald-400 font-mono">+{config.rearToeMm.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min={-1.0}
                  max={4.0}
                  step={0.2}
                  value={config.rearToeMm}
                  onChange={(e) => setConfig({ ...config, rearToeMm: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Rear Ride Height */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Rear Ride Height Offset</span>
                  <span className="text-amber-400 font-mono">{config.rideHeightRearMm} mm</span>
                </div>
                <input
                  type="range"
                  min={-50}
                  max={40}
                  step={5}
                  value={config.rideHeightRearMm}
                  onChange={(e) => setConfig({ ...config, rideHeightRearMm: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/80 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-slate-400">Alignment Calibration Fee: </span>
            <span className="font-mono font-black text-amber-400 text-lg">$250</span>
          </div>

          <button
            onClick={handleApply}
            disabled={playerCredits < 250}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            Lock In Laser Alignment
          </button>
        </div>
      </div>
    </div>
  );
};
