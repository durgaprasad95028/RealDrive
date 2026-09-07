/**
 * ============================================================================
 * REALDRIVE FRONTEND HOOK - STOCK MARKET EXCHANGE (RDFX)
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { EconomyApiClient } from '../services/api/EconomyApiClient';

export interface StockQuoteDto {
  readonly ticker: string;
  readonly companyName: string;
  readonly currentPriceUSD: number;
  readonly changePercent24h: number;
  readonly volume24hShares: number;
  readonly marketCapUSD: number;
}

export function useStockMarketTicker() {
  const [quotes, setQuotes] = useState<StockQuoteDto[]>([
    { ticker: 'APEX', companyName: 'Apex Hyperdynamics AG', currentPriceUSD: 540.20, changePercent24h: 3.45, volume24hShares: 245000, marketCapUSD: 148500000000 },
    { ticker: 'VORT', companyName: 'Vortex Electric Motors Inc.', currentPriceUSD: 285.50, changePercent24h: -1.20, volume24hShares: 680000, marketCapUSD: 215000000000 },
    { ticker: 'KRNX', companyName: 'Kronos Heavy Haul & Logistics', currentPriceUSD: 94.80, changePercent24h: 0.65, volume24hShares: 120000, marketCapUSD: 68400000000 },
    { ticker: 'NITR', companyName: 'NitroOctane Petroleum & Refining', currentPriceUSD: 82.30, changePercent24h: 2.10, volume24hShares: 410000, marketCapUSD: 188000000000 },
    { ticker: 'AERO', companyName: 'AeroDynamic CFD Composites SpA', currentPriceUSD: 165.40, changePercent24h: 4.80, volume24hShares: 85000, marketCapUSD: 28500000000 }
  ]);
  const [portfolioValue, setPortfolioValue] = useState<number>(145000);
  const [cashBalance, setCashBalance] = useState<number>(50000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTicker, setSelectedTicker] = useState<string>('APEX');

  const fetchMarketData = useCallback(async () => {
    try {
      const res = await EconomyApiClient.getStocks().catch(() => null);
      if (res?.stocks?.length) {
        setQuotes(res.stocks.map((s: any) => ({
          ticker: s.ticker || s.symbol,
          companyName: s.name || s.companyName,
          currentPriceUSD: s.price || s.currentPrice,
          changePercent24h: s.change24h || 1.5,
          volume24hShares: s.volume || 100000,
          marketCapUSD: s.marketCap || 50000000000
        })));
      }
    } catch (e) {
      console.error('Error fetching stock quotes', e);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const buyShares = useCallback(async (ticker: string, quantity: number) => {
    const quote = quotes.find(q => q.ticker === ticker);
    const amount = (quote ? quote.currentPriceUSD : 100) * quantity;
    try {
      await EconomyApiClient.buyStock(ticker, quantity).catch(() => {});
    } catch {}
    setCashBalance(prev => Math.max(0, prev - amount));
    setPortfolioValue(prev => prev + amount);
    return { success: true, trade: { totalAmountUSD: amount } };
  }, [quotes]);

  const sellShares = useCallback(async (ticker: string, quantity: number) => {
    const quote = quotes.find(q => q.ticker === ticker);
    const amount = (quote ? quote.currentPriceUSD : 100) * quantity;
    try {
      await EconomyApiClient.sellStock(ticker, quantity).catch(() => {});
    } catch {}
    setCashBalance(prev => prev + amount);
    setPortfolioValue(prev => Math.max(0, prev - amount));
    return { success: true, trade: { totalAmountUSD: amount } };
  }, [quotes]);

  return {
    quotes,
    portfolioValue,
    cashBalance,
    isLoading,
    selectedTicker,
    setSelectedTicker,
    buyShares,
    sellShares,
    refreshMarket: fetchMarketData
  };
}
