/**
 * ============================================================================
 * REALDRIVE POLICE — POLICE CONTROLLER & ROUTER
 * ============================================================================
 * REST API Endpoints:
 * - GET  /api/v1/police/tickets
 * - POST /api/v1/police/tickets/flash
 * - POST /api/v1/police/tickets/:id/pay
 * - GET  /api/v1/police/wanted
 * - POST /api/v1/police/wanted/trigger
 * - POST /api/v1/police/wanted/:id/evade
 * - POST /api/v1/police/wanted/:id/arrest
 */

import { RouterRegistry } from '../../core/RouterRegistry.js';
import { PoliceDispatchService } from './PoliceDispatchService.js';
import { SpeedRadarProcessor } from './SpeedRadarProcessor.js';
import { CustomHttpRequest, CustomHttpResponse, HttpStatus } from '../../core/HttpTypes.js';
import { JwtService } from '../auth/JwtService.js';

export class PoliceController {
  private router: RouterRegistry;
  private dispatchService: PoliceDispatchService;
  private radarProcessor: SpeedRadarProcessor;

  constructor() {
    this.router = new RouterRegistry('/police');
    this.dispatchService = new PoliceDispatchService();
    this.radarProcessor = new SpeedRadarProcessor();
    this.registerRoutes();
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  private registerRoutes(): void {
    // Driver radar tickets
    this.router.get('/tickets', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const tickets = await this.radarProcessor.getDriverTickets(verify.payload.sub);
      return res.json({ tickets, count: tickets.length });
    });

    // Speed Camera Flash Trigger
    this.router.post('/tickets/flash', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const ticket = await this.radarProcessor.recordSpeedCameraFlash(req.body);
      if (!ticket) {
        return res.json({ recorded: false, message: 'Speed within legal tolerance.' });
      }
      return res.status(HttpStatus.CREATED).json({ recorded: true, ticket });
    });

    // Pay Ticket
    this.router.post('/tickets/:id/pay', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const paid = await this.radarProcessor.payTicket(req.params.id, verify.payload.sub);
      return res.json({ success: true, message: 'Fine paid successfully.', ticket: paid });
    });

    // Active Wanted Status
    this.router.get('/wanted', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const active = await this.dispatchService.getActivePursuit(verify.payload.sub);
      return res.json({ inPursuit: !!active, wantedRecord: active });
    });

    // Trigger Wanted Pursuit
    this.router.post('/wanted/trigger', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { vehicleId, heatLevel, district, coords } = req.body;
      const pursuit = await this.dispatchService.triggerPursuit(
        verify.payload.sub,
        vehicleId,
        heatLevel || 1,
        district || 'DOWNTOWN_METROPOLIS',
        coords
      );

      return res.status(HttpStatus.CREATED).json(pursuit);
    });

    // Evade Pursuit
    this.router.post('/wanted/:id/evade', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const result = await this.dispatchService.evadePursuit(req.params.id);
      return res.json({ success: true, message: 'Police pursuit successfully evaded!', record: result });
    });

    // Arrest / Busted
    this.router.post('/wanted/:id/arrest', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const result = await this.dispatchService.arrestDriver(req.params.id);
      return res.json({ success: true, message: 'Suspect busted and vehicle impounded.', result });
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
