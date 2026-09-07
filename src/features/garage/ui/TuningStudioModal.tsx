import React, { useState } from 'react';
import {
  EngineTuningStudio,
  EngineTuneConfiguration,
  TunedPerformanceMetrics,
  ECUStage,
  TurbochargerUpgrade,
  CamshaftProfile,
  ForgedInternalsLevel,
  ExhaustSystemType,
  FuelSystemType,
  NitrousSystemType,
} from '../tuning/EngineTuningStudio';
import { Cpu, Zap, Flame, Wind, Wrench, ShieldCheck, Check, X, ArrowUpRight } from 'lucide-react';

interface TuningStudioModalProps {
  vehicleName: string;
  baseHp: number;
  baseTorque: number;
  baseRedline: number;
  baseWeightKg: number;
  isNaturallyAspirated: boolean;
  playerCredits: number;
  onApplyTune: (cost: number, metrics: TunedPerformanceMetrics) => void;
  onClose: () => void;
}

export const TuningStudioModal: React.FC<TuningStudioModalProps> = ({
  vehicleName,
  baseHp,
  baseTorque,
  baseRedline,
  baseWeightKg,
  isNaturallyAspirated,
  playerCredits,
  onApplyTune,
  onClose,
}) => {
  const [tuneConfig, setTuneConfig] = useState<EngineTuneConfiguration>({
    ecuStage: 'STAGE_1_FLASH',
    ignitionTimingAdvanceDeg: 2,
    targetAirFuelRatio: 12.2,
    revLimiterRpm: baseRedline + 300,
    launchControlRpm: 4200,
    antiLagEnabled: false,
    turbocharger: 'STOCK_OEM',
    targetBoostPsi: 14.5,
    wastegateCrackingPsi: 10.0,
    camshaft: 'STOCK_OEM',
    internals: 'STOCK_CAST',
    exhaust: 'CAT_BACK_STAINLESS',
    fuelSystem: 'STOCK_OEM',
    nitrous: 'NONE',
  });

  const metrics = EngineTuningStudio.calculateTunedMetrics(
    baseHp,
    baseTorque,
    baseRedline,
    baseWeightKg,
    isNaturallyAspirated,
    tuneConfig
  );

  const handleApply = () => {
    if (playerCredits >= metrics.tuningCostCredits) {
      onApplyTune(metrics.tuningCostCredits, metrics);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Engine ECU Calibration & Performance Studio
              </h2>
              <p className="text-xs text-slate-400">{vehicleName} • Powertrain Workshop</p>
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
          {/* Performance Gain Readout Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Tuned Horsepower</span>
              <div className="text-3xl font-black text-white mt-1 font-mono flex items-baseline gap-2">
                {metrics.tunedHp} <span className="text-sm font-normal text-slate-400">HP</span>
                <span className="text-xs font-bold text-emerald-400">+{metrics.hpGain} HP</span>
              </div>
            </div>

            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Tuned Torque</span>
              <div className="text-3xl font-black text-white mt-1 font-mono flex items-baseline gap-2">
                {metrics.tunedTorqueNm} <span className="text-sm font-normal text-slate-400">Nm</span>
                <span className="text-xs font-bold text-emerald-400">+{metrics.torqueGainNm} Nm</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Curb Weight</span>
              <div className="text-3xl font-black text-white mt-1 font-mono flex items-baseline gap-2">
                {metrics.tunedWeightKg} <span className="text-sm font-normal text-slate-400">kg</span>
                {metrics.weightDeltaKg !== 0 && (
                  <span className="text-xs font-bold text-amber-400">{metrics.weightDeltaKg} kg</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reliability Rating</span>
              <div className="text-3xl font-black text-white mt-1 font-mono flex items-baseline gap-2">
                {metrics.overallReliabilityScore}%
                <span className="text-xs text-slate-500 font-normal">Score</span>
              </div>
            </div>
          </div>

          {/* Module Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: ECU & Forced Induction */}
            <div className="space-y-4">
              {/* ECU Stage */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  ECU Map Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['STOCK', 'STAGE_1_FLASH', 'STAGE_2_PRO', 'STAGE_3_CUSTOM', 'STANDALONE_RACE'] as ECUStage[]).map(
                    (stg) => (
                      <button
                        key={stg}
                        onClick={() => setTuneConfig({ ...tuneConfig, ecuStage: stg })}
                        className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                          tuneConfig.ecuStage === stg
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {stg.replace(/_/g, ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Turbocharger Upgrades */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  Forced Induction Compressor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'STOCK_OEM',
                      'BALL_BEARING_QUICK_SPOOL',
                      'BILLET_WHEEL_HYBRID',
                      'LARGE_FRAME_SINGLE',
                      'TWIN_SCROLL_TWIN_TURBO',
                      'COMPOUND_SEQUENTIAL',
                    ] as TurbochargerUpgrade[]
                  ).map((turbo) => (
                    <button
                      key={turbo}
                      onClick={() => setTuneConfig({ ...tuneConfig, turbocharger: turbo })}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                        tuneConfig.turbocharger === turbo
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {turbo.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ignition Timing Slider */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">IGNITION TIMING ADVANCE</span>
                  <span className="text-blue-400 font-mono">+{tuneConfig.ignitionTimingAdvanceDeg}° DEG</span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={8}
                  step={1}
                  value={tuneConfig.ignitionTimingAdvanceDeg}
                  onChange={(e) =>
                    setTuneConfig({ ...tuneConfig, ignitionTimingAdvanceDeg: parseInt(e.target.value) })
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* Right Column: Internals, Camshafts, Nitrous */}
            <div className="space-y-4">
              {/* Forged Internals */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Engine Block & Forged Internals
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'STOCK_CAST',
                      'FORGED_RODS_PISTONS',
                      'BILLET_CRANK_SLEEVED_BLOCK',
                      'FULL_TITANIUM_RACE_BUILD',
                    ] as ForgedInternalsLevel[]
                  ).map((internals) => (
                    <button
                      key={internals}
                      onClick={() => setTuneConfig({ ...tuneConfig, internals })}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                        tuneConfig.internals === internals
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {internals.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exhaust System */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Exhaust & Manifold Headers
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'STOCK_OEM',
                      'CAT_BACK_STAINLESS',
                      'HIGH_FLOW_CAT_TITANIUM',
                      'STRAIGHT_PIPE_RACE_HEADER',
                      'VALVED_TITANIUM_ACTIVE',
                    ] as ExhaustSystemType[]
                  ).map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setTuneConfig({ ...tuneConfig, exhaust: ex })}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                        tuneConfig.exhaust === ex
                          ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/30'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {ex.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nitrous Oxide System */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Nitrous Oxide Wet Injection
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    ['NONE', 'WET_SHOT_50HP', 'WET_SHOT_100HP', 'DIRECT_PORT_200HP'] as NitrousSystemType[]
                  ).map((nos) => (
                    <button
                      key={nos}
                      onClick={() => setTuneConfig({ ...tuneConfig, nitrous: nos })}
                      className={`px-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                        tuneConfig.nitrous === nos
                          ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {nos.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/80 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-slate-400">Total Upgrade Cost: </span>
            <span className="font-mono font-black text-amber-400 text-lg">
              ${metrics.tuningCostCredits.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 ml-2">
              (Balance: ${playerCredits.toLocaleString()})
            </span>
          </div>

          <button
            onClick={handleApply}
            disabled={playerCredits < metrics.tuningCostCredits}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg transition-all ${
              playerCredits >= metrics.tuningCostCredits
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            Flash ECU & Install Upgrades
          </button>
        </div>
      </div>
    </div>
  );
};
