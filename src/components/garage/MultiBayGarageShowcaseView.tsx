/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - MULTI-BAY GARAGE SHOWCASE & FLEET MANAGER
 * ============================================================================
 * 10-Bay Private Collector Garage:
 * - Vehicle fleet roster with live maintenance status & odometers
 * - 3D inspection turntable & quick navigation to Dyno / Livery Studio
 * - Vehicle insurance, registration, and secondary marketplace auction listing
 */

import React, { useState } from 'react';

export interface GarageBayVehicle {
  readonly bayNumber: number;
  readonly vehicleId: string;
  readonly make: string;
  readonly model: string;
  readonly year: number;
  readonly horsepowerHp: number;
  readonly torqueNm: number;
  readonly mileageKm: number;
  readonly conditionHealthPercent: number;
  readonly colorHex: string;
  readonly isInsured: boolean;
  readonly estimatedMarketValueUSD: number;
}

export interface MultiBayGarageShowcaseViewProps {
  readonly onSelectVehicleForDrive?: (vehicleId: string) => void;
  readonly onOpenDynoStudio?: (vehicleId: string) => void;
  readonly onOpenLiveryStudio?: (vehicleId: string) => void;
  readonly onClose?: () => void;
}

export const MultiBayGarageShowcaseView: React.FC<MultiBayGarageShowcaseViewProps> = ({
  onSelectVehicleForDrive,
  onOpenDynoStudio,
  onOpenLiveryStudio,
  onClose
}) => {
  const [activeBay, setActiveBay] = useState<number>(1);
  const [vehicles] = useState<GarageBayVehicle[]>([
    { bayNumber: 1, vehicleId: 'veh_apex_lmh', make: 'Apex Hyperdynamics', model: 'LMH Le Mans Stradale', year: 2026, horsepowerHp: 1100, torqueNm: 1250, mileageKm: 3420, conditionHealthPercent: 98, colorHex: '#DC2626', isInsured: true, estimatedMarketValueUSD: 2450000 },
    { bayNumber: 2, vehicleId: 'veh_veloce_gt3', make: 'Veloce Corse', model: 'GT3 Competition Spec', year: 2025, horsepowerHp: 650, torqueNm: 720, mileageKm: 8150, conditionHealthPercent: 94, colorHex: '#38BDF8', isInsured: true, estimatedMarketValueUSD: 485000 },
    { bayNumber: 3, vehicleId: 'veh_skyline_r34', make: 'Nissan', model: 'Skyline GT-R V-Spec II (R34)', year: 2001, horsepowerHp: 480, torqueNm: 560, mileageKm: 34500, conditionHealthPercent: 96, colorHex: '#1D4ED8', isInsured: true, estimatedMarketValueUSD: 285000 },
    { bayNumber: 4, vehicleId: 'veh_charger_426', make: 'Dodge', model: 'Charger R/T 426 HEMI', year: 1968, horsepowerHp: 425, torqueNm: 664, mileageKm: 88500, conditionHealthPercent: 82, colorHex: '#111827', isInsured: false, estimatedMarketValueUSD: 95000 }
  ]);

  const activeVehicle = vehicles.find(v => v.bayNumber === activeBay) || vehicles[0];

  return (
    <div style={{
      width: '100%',
      maxWidth: 1080,
      backgroundColor: '#0a0f1d',
      borderRadius: 20,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: 24,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ backgroundColor: '#eab308', color: '#000', fontSize: 11, fontWeight: 900, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>GARAGE</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Executive Multi-Bay Fleet Vault</h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#94a3b8' }}>Total Fleet Valuation: <strong style={{ color: '#22c55e' }}>$3,315,000 USD</strong> • 4 / 10 Bays Occupied</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>✕</button>
        )}
      </div>

      {/* Main Grid: Bay Turntable Left, Vehicle Inspection Detail Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* Left: 3D Bay Showcase Stage */}
        <div>
          <div style={{
            height: 280,
            backgroundColor: '#020617',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Turntable Base Platform */}
            <div style={{
              width: 240,
              height: 120,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '2px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 0 35px rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: 150,
                height: 75,
                borderRadius: '50%',
                backgroundColor: activeVehicle.colorHex,
                boxShadow: `0 0 45px ${activeVehicle.colorHex}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 900,
                color: activeVehicle.colorHex === '#FFFFFF' ? '#000' : '#fff'
              }}>
                BAY #{activeVehicle.bayNumber}
              </div>
            </div>

            <div style={{ position: 'absolute', top: 16, left: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#eab308' }}>BAY #{activeVehicle.bayNumber}</span>
              <h3 style={{ fontSize: 18, fontWeight: 900, margin: '2px 0 0 0' }}>{activeVehicle.year} {activeVehicle.make} {activeVehicle.model}</h3>
            </div>
          </div>

          {/* Bay Selector Tabs (Bays 1-10) */}
          <div style={{ display: 'flex', gap: 6, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(bayNum => {
              const hasCar = vehicles.some(v => v.bayNumber === bayNum);
              const isSelected = activeBay === bayNum;
              return (
                <button
                  key={bayNum}
                  onClick={() => setActiveBay(bayNum)}
                  style={{
                    backgroundColor: isSelected ? '#eab308' : (hasCar ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'),
                    color: isSelected ? '#000' : (hasCar ? '#f8fafc' : '#64748b'),
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  BAY {bayNum} {hasCar ? '🚗' : '🔒'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Technical Stats & Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Vehicle Stats Grid */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Condition Health</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#22c55e' }}>{activeVehicle.conditionHealthPercent}% Pristine</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Odometer Mileage</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{activeVehicle.mileageKm.toLocaleString()} km</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Power / Torque</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>{activeVehicle.horsepowerHp} HP / {activeVehicle.torqueNm} Nm</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Appraised Valuation</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8' }}>${activeVehicle.estimatedMarketValueUSD.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Launch Buttons */}
          <button
            onClick={() => onSelectVehicleForDrive?.(activeVehicle.vehicleId)}
            style={{
              backgroundColor: '#22c55e',
              color: '#000',
              border: 'none',
              borderRadius: 10,
              padding: '12px 0',
              fontSize: 14,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)'
            }}
          >
            START DRIVING VEHICLE
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              onClick={() => onOpenDynoStudio?.(activeVehicle.vehicleId)}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                borderRadius: 8,
                padding: '10px 0',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              DYNO BENCH LAB
            </button>
            <button
              onClick={() => onOpenLiveryStudio?.(activeVehicle.vehicleId)}
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid #a855f7',
                color: '#a855f7',
                borderRadius: 8,
                padding: '10px 0',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              LIVERY STUDIO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
