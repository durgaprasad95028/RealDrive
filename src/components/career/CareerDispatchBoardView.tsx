/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - CAREER LOGISTICS & DISPATCH BOARD
 * ============================================================================
 * Interactive job dispatch board for Rideshare VIP fares, urgent courier sprints,
 * and heavy intermodal freight logistics contracts.
 */

import React, { useState } from 'react';
import { useCareerDispatch } from '../../hooks/useCareerDispatch';

export const CareerDispatchBoardView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { rideshareFares, freightContracts, activeContractId, acceptJob, completeJob } = useCareerDispatch();
  const [jobCategory, setJobCategory] = useState<'rideshare' | 'freight'>('rideshare');
  const [completionResult, setCompletionResult] = useState<string | null>(null);

  const handleSimulateDelivery = async (id: string) => {
    const res = await completeJob(id, 15, 0);
    if (res.success) {
      setCompletionResult(`Job completed! Earned $${res.payout.totalPayoutUSD.toLocaleString()} (${res.payout.summaryMessage})`);
      setTimeout(() => setCompletionResult(null), 5000);
    }
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
            <span style={{ backgroundColor: '#f59e0b', color: '#000', fontSize: 11, fontWeight: 900, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>CAREER HUB</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Metropolitan Dispatch Board</h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#94a3b8' }}>Urban Rideshare Fares & Commercial Logistics Transport Contracts</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>✕</button>
        )}
      </div>

      {completionResult && (
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#22c55e', padding: '12px 18px', borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 700 }}>
          {completionResult}
        </div>
      )}

      {/* Category Toggle Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <button
          onClick={() => setJobCategory('rideshare')}
          style={{
            backgroundColor: jobCategory === 'rideshare' ? '#f59e0b' : 'rgba(255,255,255,0.05)',
            color: jobCategory === 'rideshare' ? '#000' : '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          🚕 Urban Rideshare & VIP Fares ({rideshareFares.length})
        </button>
        <button
          onClick={() => setJobCategory('freight')}
          style={{
            backgroundColor: jobCategory === 'freight' ? '#f59e0b' : 'rgba(255,255,255,0.05)',
            color: jobCategory === 'freight' ? '#000' : '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          🚛 Heavy Logistics & Freight Manifests ({freightContracts.length})
        </button>
      </div>

      {/* Job Listings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
        {jobCategory === 'rideshare' && rideshareFares.map(fare => {
          const isCurrentActive = activeContractId === fare.fareId;
          return (
            <div
              key={fare.fareId}
              style={{
                backgroundColor: isCurrentActive ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.03)',
                border: isCurrentActive ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>{fare.personality.replace('_', ' ')}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#22c55e' }}>${Math.round(fare.baseFareUSD * fare.surgePricingMultiplier)}</span>
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 800, margin: '6px 0 2px 0' }}>{fare.passengerName}</h4>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>⭐ {fare.passengerRating} Rating • {fare.estimatedDistanceKm} km</div>

                <div style={{ margin: '12px 0', fontSize: 12, color: '#cbd5e1', backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 6, fontStyle: 'italic' }}>
                  "{fare.passengerDialogueOnPickup}"
                </div>

                <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>📍 <strong>Pickup:</strong> {fare.pickupLocationName}</div>
                  <div>🏁 <strong>Destination:</strong> {fare.destinationLocationName}</div>
                  <div>⏱️ <strong>Time Window:</strong> {Math.round(fare.timeLimitSeconds / 60)} minutes</div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                {isCurrentActive ? (
                  <button
                    onClick={() => handleSimulateDelivery(fare.fareId)}
                    style={{
                      width: '100%',
                      backgroundColor: '#22c55e',
                      color: '#000',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 0',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    COMPLETE FARE & COLLECT PAY
                  </button>
                ) : (
                  <button
                    onClick={() => acceptJob(fare.fareId)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 0',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ACCEPT DISPATCH
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {jobCategory === 'freight' && freightContracts.map(haul => {
          const isCurrentActive = activeContractId === haul.contractId;
          const totalPay = haul.basePayUSD + haul.fuelSurchargeUSD + haul.onTimeBonusUSD;
          return (
            <div
              key={haul.contractId}
              style={{
                backgroundColor: isCurrentActive ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.03)',
                border: isCurrentActive ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>{haul.cargoClassification.replace(/_/g, ' ')}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#22c55e' }}>${totalPay.toLocaleString()}</span>
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 800, margin: '6px 0 2px 0' }}>{haul.shipperCompanyName}</h4>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>{haul.cargoDescription}</div>

                <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10 }}>
                  <div>⚖️ <strong>Mass:</strong> {(haul.cargoMassKg / 1000).toFixed(1)} Tons</div>
                  <div>📍 <strong>Origin:</strong> {haul.originHub}</div>
                  <div>🏁 <strong>Destination:</strong> {haul.destinationHub}</div>
                  <div>🛣️ <strong>Distance:</strong> {haul.routeDistanceKm} km ({haul.timeWindowMinutes} min)</div>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                {isCurrentActive ? (
                  <button
                    onClick={() => handleSimulateDelivery(haul.contractId)}
                    style={{
                      width: '100%',
                      backgroundColor: '#22c55e',
                      color: '#000',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 0',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    DELIVER CARGO & PASS AUDIT
                  </button>
                ) : (
                  <button
                    onClick={() => acceptJob(haul.contractId)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 0',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ACCEPT FREIGHT HAUL
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
