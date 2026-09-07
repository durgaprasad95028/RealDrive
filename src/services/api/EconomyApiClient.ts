/**
 * ============================================================================
 * REALDRIVE CLIENT API — ECONOMY, BANKING & STOCKS CLIENT
 * ============================================================================
 */

import { api } from './ApiClient';

export class EconomyApiClient {
  public static async getBankAccount(): Promise<any> {
    return api.get('/economy/bank');
  }

  public static async transferFunds(recipientAccountNumber: string, amount: number, memo?: string): Promise<any> {
    return api.post('/economy/bank/transfer', { recipientAccountNumber, amount, memo });
  }

  public static async depositCash(amount: number): Promise<any> {
    return api.post('/economy/bank/deposit', { amount });
  }

  public static async withdrawCash(amount: number): Promise<any> {
    return api.post('/economy/bank/withdraw', { amount });
  }

  public static async getTransactions(): Promise<{ transactions: any[]; count: number }> {
    return api.get('/economy/bank/transactions');
  }

  public static async getStocks(): Promise<{ stocks: any[]; count: number }> {
    return api.get('/economy/stocks');
  }

  public static async getStockPortfolio(): Promise<{ portfolio: any[] }> {
    return api.get('/economy/stocks/portfolio');
  }

  public static async buyStock(ticker: string, quantity: number): Promise<any> {
    return api.post('/economy/stocks/buy', { ticker, quantity });
  }

  public static async sellStock(ticker: string, quantity: number): Promise<any> {
    return api.post('/economy/stocks/sell', { ticker, quantity });
  }

  public static async getAuctions(): Promise<{ auctions: any[]; count: number }> {
    return api.get('/economy/marketplace/auctions');
  }

  public static async bidOnAuction(auctionId: string, amount: number): Promise<any> {
    return api.post(`/economy/marketplace/auctions/${auctionId}/bid`, { amount });
  }

  public static async getRealEstateProperties(): Promise<{ properties: any[]; count: number }> {
    return api.get('/economy/realestate/available');
  }

  public static async buyProperty(propertyId: string): Promise<any> {
    return api.post(`/economy/realestate/${propertyId}/buy`);
  }
}
