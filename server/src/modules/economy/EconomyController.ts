/**
 * ============================================================================
 * REALDRIVE ECONOMY — ECONOMY CONTROLLER & ROUTER
 * ============================================================================
 * REST API Endpoints:
 * - GET  /api/v1/economy/bank
 * - POST /api/v1/economy/bank/transfer
 * - POST /api/v1/economy/bank/deposit
 * - POST /api/v1/economy/bank/withdraw
 * - GET  /api/v1/economy/bank/transactions
 * - GET  /api/v1/economy/stocks
 * - GET  /api/v1/economy/stocks/portfolio
 * - POST /api/v1/economy/stocks/buy
 * - POST /api/v1/economy/stocks/sell
 * - GET  /api/v1/economy/marketplace/auctions
 * - POST /api/v1/economy/marketplace/auctions
 * - POST /api/v1/economy/marketplace/auctions/:id/bid
 * - GET  /api/v1/economy/realestate/available
 * - POST /api/v1/economy/realestate/:id/buy
 */

import { RouterRegistry } from '../../core/RouterRegistry.js';
import { BankingLedgerService } from './BankingLedgerService.js';
import { StockExchangeTickEngine } from './StockExchangeTickEngine.js';
import { UsedCarMarketplaceBroker } from './UsedCarMarketplaceBroker.js';
import { RealEstateAgencyService } from './RealEstateAgencyService.js';
import { AutoFinancingService } from './AutoFinancingService.js';
import { CustomHttpRequest, CustomHttpResponse, HttpStatus } from '../../core/HttpTypes.js';
import { JwtService } from '../auth/JwtService.js';

export class EconomyController {
  private router: RouterRegistry;
  private bankingService: BankingLedgerService;
  private stockEngine: StockExchangeTickEngine;
  private auctionBroker: UsedCarMarketplaceBroker;
  private realEstateService: RealEstateAgencyService;
  private financingService: AutoFinancingService;

  constructor() {
    this.router = new RouterRegistry('/economy');
    this.bankingService = new BankingLedgerService();
    this.stockEngine = new StockExchangeTickEngine();
    this.auctionBroker = new UsedCarMarketplaceBroker();
    this.realEstateService = new RealEstateAgencyService();
    this.financingService = new AutoFinancingService();

    this.registerRoutes();
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  private registerRoutes(): void {
    // Bank Account
    this.router.get('/bank', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const account = await this.bankingService.getAccount(verify.payload.sub);
      return res.json(account);
    });

    // Bank Transfer
    this.router.post('/bank/transfer', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { recipientAccountNumber, amount, memo } = req.body;
      const result = await this.bankingService.transferFunds(verify.payload.sub, recipientAccountNumber, amount, memo);
      return res.json(result);
    });

    // Deposit Cash
    this.router.post('/bank/deposit', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { amount } = req.body;
      const account = await this.bankingService.depositCash(verify.payload.sub, amount);
      return res.json(account);
    });

    // Withdraw Cash
    this.router.post('/bank/withdraw', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { amount } = req.body;
      const account = await this.bankingService.withdrawCash(verify.payload.sub, amount);
      return res.json(account);
    });

    // Bank Transactions
    this.router.get('/bank/transactions', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const txs = await this.bankingService.getTransactionHistory(verify.payload.sub);
      return res.json({ transactions: txs, count: txs.length });
    });

    // Stocks
    this.router.get('/stocks', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const stocks = await this.stockEngine.getAllStocks();
      return res.json({ stocks, count: stocks.length });
    });

    // Portfolio
    this.router.get('/stocks/portfolio', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const portfolio = await this.stockEngine.getPlayerPortfolio(verify.payload.sub);
      return res.json({ portfolio });
    });

    // Buy Stock
    this.router.post('/stocks/buy', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { ticker, quantity } = req.body;
      const tx = await this.stockEngine.buyStock(verify.payload.sub, ticker, quantity);
      return res.status(HttpStatus.CREATED).json(tx);
    });

    // Sell Stock
    this.router.post('/stocks/sell', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { ticker, quantity } = req.body;
      const tx = await this.stockEngine.sellStock(verify.payload.sub, ticker, quantity);
      return res.json(tx);
    });

    // Marketplace Auctions
    this.router.get('/marketplace/auctions', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const auctions = await this.auctionBroker.getActiveAuctions();
      return res.json({ auctions, count: auctions.length });
    });

    // Place Auction Bid
    this.router.post('/marketplace/auctions/:id/bid', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { amount } = req.body;
      const auction = await this.auctionBroker.placeBid(req.params.id, verify.payload.sub, amount);
      return res.json(auction);
    });

    // Real Estate Properties
    this.router.get('/realestate/available', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const properties = await this.realEstateService.getAvailableProperties();
      return res.json({ properties, count: properties.length });
    });

    // Purchase Real Estate
    this.router.post('/realestate/:id/buy', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const property = await this.realEstateService.purchaseProperty(verify.payload.sub, req.params.id);
      return res.status(HttpStatus.CREATED).json(property);
    });
  }

  private extractToken(req: CustomHttpRequest): string | null {
    const authHeader = req.headers['authorization'] as string;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    if (req.cookies && req.cookies['token']) {
      return req.cookies['token'];
    }
    return null;
  }
}
