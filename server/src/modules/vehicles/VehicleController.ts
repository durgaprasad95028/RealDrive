/**
 * ============================================================================
 * REALDRIVE VEHICLES — VEHICLE CONTROLLER & ROUTER
 * ============================================================================
 * REST API Endpoints:
 * - GET  /api/v1/vehicles/catalog
 * - GET  /api/v1/vehicles/owned
 * - GET  /api/v1/vehicles/:id
 * - POST /api/v1/vehicles/:id/buy
 * - GET  /api/v1/vehicles/:id/dyno
 * - PUT  /api/v1/vehicles/:id/tune
 * - GET  /api/v1/vehicles/tuning/parts
 * - POST /api/v1/vehicles/:id/telemetry
 */

import { RouterRegistry } from '../../core/RouterRegistry.js';
import { VehicleService } from './VehicleService.js';
import { TuningWorkshopService } from './TuningWorkshopService.js';
import { CustomHttpRequest, CustomHttpResponse, HttpStatus } from '../../core/HttpTypes.js';
import { JwtService } from '../auth/JwtService.js';

export class VehicleController {
  private router: RouterRegistry;
  private vehicleService: VehicleService;

  constructor(vehicleService: VehicleService = new VehicleService()) {
    this.router = new RouterRegistry('/vehicles');
    this.vehicleService = vehicleService;
    this.registerRoutes();
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  private registerRoutes(): void {
    // Showroom catalog
    this.router.get('/catalog', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const catalog = await this.vehicleService.getShowroomCatalog();
      return res.json({ vehicles: catalog, total: catalog.length });
    });

    // Parts Catalog
    this.router.get('/tuning/parts', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      return res.json({ parts: TuningWorkshopService.PARTS_CATALOG });
    });

    // Owned vehicles
    this.router.get('/owned', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth token required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const owned = await this.vehicleService.getOwnedVehicles(verify.payload.sub);
      return res.json({ vehicles: owned, count: owned.length });
    });

    // Vehicle Details
    this.router.get('/:id', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const vehicleId = req.params.id;
      const details = await this.vehicleService.getVehicleDetails(vehicleId);
      return res.json(details);
    });

    // Purchase vehicle
    this.router.post('/:id/buy', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const vehicleId = req.params.id;
      const color = req.body?.color;
      const newVehicle = await this.vehicleService.purchaseVehicle(verify.payload.sub, vehicleId, color);

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: `Successfully purchased ${newVehicle.name}! Added to your garage.`,
        vehicle: newVehicle,
      });
    });

    // Virtual Dyno Pull
    this.router.get('/:id/dyno', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const vehicleId = req.params.id;
      const dynoResult = await this.vehicleService.runDyno(vehicleId);
      return res.json(dynoResult);
    });

    // Tune Vehicle
    this.router.put('/:id/tune', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const vehicleId = req.params.id;
      const updates = req.body;
      const result = await this.vehicleService.saveVehicleTuning(vehicleId, updates);
      return res.json(result);
    });

    // Record Telemetry
    this.router.post('/:id/telemetry', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const vehicleId = req.params.id;
      const log = await this.vehicleService.recordTelemetry(verify.payload.sub, {
        ...req.body,
        vehicleId,
      });

      return res.status(HttpStatus.CREATED).json(log);
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
