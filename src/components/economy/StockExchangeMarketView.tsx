/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - REALDRIVE FINANCIAL EXCHANGE (RDFX) MARKET
 * ============================================================================
 * Live stock trading terminal:
 * - Real-time equity tickers (APEX, VORT, KRNX, NITR, AERO, etc.)
 * - Interactive Price Chart & Market Depth Order Book
 * - Instant BUY / SELL Trade Execution & Portfolio Valuation
 */

import React, { useState } from 'react';
import { useStockMarketTicker } from '../../hooks/useStockMarketTicker';

export const StockExchangeMarketView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { quotes, cashBalance, portfolioValue, selectedTicker, setSelectedTicker, buyShares, sellShares } = useStockMarketTicker();
  const [tradeQuantity, setTradeQuantity] = useState<number>(10);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  const activeQuote = quotes.find(q => q.ticker === selectedTicker) || quotes[0];
  const totalCost = activeQuote ? Math.round(activeQuote.currentPriceUSD * tradeQuantity) : 0;

  const handleBuy = async () => {
    if (!activeQuote) return;
    const res = await buyShares(activeQuote.ticker, tradeQuantity);
    if (res.success) {
      setTradeMessage(`Bought ${tradeQuantity} shares of ${activeQuote.ticker} for $${totalCost.toLocaleString()}`);
      setTimeout(() => setTradeMessage(null), 4000);
    }
  };

  const handleSell = async () => {
    if (!activeQuote) return;
    const res = await sellShares(activeQuote.ticker, tradeQuantity);
    if (res.success) {
      setTradeMessage(`Sold ${tradeQuantity} shares of ${activeQuote.ticker} for $${totalCost.toLocaleString()}`);
      setTimeout(() => setTradeMessage(null), 4000);
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
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ backgroundColor: '#10b981', color: '#000', fontSize: 11, fontWeight: 900, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>RDFX LIVE</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>RealDrive Financial Exchange</h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#94a3b8' }}>Live Automated Market Maker with Geometric Brownian Motion & Order Execution</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>CASH BALANCE</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>${cashBalance.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>PORTFOLIO VALUE</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#38bdf8' }}>${portfolioValue.toLocaleString()}</div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer', marginLeft: 12 }}>✕</button>
          )}
        </div>
      </div>

      {tradeMessage && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 600 }}>
          {tradeMessage}
        </div>
      )}

      {/* Main Grid: Stocks Table Left, Order Execution Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Left: Tickers Table */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: 11, fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '10px 14px' }}>TICKER</th>
                <th style={{ padding: '10px 14px' }}>COMPANY</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>PRICE</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>24H CHANGE</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => {
                const isSelected = q.ticker === selectedTicker;
                const isPos = q.changePercent24h >= 0;
                return (
                  <tr
                    key={q.ticker}
                    onClick={() => setSelectedTicker(q.ticker)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#f8fafc' }}>{q.ticker}</td>
                    <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{q.companyName}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#f8fafc' }}>
                      ${q.currentPriceUSD.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: isPos ? '#10b981' : '#ef4444' }}>
                      {isPos ? '+' : ''}{q.changePercent24h.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right: Selected Equity Detail & Order Panel */}
        {activeQuote && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: 18, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8' }}>{activeQuote.ticker}</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '2px 0 0 0' }}>{activeQuote.companyName}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>${activeQuote.currentPriceUSD.toFixed(2)}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: activeQuote.changePercent24h >= 0 ? '#10b981' : '#ef4444' }}>
                  {activeQuote.changePercent24h >= 0 ? '+' : ''}{activeQuote.changePercent24h.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Price Chart Preview Line */}
            <div style={{ height: 90, backgroundColor: '#020617', borderRadius: 8, padding: 8, marginBottom: 16, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
              {[35, 42, 38, 55, 62, 58, 70, 75, 68, 85, 92, 88].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: '#38bdf8', opacity: 0.7, borderRadius: 2 }} />
              ))}
            </div>

            {/* Trade Order Inputs */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>ORDER QUANTITY (SHARES)</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {[5, 10, 25, 50, 100].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setTradeQuantity(qty)}
                      style={{
                        flex: 1,
                        backgroundColor: tradeQuantity === qty ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                        color: tradeQuantity === qty ? '#000' : '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 0',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Total Transaction Value</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>${totalCost.toLocaleString()}</span>
              </div>

              {/* BUY / SELL Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  onClick={handleBuy}
                  disabled={cashBalance < totalCost}
                  style={{
                    backgroundColor: cashBalance < totalCost ? '#334155' : '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 0',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: cashBalance < totalCost ? 'not-allowed' : 'pointer',
                    boxShadow: cashBalance >= totalCost ? '0 6px 16px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                >
                  BUY SHARES
                </button>
                <button
                  onClick={handleSell}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 0',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 6px 16px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  SELL SHARES
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
