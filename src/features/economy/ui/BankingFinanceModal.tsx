import React, { useState } from 'react';
import {
  FinancialBankingEngine,
  StockMarketTicker,
  AutoFinancingLoan,
} from '../banking/FinancialBankingEngine';
import { Landmark, TrendingUp, Shield, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, X, Check } from 'lucide-react';

interface BankingFinanceModalProps {
  playerCredits: number;
  creditScore: number;
  onUpdateCredits: (amountDelta: number) => void;
  onClose: () => void;
}

export const BankingFinanceModal: React.FC<BankingFinanceModalProps> = ({
  playerCredits,
  creditScore,
  onUpdateCredits,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'ACCOUNTS' | 'STOCKS' | 'LOANS' | 'INSURANCE'>('ACCOUNTS');
  const [tickers, setTickers] = useState<StockMarketTicker[]>([
    ...FinancialBankingEngine.MARKET_TICKERS,
  ]);
  const [savingsDeposit, setSavingsDeposit] = useState<number>(0);

  const handleTickStock = () => {
    FinancialBankingEngine.tickStockMarket();
    setTickers([...FinancialBankingEngine.MARKET_TICKERS]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Apex National Bank & Securities Exchange
              </h2>
              <p className="text-xs text-slate-400">
                Checking & Savings • Automotive Equities • Financing • Insurance
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

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2">
          {(['ACCOUNTS', 'STOCKS', 'LOANS', 'INSURANCE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all border-t border-x ${
                activeTab === tab
                  ? 'bg-slate-900 text-emerald-400 border-slate-700 border-b-0'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'ACCOUNTS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Checking Account */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Primary Checking Account
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">Active / Instant Liquidity</span>
                </div>
                <div className="text-4xl font-black text-white font-mono">
                  ${playerCredits.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400">
                  Direct debit card access for fuel, parts, vehicle purchases, and tournament entry fees.
                </p>
              </div>

              {/* Credit Score Rating */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    FICO Credit Bureau Score
                  </span>
                  <span className="text-xs text-blue-400 font-bold">Excellent Rating</span>
                </div>
                <div className="text-4xl font-black text-blue-400 font-mono">
                  {creditScore} <span className="text-sm font-normal text-slate-500">/ 850</span>
                </div>
                <p className="text-xs text-slate-400">
                  Qualifies for 3.9% Prime APR financing on supercars, semi-trucks, and real estate mortgages.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'STOCKS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Automotive Equities & Commodities
                </span>
                <button
                  onClick={handleTickStock}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Simulate Market Tick
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tickers.map((t) => (
                  <div
                    key={t.symbol}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-base text-white font-mono">{t.symbol}</h4>
                        <span className="text-xs text-slate-400">{t.companyName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-white font-mono">
                          ${t.currentPrice.toFixed(2)}
                        </div>
                        <span
                          className={`text-xs font-bold font-mono flex items-center justify-end gap-0.5 ${
                            t.priceChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {t.priceChangePercent >= 0 ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                          {t.priceChangePercent >= 0 ? '+' : ''}
                          {t.priceChangePercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'LOANS' && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4 text-center">
              <h3 className="text-base font-bold text-white">Auto Financing & Commercial Capital</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Apply for vehicle financing directly at any dealership or used car marketplace. Your credit score of {creditScore} unlocks 36 to 60-month loan terms with low down payments.
              </p>
            </div>
          )}

          {activeTab === 'INSURANCE' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <h4 className="font-bold text-sm text-white">Third-Party Liability</h4>
                <div className="text-xl font-black text-white font-mono">$15 / day</div>
                <p className="text-xs text-slate-400">Covers property damage and traffic fines.</p>
              </div>

              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-3">
                <h4 className="font-bold text-sm text-white">Comprehensive Full-Coverage</h4>
                <div className="text-xl font-black text-emerald-400 font-mono">$45 / day</div>
                <p className="text-xs text-slate-400">100% replacement for total loss collisions with $500 deductible.</p>
              </div>

              <div className="rounded-xl border border-purple-500/40 bg-purple-950/20 p-4 space-y-3">
                <h4 className="font-bold text-sm text-white">Track & Touge Racing Rider</h4>
                <div className="text-xl font-black text-purple-400 font-mono">$85 / day</div>
                <p className="text-xs text-slate-400">Full mechanical and bodywork repairs after track days and drift crashes.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
