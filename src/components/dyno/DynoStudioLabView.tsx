/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - DYNO STUDIO & ECU TUNING LAB
 * ============================================================================
 * Interactive engine dynamometer bench with live RPM pull sweep, SVG curve
 * graphing (Horsepower & Torque vs RPM), boost target sliders, and ECU maps.
 */

import React, { useState } from 'react';
import { useDynoLab } from '../../hooks/useDynoLab';

export interface DynoStudioLabViewProps {
  readonly currentVehicleName?: string;
  readonly baseHorsepower?: number;
  readonly baseTorque?: number;
  readonly onClose?: () => void;
}

export const DynoStudioLabView: React.FC<DynoStudioLabViewProps> = ({
  currentVehicleName = 'Apex LMH Le Mans Stradale',
  baseHorsepower = 850,
  baseTorque = 920,
  onClose
}) => {
  const { dynoResult, isRunning, ecuSettings, updateEcuParameter, runDynoTest } = useDynoLab();
  const [activeTab, setActiveTab] = useState<'power_graph' | 'boost_afr' | 'bmep_table'>('power_graph');

  const handleStartPull = () => {
    runDynoTest('current_active_vehicle');
  };

  // SVG dimensions
  const svgWidth = 620;
  const svgHeight = 280;
  const padLeft = 50;
  const padRight = 30;
  const padTop = 20;
  const padBottom = 40;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const maxRpm = dynoResult?.redlineRpm || 8500;
  const maxHpTorque = Math.max(1200, (dynoResult?.peakHorsepowerBhp || baseHorsepower) * 1.25);

  const getX = (rpm: number) => padLeft + ((rpm - 1000) / (maxRpm - 1000)) * chartW;
  const getY = (val: number) => padTop + chartH - (val / maxHpTorque) * chartH;

  // Build SVG Path points for HP & Torque
  let hpPath = '';
  let torquePath = '';
  let boostPath = '';

  if (dynoResult && dynoResult.plotData.length > 0) {
    hpPath = dynoResult.plotData.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.rpm)} ${getY(pt.flywheelHorsepowerBhp)}`).join(' ');
    torquePath = dynoResult.plotData.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.rpm)} ${getY(pt.flywheelTorqueNm)}`).join(' ');
    boostPath = dynoResult.plotData.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(pt.rpm)} ${padTop + chartH - (pt.turboBoostPsi / 35.0) * chartH}`).join(' ');
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: 960,
      backgroundColor: '#0f172a',
      borderRadius: 20,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: 24,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 900, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>DYNO LAB</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Rotary All-Wheel Dynamometer</h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#94a3b8' }}>Target: <strong style={{ color: '#f8fafc' }}>{currentVehicleName}</strong> (Baseline: {baseHorsepower} HP / {baseTorque} Nm)</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>✕</button>
        )}
      </div>

      {/* Main Grid: Graph Left, ECU Controls Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left: Interactive SVG Graph */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: 16 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => setActiveTab('power_graph')}
              style={{
                backgroundColor: activeTab === 'power_graph' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Power & Torque
            </button>
            <button
              onClick={() => setActiveTab('boost_afr')}
              style={{
                backgroundColor: activeTab === 'boost_afr' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Boost & AFR Map
            </button>
          </div>

          {/* SVG Canvas */}
          <div style={{ width: '100%', height: svgHeight, backgroundColor: '#020617', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
            {isRunning && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <div style={{ width: 48, height: 48, border: '4px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>RUNNING 4TH GEAR PULL...</span>
              </div>
            )}

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%' }}>
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((pct, idx) => {
                const y = padTop + chartH * pct;
                const val = Math.round(maxHpTorque * (1.0 - pct));
                return (
                  <g key={idx}>
                    <line x1={padLeft} y1={y} x2={svgWidth - padRight} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                    <text x={padLeft - 8} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">{val}</text>
                  </g>
                );
              })}

              {/* RPM X Axis Labels */}
              {[2000, 4000, 6000, 8000].map(rpm => {
                const x = getX(rpm);
                return (
                  <g key={rpm}>
                    <line x1={x} y1={padTop} x2={x} y2={padTop + chartH} stroke="rgba(255,255,255,0.06)" />
                    <text x={x} y={svgHeight - 12} fill="#64748b" fontSize="10" textAnchor="middle">{rpm} RPM</text>
                  </g>
                );
              })}

              {/* Plotted Curves */}
              {hpPath && activeTab === 'power_graph' && (
                <>
                  <path d={hpPath} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                  <path d={torquePath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 3" />
                </>
              )}

              {boostPath && activeTab === 'boost_afr' && (
                <path d={boostPath} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
              )}
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, backgroundColor: '#ef4444' }} />
              <span>Flywheel BHP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, backgroundColor: '#3b82f6' }} />
              <span>Torque (Nm)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, backgroundColor: '#06b6d4' }} />
              <span>Boost (PSI)</span>
            </div>
          </div>
        </div>

        {/* Right: ECU Controls & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Peak Stats Card */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>PEAK POWER OUTPUT</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
              <div>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#ef4444' }}>{dynoResult?.peakHorsepowerBhp || baseHorsepower}</span>
                <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 4 }}>BHP</span>
              </div>
              <div>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#3b82f6' }}>{dynoResult?.peakTorqueNm || baseTorque}</span>
                <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 4 }}>Nm</span>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
              Est 1/4 Mile: <strong style={{ color: '#22c55e' }}>{dynoResult?.estimatedQuarterMileSec || '9.82'}s</strong> @ {dynoResult?.peakBoostPsi || 18} PSI
            </div>
          </div>

          {/* Slider: Turbo Boost Target */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              <span>Turbo Boost Pressure</span>
              <span style={{ color: '#06b6d4' }}>{ecuSettings.boostTargetPsi.toFixed(1)} PSI</span>
            </div>
            <input
              type="range"
              min="8.0"
              max="35.0"
              step="0.5"
              value={ecuSettings.boostTargetPsi}
              onChange={e => updateEcuParameter('boostTargetPsi', parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#06b6d4' }}
            />
          </div>

          {/* Slider: Target AFR */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              <span>Target Air-Fuel Ratio (AFR)</span>
              <span style={{ color: '#f59e0b' }}>{ecuSettings.targetAirFuelRatio.toFixed(1)}:1</span>
            </div>
            <input
              type="range"
              min="10.5"
              max="14.7"
              step="0.1"
              value={ecuSettings.targetAirFuelRatio}
              onChange={e => updateEcuParameter('targetAirFuelRatio', parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b' }}
            />
          </div>

          {/* Slider: Ignition Advance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              <span>Ignition Timing Advance</span>
              <span style={{ color: '#8b5cf6' }}>{ecuSettings.ignitionAdvanceDeg.toFixed(1)}° BTDC</span>
            </div>
            <input
              type="range"
              min="12.0"
              max="34.0"
              step="0.5"
              value={ecuSettings.ignitionAdvanceDeg}
              onChange={e => updateEcuParameter('ignitionAdvanceDeg', parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#8b5cf6' }}
            />
          </div>

          {/* Execute Dyno Run Button */}
          <button
            onClick={handleStartPull}
            disabled={isRunning}
            style={{
              backgroundColor: isRunning ? '#64748b' : '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 0.5,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)',
              transition: 'all 0.2s ease',
              marginTop: 'auto'
            }}
          >
            {isRunning ? 'CALIBRATING DYNO PULL...' : 'RUN DYNO BENCH TEST'}
          </button>
        </div>
      </div>
    </div>
  );
};
