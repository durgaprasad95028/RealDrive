/**
 * ============================================================================
 * REALDRIVE FLEET — FLEET MANAGEMENT MODULE
 * ============================================================================
 * Commercial transport fleet operations:
 * - Employed AI drivers with skill tiers and salary rates
 * - Semi-truck & cargo fleet logistics route assignments
 * - Daily revenue collection & fleet maintenance expense scheduling
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { RouterRegistry } from '../../core/RouterRegistry.js';
import { CustomHttpRequest, CustomHttpResponse, HttpStatus } from '../../core/HttpTypes.js';
import { JwtService } from '../auth/JwtService.js';
import { HttpError } from '../../core/HttpTypes.js';

export interface FleetDriver {
  id: string;
  name: string;
  avatar: string;
  experienceTier: 'ROOKIE' | 'EXPERIENCED' | 'VETERAN' | 'MASTER_HAULER';
  skillRatingPct: number;
  dailySalaryCredits: number;
  assignedVehicleId?: string;
  currentRouteStatus: 'IDLE' | 'ON_ROUTE' | 'RESTING';
  totalDeliveriesCompleted: number;
  accumulatedRevenue: number;
}

export class FleetService {
  private drivers: Map<string, FleetDriver[]> = new Map(); // userId -> FleetDriver[]

  public async getPlayerFleet(userId: string): Promise<{ drivers: FleetDriver[]; totalRevenueAccumulated: number }> {
    const list = this.drivers.get(userId) || [];
    let totalRevenue = 0;
    for (const d of list) totalRevenue += d.accumulatedRevenue;
    return { drivers: list, totalRevenueAccumulated: totalRevenue };
  }

  public async hireDriver(userId: string, tier: FleetDriver['experienceTier']): Promise<FleetDriver> {
    const salaries = { ROOKIE: 120, EXPERIENCED: 280, VETERAN: 550, MASTER_HAULER: 1100 };
    const skills = { ROOKIE: 65, EXPERIENCED: 82, VETERAN: 94, MASTER_HAULER: 99 };
    const names = ['Oleg Volkov', 'Mateo Fernandez', 'Liam O’Connor', 'Hao Zhang', 'Dmitri Pavlov', 'Jack Taylor'];

    const newDriver: FleetDriver = {
      id: `flt_drv_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      name: names[Math.floor(Math.random() * names.length)],
      avatar: `/avatars/driver_fleet_${Math.floor(1 + Math.random() * 4)}.png`,
      experienceTier: tier,
      skillRatingPct: skills[tier],
      dailySalaryCredits: salaries[tier],
      currentRouteStatus: 'IDLE',
      totalDeliveriesCompleted: 0,
      accumulatedRevenue: 0,
    };

    const list = this.drivers.get(userId) || [];
    list.push(newDriver);
    this.drivers.set(userId, list);

    return newDriver;
  }

  public async assignRoute(userId: string, driverId: string, vehicleId: string): Promise<FleetDriver> {
    const list = this.drivers.get(userId) || [];
    const driver = list.find((d) => d.id === driverId);
    if (!driver) throw HttpError.notFound('Driver not found');

    driver.assignedVehicleId = vehicleId;
    driver.currentRouteStatus = 'ON_ROUTE';
    // Simulate immediate revenue reward from dispatched job
    const baseRevenue = driver.experienceTier === 'MASTER_HAULER' ? 18000 : (driver.experienceTier === 'VETERAN' ? 9500 : 4500);
    driver.accumulatedRevenue += baseRevenue;
    driver.totalDeliveriesCompleted += 1;

    return driver;
  }

  public async collectRevenue(userId: string): Promise<{ collectedAmount: number }> {
    const list = this.drivers.get(userId) || [];
    let sum = 0;
    for (const d of list) {
      sum += d.accumulatedRevenue;
      d.accumulatedRevenue = 0;
      d.currentRouteStatus = 'IDLE';
    }

    if (sum > 0) {
      const user = await db.findById<any>('users', userId);
      if (user) {
        await db.update('users', userId, { cashBalance: user.cashBalance + sum });
      }
    }

    return { collectedAmount: sum };
  }
}

export class FleetController {
  private router: RouterRegistry;
  private fleetService: FleetService;

  constructor() {
    this.router = new RouterRegistry('/fleet');
    this.fleetService = new FleetService();
    this.registerRoutes();
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  private registerRoutes(): void {
    this.router.get('/', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const fleet = await this.fleetService.getPlayerFleet(verify.payload.sub);
      return res.json(fleet);
    });

    this.router.post('/hire', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { tier } = req.body;
      const driver = await this.fleetService.hireDriver(verify.payload.sub, tier || 'ROOKIE');
      return res.status(HttpStatus.CREATED).json(driver);
    });

    this.router.post('/assign-route', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { driverId, vehicleId } = req.body;
      const driver = await this.fleetService.assignRoute(verify.payload.sub, driverId, vehicleId);
      return res.json(driver);
    });

    this.router.post('/collect', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const result = await this.fleetService.collectRevenue(verify.payload.sub);
      return res.json(result);
    });
  }

  private extractToken(req: CustomHttpRequest): string | null {
    const authHeader = req.headers['authorization'] as string;
    if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.substring(7);
    if (req.cookies && req.cookies['token']) return req.cookies['token'];
    return null;
  }
}
