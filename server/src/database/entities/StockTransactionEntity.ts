/**
 * ============================================================================
 * REALDRIVE ENTITY — STOCK PORTFOLIO TRANSACTION ENTITY
 * ============================================================================
 * Equity buy/sell orders, limit orders, average cost basis, dividend payouts,
 * and realized/unrealized profit & loss calculations.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface StockTransactionEntity {
  id: string;
  orderNumber: string;
  userId: string;
  stockAssetId: string;
  ticker: string;
  orderType: 'BUY_MARKET' | 'SELL_MARKET' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'DIVIDEND_REINVEST';
  sharesQuantity: number;
  pricePerShare: number;
  totalGrossAmount: number;
  brokerageCommissionFee: number;
  netSettlementAmount: number;
  executionStatus: 'PENDING' | 'FILLED' | 'CANCELLED' | 'EXPIRED';
  realizedProfitLoss?: number;
  executedAt: string;
}

export const StockTransactionSchema: TableSchema<StockTransactionEntity> = {
  name: 'stock_transactions',
  primaryKey: 'id',
  indexes: ['userId', 'stockAssetId', 'ticker', 'orderType', 'executedAt'],
  uniqueKeys: ['orderNumber'],
  foreignKeys: [
    {
      field: 'userId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'RESTRICT',
    },
    {
      field: 'stockAssetId',
      referencesTable: 'stock_assets',
      referencesField: 'id',
      onDelete: 'RESTRICT',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
