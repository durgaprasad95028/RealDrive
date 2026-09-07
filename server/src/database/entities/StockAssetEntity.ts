/**
 * ============================================================================
 * REALDRIVE ENTITY — STOCK MARKET ASSET TICKER ENTITY
 * ============================================================================
 * RealDrive Financial Stock Exchange (RDFX) listed automotive manufacturers,
 * tuning conglomerates, fuel cartels, and freight logistics corporations.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface StockPriceCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockAssetEntity {
  id: string;
  ticker: string; // e.g. "APEX", "TURBO", "HYPR", "LOGX", "PETRO"
  companyName: string;
  sector: 'AUTOMOTIVE_OEM' | 'AFTERMARKET_PERFORMANCE' | 'LOGISTICS_FREIGHT' | 'ENERGY_PETROLEUM' | 'AI_AUTONOMOUS_TECH';
  currentPrice: number;
  previousClosePrice: number;
  openingPriceToday: number;
  dayHighPrice: number;
  dayLowPrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  volumeToday: number;
  marketCap: number;
  peRatio: number;
  dividendYieldPct: number;
  volatilityIndex: number; // 0.05 to 0.60
  momentumFactor: number;
  priceHistoryJson: string; // Serialized StockPriceCandle[]
  newsHeadline?: string;
  isHalted: boolean;
  updatedAt: string;
}

export const StockAssetSchema: TableSchema<StockAssetEntity> = {
  name: 'stock_assets',
  primaryKey: 'id',
  indexes: ['sector', 'currentPrice', 'marketCap'],
  uniqueKeys: ['ticker'],
  timestamps: true,
  softDeletes: false,
};
