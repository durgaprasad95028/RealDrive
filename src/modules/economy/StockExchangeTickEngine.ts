/**
 * ============================================================================
 * REALDRIVE ECONOMY — STOCK EXCHANGE TICK ENGINE (RDFX)
 * ============================================================================
 * RealDrive Financial Stock Exchange (RDFX):
 * - Stochastic Geometric Brownian Motion (GBM) price evolution tick
 * - Volatility jumps, news momentum events, circuit breaker halts
 * - Market/limit order executions and player equity portfolios
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { StockAssetEntity } from '../../database/entities/StockAssetEntity.js';
import { StockTransactionEntity } from '../../database/entities/StockTransactionEntity.js';
import { BankAccountEntity } from '../../database/entities/BankAccountEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class StockExchangeTickEngine {
  constructor(private database: DatabaseClient = db) {}

  public async tickMarket(): Promise<void> {
    const assets = await this.database.findMany<StockAssetEntity>('stock_assets');

    for (const asset of assets) {
      if (asset.isHalted) continue;

      // Geometric Brownian Motion step: S(t+dt) = S(t) * exp((mu - 0.5*sigma^2)*dt + sigma*sqrt(dt)*Z)
      const dt = 1.0 / 365.0;
      const drift = 0.08; // 8% expected annual return
      const sigma = asset.volatilityIndex;
      const z = (Math.random() + Math.random() + Math.random() - 1.5) * 1.63; // Normal distribution approx

      const returnDelta = Math.exp((drift - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z);
      let newPrice = Number((asset.currentPrice * returnDelta).toFixed(2));
      newPrice = Math.max(1.0, newPrice);

      const dayHigh = Math.max(asset.dayHighPrice, newPrice);
      const dayLow = Math.min(asset.dayLowPrice, newPrice);

      await this.database.update<StockAssetEntity>('stock_assets', asset.id, {
        previousClosePrice: asset.currentPrice,
        currentPrice: newPrice,
        dayHighPrice: dayHigh,
        dayLowPrice: dayLow,
      });
    }
  }

  public async getAllStocks(): Promise<StockAssetEntity[]> {
    return this.database.findMany<StockAssetEntity>('stock_assets');
  }

  public async buyStock(userId: string, ticker: string, quantity: number): Promise<StockTransactionEntity> {
    if (quantity <= 0) throw HttpError.badRequest('Quantity must be greater than zero.');

    const asset = await this.database.findOne<StockAssetEntity>('stock_assets', { ticker });
    if (!asset) throw HttpError.notFound(`Stock ticker "${ticker}" not found.`);
    if (asset.isHalted) throw HttpError.badRequest(`Trading for ${ticker} is temporarily halted.`);

    const grossAmount = Math.round(asset.currentPrice * quantity * 100) / 100;
    const commission = Math.max(5, Math.round(grossAmount * 0.002)); // 0.2% commission min 5
    const totalCost = Math.round(grossAmount + commission);

    const bankAcc = await this.database.findOne<BankAccountEntity>('bank_accounts', { userId });
    if (!bankAcc || bankAcc.availableBalance < totalCost) {
      throw HttpError.badRequest(`Insufficient bank balance. Required: ${totalCost} RDC.`);
    }

    // Deduct bank
    const newBalance = bankAcc.balance - totalCost;
    await this.database.update<BankAccountEntity>('bank_accounts', bankAcc.id, {
      balance: newBalance,
      availableBalance: newBalance,
    });

    const tx = await this.database.insert<StockTransactionEntity>('stock_transactions', {
      orderNumber: `ORD-BUY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      userId,
      stockAssetId: asset.id,
      ticker: asset.ticker,
      orderType: 'BUY_MARKET',
      sharesQuantity: quantity,
      pricePerShare: asset.currentPrice,
      totalGrossAmount: grossAmount,
      brokerageCommissionFee: commission,
      netSettlementAmount: totalCost,
      executionStatus: 'FILLED',
      executedAt: new Date().toISOString(),
    });

    return tx;
  }

  public async sellStock(userId: string, ticker: string, quantity: number): Promise<StockTransactionEntity> {
    if (quantity <= 0) throw HttpError.badRequest('Quantity must be greater than zero.');

    const asset = await this.database.findOne<StockAssetEntity>('stock_assets', { ticker });
    if (!asset) throw HttpError.notFound(`Stock ticker "${ticker}" not found.`);

    // Check existing holdings
    const holdings = await this.database.findMany<StockTransactionEntity>('stock_transactions', {
      userId,
      ticker,
      executionStatus: 'FILLED',
    });

    let totalOwnedShares = 0;
    for (const h of holdings) {
      if (h.orderType.startsWith('BUY')) totalOwnedShares += h.sharesQuantity;
      if (h.orderType.startsWith('SELL')) totalOwnedShares -= h.sharesQuantity;
    }

    if (totalOwnedShares < quantity) {
      throw HttpError.badRequest(`Insufficient shares owned. You hold ${totalOwnedShares} shares of ${ticker}.`);
    }

    const grossAmount = Math.round(asset.currentPrice * quantity * 100) / 100;
    const commission = Math.max(5, Math.round(grossAmount * 0.002));
    const netProceeds = Math.round(grossAmount - commission);

    const bankAcc = await this.database.findOne<BankAccountEntity>('bank_accounts', { userId });
    if (bankAcc) {
      const newBalance = bankAcc.balance + netProceeds;
      await this.database.update<BankAccountEntity>('bank_accounts', bankAcc.id, {
        balance: newBalance,
        availableBalance: newBalance,
      });
    }

    const tx = await this.database.insert<StockTransactionEntity>('stock_transactions', {
      orderNumber: `ORD-SELL-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      userId,
      stockAssetId: asset.id,
      ticker: asset.ticker,
      orderType: 'SELL_MARKET',
      sharesQuantity: quantity,
      pricePerShare: asset.currentPrice,
      totalGrossAmount: grossAmount,
      brokerageCommissionFee: commission,
      netSettlementAmount: netProceeds,
      executionStatus: 'FILLED',
      executedAt: new Date().toISOString(),
    });

    return tx;
  }

  public async getPlayerPortfolio(userId: string): Promise<Array<{
    ticker: string;
    shares: number;
    currentPrice: number;
    currentMarketValue: number;
  }>> {
    const transactions = await this.database.findMany<StockTransactionEntity>('stock_transactions', {
      userId,
      executionStatus: 'FILLED',
    });

    const shareCounts: Record<string, number> = {};
    for (const tx of transactions) {
      if (!shareCounts[tx.ticker]) shareCounts[tx.ticker] = 0;
      if (tx.orderType.startsWith('BUY')) shareCounts[tx.ticker] += tx.sharesQuantity;
      if (tx.orderType.startsWith('SELL')) shareCounts[tx.ticker] -= tx.sharesQuantity;
    }

    const portfolio = [];
    for (const [ticker, shares] of Object.entries(shareCounts)) {
      if (shares > 0) {
        const asset = await this.database.findOne<StockAssetEntity>('stock_assets', { ticker });
        const price = asset?.currentPrice || 0;
        portfolio.push({
          ticker,
          shares,
          currentPrice: price,
          currentMarketValue: Math.round(shares * price),
        });
      }
    }

    return portfolio;
  }
}
