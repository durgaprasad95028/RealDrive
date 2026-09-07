import React, { useState, useEffect, useRef } from 'react';
import {
  DynoTestingBench,
  DynoPullResult,
  DynoDataPoint,
  DynoAtmosphericConditions,
} from '../tuning/DynoTestingBench';
import { Activity, Gauge, Flame, Wind, Play, RotateCcw, X, ShieldAlert, Cpu } from 'lucide-react';

interface DynoWorkshopModalProps {
  vehicleName: string;
  vehicleId: string;
  baseHp: number;
  baseTorque: number;
  redlineRpm: number;
  drivetrain: 'FWD' | 'RWD' | 'AWD' | '4WD';
  isTurbocharged: boolean;
  onClose: () => void;
}

export const DynoWorkshopModal: React.FC<DynoWorkshopModalProps> = ({
  vehicleName,
  vehicleId,
  baseHp,
  baseTorque,
  redlineRpm,
  drivetrain,
  isTurbocharged,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(1000);
  const [liveData, setLiveData] = useState<DynoDataPoint | null>(null);
  const [pullResult, setPullResult] = useState<DynoPullResult | null>(null);
  const [conditions, setConditions] = useState<DynoAtmosphericConditions>({
    ambientTempCelsius: 22,
    barometricPressureKPa: 101.3,
    relativeHumidityPercent: 45,
  });

  const animRef = useRef<number | null>(null);

  const startDynoRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setPullResult(null);

    const result = DynoTestingBench.executeDynoPull(
      vehicleId,
      vehicleName,
      baseHp,
      Math.round(baseHp * 0.85),
      baseTorque,
      Math.round(baseTorque * 0.65),
      redlineRpm,
      800,
      drivetrain,
      isTurbocharged,
      16.5,
      conditions
    );

    let step = 0;
    const totalSteps = result.curveData.length;

    const interval = setInterval(() => {
      if (step < totalSteps) {
        const point = result.curveData[step];
        setCurrentRpm(point.rpm);
        setLiveData(point);
        step++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setPullResult(result);
      }
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Chassis Dynamometer Diagnostic Bay
              </h2>
              <p className="text-xs text-slate-400">
                {vehicleName} • {drivetrain} Hub Dyno • SAE J1349 Standard
              </p>
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
          {/* Live Dyno Roller Gauges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Wheel Horsepower
              </span>
              <div className="text-3xl font-black text-amber-400 mt-1 font-mono">
                {liveData ? liveData.wheelHorsepower : '---'}
                <span className="text-sm font-normal text-slate-500 ml-1">WHP</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Wheel Torque
              </span>
              <div className="text-3xl font-black text-blue-400 mt-1 font-mono">
                {liveData ? liveData.wheelTorqueNm : '---'}
                <span className="text-sm font-normal text-slate-500 ml-1">Nm</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Manifold Boost
              </span>
              <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">
                {liveData ? liveData.boostPressurePsi : '0.0'}
                <span className="text-sm font-normal text-slate-500 ml-1">PSI</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Air-Fuel Ratio (AFR)
              </span>
              <div className="text-3xl font-black text-purple-400 mt-1 font-mono">
                {liveData ? liveData.airFuelRatio : '14.7'}
                <span className="text-sm font-normal text-slate-500 ml-1">λ</span>
              </div>
            </div>
          </div>

          {/* RPM Tachometer Sweep Bar */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
              <span>ENGINE TACHOMETER</span>
              <span className="text-amber-400 text-sm">{currentRpm} RPM</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-75 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                style={{ width: `${Math.min(100, (currentRpm / redlineRpm) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 RPM</span>
              <span>{Math.round(redlineRpm * 0.5)} RPM</span>
              <span className="text-red-400 font-bold">{redlineRpm} RPM REDLINE</span>
            </div>
          </div>

          {/* Dyno Graph Visualization */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Activity className="w-4 h-4 text-amber-400" />
                POWER & TORQUE DYNO CURVE PLOT
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Wheel HP
                </span>
                <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Wheel Torque (Nm)
                </span>
              </div>
            </div>

            {/* SVG Dyno Plot Canvas */}
            <div className="w-full h-56 bg-slate-900/60 rounded-lg border border-slate-800/80 relative flex items-end p-2 overflow-hidden">
              {pullResult && (
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#334155" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeDasharray="4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#334155" strokeDasharray="4" />

                  {/* HP Polyline */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    points={pullResult.curveData
                      .map((pt, idx) => {
                        const x = (idx / (pullResult.curveData.length - 1)) * 500;
                        const y = 200 - (pt.wheelHorsepower / (pullResult.peakWheelHorsepower * 1.15)) * 180;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Torque Polyline */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    points={pullResult.curveData
                      .map((pt, idx) => {
                        const x = (idx / (pullResult.curveData.length - 1)) * 500;
                        const y = 200 - (pt.wheelTorqueNm / (pullResult.peakWheelTorqueNm * 1.15)) * 180;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              )}

              {!pullResult && !isRunning && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm font-medium">
                  Click "START 4TH-GEAR DYNO PULL" below to simulate roller test run.
                </div>
              )}
            </div>
          </div>

          {/* Test Summary & SAE Certificate */}
          {pullResult && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-xs text-amber-300 uppercase font-semibold">Peak Power</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  {pullResult.peakWheelHorsepower} WHP
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  @ {pullResult.peakWheelHorsepowerRpm} RPM
                </span>
              </div>

              <div>
                <span className="text-xs text-amber-300 uppercase font-semibold">Peak Torque</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  {pullResult.peakWheelTorqueNm} Nm
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  @ {pullResult.peakWheelTorqueRpm} RPM
                </span>
              </div>

              <div>
                <span className="text-xs text-amber-300 uppercase font-semibold">SAE CF Factor</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  {pullResult.saeCorrectionFactor}
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {pullResult.durationSeconds}s Pull Time
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-400" />
              Temp: {conditions.ambientTempCelsius}°C
            </span>
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-blue-400" />
              Baro: {conditions.barometricPressureKPa} kPa
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startDynoRun}
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg transition-all ${
                isRunning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              {isRunning ? 'Dyno Pull in Progress...' : 'Start 4th-Gear Dyno Pull'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
