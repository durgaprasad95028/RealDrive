/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - POLICE PURSUIT SCANNER HUD
 * ============================================================================
 * Tactical law enforcement scanner & pursuit radar:
 * - 5-Star Heat Level with strobe emergency lights
 * - Active Interceptor Unit distance & roadblock lookahead warnings
 * - Tactical Spike Strip Proximity Alert
 * - Evasion Cooldown Meter & Dispatch Radio Chatter Log
 */

import React from 'react';

export interface PoliceScannerHudProps {
  readonly heatLevel: number; // 0 to 5
  readonly evasionCooldownPercent: number; // 0 (active pursuit) to 100% (escaped)
  readonly isSpikeStripAhead: boolean;
  readonly distanceToSpikeStripM?: number;
  readonly isRoadblockAhead: boolean;
  readonly activePursuitUnitsCount: number;
  readonly dispatchRadioMessage?: string;
}

export const PoliceScannerHud: React.FC<PoliceScannerHudProps> = ({
  heatLevel,
  evasionCooldownPercent,
  isSpikeStripAhead = false,
  distanceToSpikeStripM = 150,
  isRoadblockAhead = false,
  activePursuitUnitsCount = 3,
  dispatchRadioMessage = 'All units, suspect vehicle is heading southbound towards Coastal Highway. Deploy spike strips at Mile 4.'
}) => {
  if (heatLevel === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 520,
      backgroundColor: 'rgba(10, 15, 25, 0.92)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      borderRadius: 16,
      padding: '12px 18px',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 15px 35px rgba(239, 68, 68, 0.25)',
      userSelect: 'none',
      zIndex: 100
    }}>
      {/* Top Banner: Heat Stars & Pursuit Units */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        {/* Heat Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', letterSpacing: 1 }}>HEAT LEVEL</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                style={{
                  fontSize: 16,
                  color: star <= heatLevel ? '#ef4444' : '#334155',
                  filter: star <= heatLevel ? 'drop-shadow(0 0 6px #ef4444)' : 'none'
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Units In Pursuit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc' }}>
            {activePursuitUnitsCount} INTERCEPTORS ACTIVE
          </span>
        </div>
      </div>

      {/* Warning Alerts (Spike Strip / Roadblock) */}
      {(isSpikeStripAhead || isRoadblockAhead) && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.25)',
          border: '1px solid #ef4444',
          borderRadius: 8,
          padding: '6px 12px',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          fontWeight: 800,
          color: '#fca5a5'
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span>
            {isSpikeStripAhead ? `SPIKE STRIP DETECTED ${distanceToSpikeStripM}M AHEAD! EVADE NOW!` : 'ROADBLOCK AHEAD! PREPARE TO RAM OR DETOUR!'}
          </span>
        </div>
      )}

      {/* Dispatch Radio Voice Box */}
      <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#38bdf8', fontWeight: 800, fontStyle: 'normal' }}>📻 DISPATCH:</span>
        <span>"{dispatchRadioMessage}"</span>
      </div>

      {/* Evasion Cooldown Meter */}
      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 3 }}>
          <span>EVASION ESCAPE PROGRESS</span>
          <span style={{ color: evasionCooldownPercent >= 100 ? '#22c55e' : '#38bdf8' }}>{Math.round(evasionCooldownPercent)}%</span>
        </div>
        <div style={{ width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            width: `${Math.round(evasionCooldownPercent)}%`,
            height: '100%',
            backgroundColor: evasionCooldownPercent >= 100 ? '#22c55e' : '#38bdf8',
            transition: 'width 0.2s ease-out'
          }} />
        </div>
      </div>
    </div>
  );
};
