/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - RACE LEADERBOARD & TIMING TOWER HUD
 * ============================================================================
 * Live broadcast timing tower for circuit races and championships:
 * - Real-time Driver Positions (P1-P20) with delta gaps (+0.350s)
 * - Three-Sector color splits (Purple = Session Record, Green = PB, Yellow = Normal)
 * - Mandatory Pit Stop window status & Rain forecast radar widget
 */

import React from 'react';

export interface LeaderboardDriverEntry {
  readonly position: number;
  readonly driverId: string;
  readonly driverName: string;
  readonly carModel: string;
  readonly teamName: string;
  readonly lastLapFormatted: string;
  readonly bestLapFormatted: string;
  readonly deltaToLeaderFormatted: string;
  readonly intervalFormatted: string;
  readonly sector1Color: 'purple' | 'green' | 'yellow';
  readonly sector2Color: 'purple' | 'green' | 'yellow';
  readonly sector3Color: 'purple' | 'green' | 'yellow';
  readonly pitStopsCompleted: number;
  readonly isInPits: boolean;
  readonly isPlayer: boolean;
}

export interface RaceLeaderboardOverlayProps {
  readonly currentLap: number;
  readonly totalLaps: number;
  readonly circuitName: string;
  readonly isPitWindowOpen: boolean;
  readonly rainProbabilityPercent: number;
  readonly drivers: readonly LeaderboardDriverEntry[];
}

export const RaceLeaderboardOverlayView: React.FC<RaceLeaderboardOverlayProps> = ({
  currentLap = 14,
  totalLaps = 28,
  circuitName = 'Downtown Metropolitan Grand Prix Circuit',
  isPitWindowOpen = true,
  rainProbabilityPercent = 15,
  drivers = [
    { position: 1, driverId: 'drv_1', driverName: 'Klaus Weber', carModel: 'Apex LMH Stradale', teamName: 'Apex Works Racing', lastLapFormatted: '1:18.887', bestLapFormatted: '1:18.887', deltaToLeaderFormatted: 'LEADER', intervalFormatted: '---', sector1Color: 'purple', sector2Color: 'purple', sector3Color: 'purple', pitStopsCompleted: 1, isInPits: false, isPlayer: false },
    { position: 2, driverId: 'drv_player', driverName: 'YOU (Player)', carModel: 'Apex LMH Stradale', teamName: 'Player Motorsport', lastLapFormatted: '1:19.145', bestLapFormatted: '1:19.012', deltaToLeaderFormatted: '+0.258s', intervalFormatted: '+0.258s', sector1Color: 'green', sector2Color: 'purple', sector3Color: 'green', pitStopsCompleted: 1, isInPits: false, isPlayer: true },
    { position: 3, driverId: 'drv_3', driverName: 'Lucas Rossi', carModel: 'Veloce GT3', teamName: 'Scuderia Veloce', lastLapFormatted: '1:19.650', bestLapFormatted: '1:19.420', deltaToLeaderFormatted: '+1.450s', intervalFormatted: '+1.192s', sector1Color: 'green', sector2Color: 'yellow', sector3Color: 'green', pitStopsCompleted: 1, isInPits: false, isPlayer: false },
    { position: 4, driverId: 'drv_4', driverName: 'Takumi Sato', carModel: 'Horizon Spirit', teamName: 'Midnight Sun', lastLapFormatted: '1:20.120', bestLapFormatted: '1:19.880', deltaToLeaderFormatted: '+2.890s', intervalFormatted: '+1.440s', sector1Color: 'yellow', sector2Color: 'green', sector3Color: 'yellow', pitStopsCompleted: 0, isInPits: true, isPlayer: false },
    { position: 5, driverId: 'drv_5', driverName: 'Charlotte Dubois', carModel: 'Mirage GT3', teamName: 'AeroDynamic Mirage', lastLapFormatted: '1:20.450', bestLapFormatted: '1:20.110', deltaToLeaderFormatted: '+4.120s', intervalFormatted: '+1.230s', sector1Color: 'yellow', sector2Color: 'yellow', sector3Color: 'green', pitStopsCompleted: 1, isInPits: false, isPlayer: false }
  ]
}) => {
  const getSectorDotColor = (color: 'purple' | 'green' | 'yellow') => {
    switch (color) {
      case 'purple': return '#c084fc';
      case 'green': return '#22c55e';
      case 'yellow': return '#eab308';
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: 24,
      left: 24,
      width: 380,
      backgroundColor: 'rgba(10, 15, 25, 0.90)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: 16,
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      userSelect: 'none',
      zIndex: 90,
      overflow: 'hidden'
    }}>
      {/* Race Top Banner */}
      <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>{circuitName}</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#f8fafc' }}>LAP {currentLap} / {totalLaps}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {isPitWindowOpen && (
            <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 6px', borderRadius: 4, backgroundColor: '#22c55e', color: '#000' }}>PIT OPEN</span>
          )}
          <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 6px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
            🌧️ {rainProbabilityPercent}%
          </span>
        </div>
      </div>

      {/* Timing Tower Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {drivers.map(drv => {
          return (
            <div
              key={drv.driverId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                backgroundColor: drv.isPlayer ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                borderLeft: drv.isPlayer ? '4px solid #38bdf8' : '4px solid transparent'
              }}
            >
              {/* Pos & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 900, width: 22, color: drv.position === 1 ? '#eab308' : (drv.position === 2 ? '#94a3b8' : (drv.position === 3 ? '#cd7f32' : '#64748b')) }}>
                  P{drv.position}
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: drv.isPlayer ? 800 : 600, color: drv.isPlayer ? '#38bdf8' : '#f8fafc' }}>
                    {drv.driverName} {drv.isInPits && <span style={{ fontSize: 9, backgroundColor: '#f59e0b', color: '#000', padding: '1px 4px', borderRadius: 2, fontWeight: 800 }}>PIT</span>}
                  </div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{drv.carModel}</div>
                </div>
              </div>

              {/* Sectors & Delta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* 3 Sector Color Dots */}
                <div style={{ display: 'flex', gap: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: getSectorDotColor(drv.sector1Color) }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: getSectorDotColor(drv.sector2Color) }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: getSectorDotColor(drv.sector3Color) }} />
                </div>

                {/* Interval Gap */}
                <div style={{ textAlign: 'right', minWidth: 55 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: drv.position === 1 ? '#f8fafc' : '#cbd5e1', fontFamily: 'monospace' }}>
                    {drv.deltaToLeaderFormatted}
                  </div>
                  <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'monospace' }}>{drv.bestLapFormatted}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
