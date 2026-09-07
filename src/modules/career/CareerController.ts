/**
 * ============================================================================
 * REALDRIVE CAREER — CAREER CONTROLLER & ROUTER
 * ============================================================================
 * REST API Endpoints:
 * - GET  /api/v1/career/profile
 * - GET  /api/v1/career/rideshare/available
 * - POST /api/v1/career/rideshare/:id/accept
 * - POST /api/v1/career/rideshare/:id/complete
 * - GET  /api/v1/career/freight/contracts
 * - POST /api/v1/career/freight/:id/accept
 * - POST /api/v1/career/freight/:id/deliver
 * - GET  /api/v1/career/express/orders
 * - POST /api/v1/career/express/:id/claim
 * - POST /api/v1/career/express/:id/deliver
 */

import { RouterRegistry } from '../../core/RouterRegistry.js';
import { CareerService } from './CareerService.js';
import { CustomHttpRequest, CustomHttpResponse, HttpStatus } from '../../core/HttpTypes.js';
import { JwtService } from '../auth/JwtService.js';

export class CareerController {
  private router: RouterRegistry;
  private careerService: CareerService;

  constructor(careerService: CareerService = new CareerService()) {
    this.router = new RouterRegistry('/career');
    this.careerService = careerService;
    this.registerRoutes();
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  private registerRoutes(): void {
    // Driver career profile
    this.router.get('/profile', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const profile = await this.careerService.getDriverProfile(verify.payload.sub);
      return res.json(profile);
    });

    // Rideshare available fares
    this.router.get('/rideshare/available', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const fares = await this.careerService.getRideshareEngine().generateAvailableFares(verify.payload.sub);
      return res.json({ fares, count: fares.length });
    });

    // Accept rideshare fare
    this.router.post('/rideshare/:id/accept', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const accepted = await this.careerService.getRideshareEngine().acceptFare(req.params.id, verify.payload.sub);
      return res.json(accepted);
    });

    // Complete rideshare fare
    this.router.post('/rideshare/:id/complete', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const smoothness = req.body?.smoothnessScorePct || 90;
      const result = await this.careerService.getRideshareEngine().completeFare(req.params.id, smoothness);

      // Award XP
      await this.careerService.addCareerEarningsAndXp(verify.payload.sub, result.earnings, 450);

      return res.json(result);
    });

    // Freight contracts
    this.router.get('/freight/contracts', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const contracts = await this.careerService.getFreightEngine().generateFreightContracts();
      return res.json({ contracts, count: contracts.length });
    });

    // Accept freight contract
    this.router.post('/freight/:id/accept', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const accepted = await this.careerService.getFreightEngine().acceptContract(req.params.id, verify.payload.sub);
      return res.json(accepted);
    });

    // Deliver freight
    this.router.post('/freight/:id/deliver', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const health = req.body?.cargoHealthPct ?? 100;
      const result = await this.careerService.getFreightEngine().deliverFreight(req.params.id, health);

      await this.careerService.addCareerEarningsAndXp(verify.payload.sub, result.netPayout, 1200);

      return res.json(result);
    });

    // Express orders
    this.router.get('/express/orders', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const orders = await this.careerService.getExpressEngine().generateOrders();
      return res.json({ orders, count: orders.length });
    });

    // Claim express order
    this.router.post('/express/:id/claim', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const claimed = await this.careerService.getExpressEngine().claimOrder(req.params.id, verify.payload.sub);
      return res.json(claimed);
    });

    // Deliver express order
    this.router.post('/express/:id/deliver', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const elapsed = req.body?.elapsedSeconds || 60;
      const bumps = req.body?.shockBumpsCount || 0;
      const result = await this.careerService.getExpressEngine().deliverOrder(req.params.id, elapsed, bumps);

      await this.careerService.addCareerEarningsAndXp(verify.payload.sub, result.earnings, 250);

      return res.json(result);
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
