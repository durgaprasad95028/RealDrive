/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - LIVE MOTORSPORT TELEMETRY HUD
 * ============================================================================
 * High-performance driving telemetry overlay rendering:
 * - 2D Friction Circle G-G Diagram (Lateral vs Longitudinal G-force)
 * - 4-Wheel Contact Patch Thermal & Pressure Heatmap (FL, FR, RL, RR)
 * - Throttle / Brake / Steering Pedals Live Input Traces
 * - Sector Split Delta Comparison vs Optimal Session Best
 * - DRS / Aero / ESC Active State Indicators
 */

import React from 'react';

export interface LiveTelemetryHudProps {
  readonly speedKph: number;
  readonly engineRpm: number;
  readonly gear: number;
  readonly throttlePercent: number; // 0 to 1
  readonly brakePercent: number;    // 0 to 1
  readonly steeringAngleDeg: number;
  readonly lateralG: number;
  readonly longitudinalG: number;
  readonly tireTempsC: [number, number, number, number]; // [FL, FR, RL, RR]
  readonly tirePressuresBar: [number, number, number, number];
  readonly drsActive?: boolean;
  readonly tcsActive?: boolean;
  readonly escActive?: boolean;
  readonly absActive?: boolean;
  readonly currentLapTimeMs?: number;
  readonly deltaToBestMs?: number;
}

export const LiveTelemetryTelemetryHud: React.FC<LiveTelemetryHudProps> = ({
  speedKph,
  engineRpm,
  gear,
  throttlePercent,
  brakePercent,
  steeringAngleDeg,
  lateralG,
  longitudinalG,
  tireTempsC,
  tirePressuresBar,
  drsActive = false,
  tcsActive = false,
  escActive = false,
  absActive = false,
  currentLapTimeMs = 0,
  deltaToBestMs = -120
}) => {
  // Format lap time: mm:ss.ms
  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const getTireColor = (tempC: number) => {
    if (tempC < 75) return '#3b82f6'; // Cold blue
    if (tempC <= 105) return '#22c55e'; // Optimal green
    if (tempC <= 125) return '#eab308'; // Overheating yellow/orange
    return '#ef4444'; // Overheated red
  };

  // Friction circle G-G coordinates (-2G to +2G range mapped to 100x100 box)
  const clampG = (g: number) => Math.max(-2.0, Math.min(2.0, g));
  const ggX = 50 + (clampG(lateralG) / 2.0) * 42;
  const ggY = 50 - (clampG(longitudinalG) / 2.0) * 42;

  const tireLabels = ['FL', 'FR', 'RL', 'RR'];

  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 380,
      backgroundColor: 'rgba(10, 15, 25, 0.88)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: 16,
      padding: 16,
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      userSelect: 'none',
      zIndex: 100
    }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: '#94a3b8' }}>Live Telemetry 120Hz</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {drsActive && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, backgroundColor: '#06b6d4', color: '#000' }}>DRS</span>}
          {absActive && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, backgroundColor: '#eab308', color: '#000' }}>ABS</span>}
          {tcsActive && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, backgroundColor: '#f97316', color: '#000' }}>TCS</span>}
          {escActive && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, backgroundColor: '#ef4444', color: '#fff' }}>ESC</span>}
        </div>
      </div>

      {/* Speed & Gear Large Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, letterSpacing: -1, color: '#f8fafc' }}>
            {Math.round(speedKph)} <span style={{ fontSize: 14, fontWeight: 600, color: '#64748b' }}>KM/H</span>
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            {Math.round(engineRpm)} <span style={{ fontSize: 11, color: '#64748b' }}>RPM</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: '#38bdf8' }}>
            {gear === 0 ? 'N' : (gear < 0 ? 'R' : gear)}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>GEAR</div>
        </div>
      </div>

      {/* Main Grid: G-G Diagram + Tire Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* Friction Circle (G-G) */}
        <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 8, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 4, textAlign: 'center' }}>G-FORCE VECTOR</div>
          <div style={{ width: 100, height: 100, margin: '0 auto', position: 'relative', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.2)' }}>
            {/* Center crosshairs */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            {/* Live G-dot */}
            <div style={{
              position: 'absolute',
              top: `${ggY}%`,
              left: `${ggX}%`,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 10px #38bdf8',
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.05s ease-out'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
            <span>Lat: {lateralG.toFixed(2)}G</span>
            <span>Lon: {longitudinalG.toFixed(2)}G</span>
          </div>
        </div>

        {/* 4 Tires Temperature & Pressure */}
        <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 6, textAlign: 'center' }}>TIRE THERMALS & PSI</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {tireLabels.map((lbl, idx) => (
              <div key={lbl} style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderLeft: `3px solid ${getTireColor(tireTempsC[idx])}`,
                borderRadius: 4,
                padding: '4px 6px'
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#64748b' }}>{lbl}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: getTireColor(tireTempsC[idx]) }}>{Math.round(tireTempsC[idx])}°C</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{tirePressuresBar[idx].toFixed(2)} bar</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pedals & Steering Input Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {/* Throttle Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, width: 28, color: '#22c55e' }}>THR</span>
          <div style={{ flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round(throttlePercent * 100)}%`, height: '100%', backgroundColor: '#22c55e', transition: 'width 0.05s linear' }} />
          </div>
          <span style={{ fontSize: 10, width: 32, textAlign: 'right', color: '#cbd5e1' }}>{Math.round(throttlePercent * 100)}%</span>
        </div>

        {/* Brake Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, width: 28, color: '#ef4444' }}>BRK</span>
          <div style={{ flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round(brakePercent * 100)}%`, height: '100%', backgroundColor: '#ef4444', transition: 'width 0.05s linear' }} />
          </div>
          <span style={{ fontSize: 10, width: 32, textAlign: 'right', color: '#cbd5e1' }}>{Math.round(brakePercent * 100)}%</span>
        </div>
      </div>

      {/* Lap Timer & Delta Split */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: '8px 12px' }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b' }}>LAP TIME</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', fontFamily: 'monospace' }}>{formatTime(currentLapTimeMs)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#64748b' }}>DELTA</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: deltaToBestMs <= 0 ? '#22c55e' : '#ef4444', fontFamily: 'monospace' }}>
            {deltaToBestMs <= 0 ? `-${Math.abs(deltaToBestMs / 1000).toFixed(3)}s` : `+${(deltaToBestMs / 1000).toFixed(3)}s`}
          </div>
        </div>
      </div>
    </div>
  );
};
