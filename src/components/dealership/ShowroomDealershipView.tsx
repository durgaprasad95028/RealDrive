/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - LUXURY DEALERSHIP SHOWROOM & FINANCING
 * ============================================================================
 * 3D showroom vehicle selector with bespoke paint colors, performance trims,
 * and monthly financing loan calculators.
 */

import React, { useState } from 'react';
import { useDealershipInventory, ShowroomCarItem } from '../../hooks/useDealershipInventory';

export const ShowroomDealershipView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { vehicles, selectedCar, setSelectedCar, selectedTrim, setSelectedTrim, selectedColor, setSelectedColor, financingQuote, calculateLoan } = useDealershipInventory();
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  const colors = [
    { name: 'Pure Snow White', hex: '#FFFFFF' },
    { name: 'Stealth Matte Grey', hex: '#4B5563' },
    { name: 'Rosso Corsa Racing Red', hex: '#DC2626' },
    { name: 'Bayside Midnight Blue', hex: '#1D4ED8' },
    { name: 'Liquid Forged Carbon', hex: '#111827' }
  ];

  const trims = [
    { id: 'trim_base', name: 'Standard Edition', extraUSD: 0, desc: 'Factory Competition Spec with standard ESC' },
    { id: 'trim_track_pack', name: 'Track Carbon Pack', extraUSD: 18500, desc: 'Carbon ceramic brakes + titanium exhaust' },
    { id: 'trim_corsa', name: 'Corsa Unlimited', extraUSD: 38000, desc: 'Active DRS wing + magnesium center-lock wheels' }
  ];

  const activeCarPrice = selectedCar ? selectedCar.baseMSRPUSD + (trims.find(t => t.id === selectedTrim)?.extraUSD || 0) : 0;

  const handleUpdateFinance = (pct: number) => {
    setDownPaymentPercent(pct);
    const downUSD = activeCarPrice * (pct / 100);
    calculateLoan(activeCarPrice, downUSD, 48);
  };

  const handleBuyNow = () => {
    if (!selectedCar) return;
    setPurchaseSuccessMessage(`Congratulations! You have purchased the ${selectedCar.name}! It is now delivered to your Garage.`);
    setTimeout(() => setPurchaseSuccessMessage(null), 5000);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: 1040,
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
            <span style={{ backgroundColor: '#38bdf8', color: '#000', fontSize: 11, fontWeight: 900, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>DEALERSHIP</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Flagship Exotic Showroom</h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#94a3b8' }}>Bespoke Specification Configurator & Auto Financing</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>✕</button>
        )}
      </div>

      {purchaseSuccessMessage && (
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#22c55e', padding: '12px 18px', borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 700 }}>
          {purchaseSuccessMessage}
        </div>
      )}

      {/* Main Grid: Car Model Showcase Left, Configurator Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        {/* Left: Car Carousel & Specs */}
        <div>
          <div style={{ height: 260, backgroundColor: '#020617', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              width: 140,
              height: 70,
              borderRadius: '50%',
              backgroundColor: selectedColor,
              boxShadow: `0 0 45px ${selectedColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: selectedColor === '#FFFFFF' ? '#000' : '#fff',
              fontSize: 12,
              fontWeight: 800
            }}>
              3D PREVIEW
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8' }}>{selectedCar?.brand}</span>
                <div style={{ fontSize: 20, fontWeight: 900 }}>{selectedCar?.name}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#22c55e' }}>
                ${activeCarPrice.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick Specs 4-Box Grid */}
          {selectedCar && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px 8px', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>POWER</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>{selectedCar.horsepowerHp} HP</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px 8px', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>TORQUE</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#3b82f6' }}>{selectedCar.torqueNm} Nm</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px 8px', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>0-100</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>{selectedCar.zeroTo100Sec}s</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '10px 8px', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>TOP SPEED</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>{selectedCar.topSpeedKph} km/h</div>
              </div>
            </div>
          )}

          {/* Vehicle Switcher Pills */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {vehicles.map(v => (
              <button
                key={v.vehicleId}
                onClick={() => setSelectedCar(v)}
                style={{
                  backgroundColor: selectedCar?.vehicleId === v.vehicleId ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                  color: selectedCar?.vehicleId === v.vehicleId ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Trims, Color Picker & Loan Calc */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Paint Colors */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>EXTERIOR BESPOKE FINISH</label>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              {colors.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setSelectedColor(c.hex)}
                  title={c.name}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: selectedColor === c.hex ? '3px solid #38bdf8' : '2px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    boxShadow: selectedColor === c.hex ? `0 0 12px ${c.hex}` : 'none'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Performance Trims */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>PACKAGE TRIM LEVEL</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {trims.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTrim(t.id)}
                  style={{
                    backgroundColor: selectedTrim === t.id ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.03)',
                    border: selectedTrim === t.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.desc}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#22c55e' }}>
                    {t.extraUSD === 0 ? 'INCLUDED' : `+$${t.extraUSD.toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto Financing Calculator */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>48-MONTH FINANCING (5.9% APR)</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8' }}>
                ${financingQuote ? financingQuote.monthlyPaymentUSD.toLocaleString() : Math.round(activeCarPrice * 0.021).toLocaleString()}/mo
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {[10, 20, 30, 50].map(pct => (
                <button
                  key={pct}
                  onClick={() => handleUpdateFinance(pct)}
                  style={{
                    flex: 1,
                    backgroundColor: downPaymentPercent === pct ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                    color: downPaymentPercent === pct ? '#000' : '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 0',
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {pct}% DOWN
                </button>
              ))}
            </div>
          </div>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            style={{
              backgroundColor: '#22c55e',
              color: '#000',
              border: 'none',
              borderRadius: 10,
              padding: '14px 0',
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: 0.5,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
              marginTop: 'auto'
            }}
          >
            ORDER & DELIVER TO GARAGE
          </button>
        </div>
      </div>
    </div>
  );
};
