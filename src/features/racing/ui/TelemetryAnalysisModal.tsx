import React, { useState } from 'react';
import {
  LapTelemetryRecord,
  TelemetryFrame,
} from '../telemetry/GhostReplayTelemetryEngine';
import { LineChart, Activity, Gauge, Disc, X, Play, RotateCcw } from 'lucide-react';

interface TelemetryAnalysisModalProps {
  lapRecord?: LapTelemetryRecord | null;
  onClose: () => void;
}

export const TelemetryAnalysisModal: React.FC<TelemetryAnalysisModalProps> = ({
  lapRecord,
  onClose,
}) => {
  const dummyRecord: LapTelemetryRecord = lapRecord || {
    id: 'lap_demo_1',
    driverName: 'Player (You)',
    vehicleName: 'AeroStrike 300 Ghost',
    trackName: 'Apex Grand Metropolis Circuit',
    lapTimeSeconds: 84.325,
    sector1TimeSec: 26.85,
    sector2TimeSec: 29.41,
    sector3TimeSec: 28.065,
    topSpeedKmh: 312.4,
    averageSpeedKmh: 204.8,
    maxLateralG: 1.48,
    dateRecorded: Date.now(),
    frames: Array.from({ length: 60 }, (_, i) => ({
      timestampMs: i * 1400,
      position: { x: i * 10, y: 0, z: i * 8 },
      rotationY: 0,
      speedKmh: 120 + Math.sin(i * 0.2) * 80,
      throttle: Math.max(0, Math.sin(i * 0.3)),
      brake: Math.max(0, -Math.sin(i * 0.3)),
      steeringAngle: Math.sin(i * 0.25) * 0.3,
      lateralG: Math.sin(i * 0.25) * 1.3,
      longitudinalG: Math.cos(i * 0.3) * 0.8,
      gear: 'D4',
      rpm: 4500 + Math.sin(i * 0.2) * 3500,
    })),
  };

  const record = dummyRecord;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                MoTeC-Style Telemetry & Delta Graph Analyzer
              </h2>
              <p className="text-xs text-slate-400">
                {record.vehicleName} • {record.trackName} • Lap Time: {record.lapTimeSeconds}s
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Sector Splits Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                Total Lap Time
              </span>
              <div className="text-2xl font-black text-white mt-1 font-mono">
                {record.lapTimeSeconds}s
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Sector 1
              </span>
              <div className="text-2xl font-black text-purple-400 mt-1 font-mono">
                {record.sector1TimeSec}s
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Sector 2
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                {record.sector2TimeSec}s
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Sector 3
              </span>
              <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
                {record.sector3TimeSec}s
              </div>
            </div>
          </div>

          {/* Speed & Throttle/Brake Overlay Graph */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">VELOCITY & PEDAL TELEMETRY TRACES</span>
              <div className="flex items-center gap-4">
                <span className="text-cyan-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Speed (km/h)
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Throttle %
                </span>
                <span className="text-red-400 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Brake %
                </span>
              </div>
            </div>

            {/* SVG Graph */}
            <div className="w-full h-56 bg-slate-900/60 rounded-lg border border-slate-800 relative flex items-end p-2 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Horizontal Grid */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#334155" strokeDasharray="4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeDasharray="4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#334155" strokeDasharray="4" />

                {/* Speed Trace */}
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  points={record.frames
                    .map((f, i) => {
                      const x = (i / (record.frames.length - 1)) * 500;
                      const y = 200 - (f.speedKmh / (record.topSpeedKmh * 1.1)) * 180;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Throttle Trace */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="3"
                  points={record.frames
                    .map((f, i) => {
                      const x = (i / (record.frames.length - 1)) * 500;
                      const y = 200 - f.throttle * 90;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                {/* Brake Trace */}
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  points={record.frames
                    .map((f, i) => {
                      const x = (i / (record.frames.length - 1)) * 500;
                      const y = 200 - f.brake * 90;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Top Speed: {record.topSpeedKmh} km/h • Avg: {record.averageSpeedKmh} km/h</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
