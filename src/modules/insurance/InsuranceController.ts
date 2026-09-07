/**
 * ============================================================================
 * REALDRIVE INSURANCE — AUTOMOTIVE INSURANCE & CLAIMS MODULE
 * ============================================================================
 * Insurance underwriting & collision claim adjuster:
 * - Policy tiers: Third-Party Liability, Full Comprehensive, Motorsport Track Day
 * - Instant claim filing & vehicle repair payout reimbursements
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { RouterRegistry } from '../../core/RouterRegistry.js';
import { CustomHttpRequest, CustomHttpResponse, HttpStatus } from '../../core/HttpTypes.js';
import { JwtService } from '../auth/JwtService.js';
import { HttpError } from '../../core/HttpTypes.js';

export interface InsurancePolicy {
  id: string;
  userId: string;
  vehicleId: string;
  policyType: 'THIRD_PARTY' | 'COMPREHENSIVE_COLLISION' | 'MOTORSPORT_TRACK_INDEMNITY';
  dailyPremiumCredits: number;
  deductibleCredits: number;
  coverageLimitCredits: number;
  isActive: boolean;
  claimsFiledCount: number;
  expiresAt: string;
}

export class InsuranceService {
  private policies: Map<string, InsurancePolicy[]> = new Map();

  public async getPlayerPolicies(userId: string): Promise<InsurancePolicy[]> {
    return this.policies.get(userId) || [];
  }

  public async purchasePolicy(
    userId: string,
    vehicleId: string,
    policyType: InsurancePolicy['policyType']
  ): Promise<InsurancePolicy> {
    const premiums = { THIRD_PARTY: 25, COMPREHENSIVE_COLLISION: 85, MOTORSPORT_TRACK_INDEMNITY: 220 };
    const deductibles = { THIRD_PARTY: 2500, COMPREHENSIVE_COLLISION: 500, MOTORSPORT_TRACK_INDEMNITY: 100 };
    const limits = { THIRD_PARTY: 50000, COMPREHENSIVE_COLLISION: 500000, MOTORSPORT_TRACK_INDEMNITY: 2500000 };

    const policy: InsurancePolicy = {
      id: `pol_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      userId,
      vehicleId,
      policyType,
      dailyPremiumCredits: premiums[policyType],
      deductibleCredits: deductibles[policyType],
      coverageLimitCredits: limits[policyType],
      isActive: true,
      claimsFiledCount: 0,
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    };

    const list = this.policies.get(userId) || [];
    list.push(policy);
    this.policies.set(userId, list);

    return policy;
  }

  public async fileDamageClaim(userId: string, policyId: string, repairCost: number): Promise<{
    approvedPayout: number;
    deductiblePaid: number;
  }> {
    const list = this.policies.get(userId) || [];
    const policy = list.find((p) => p.id === policyId);
    if (!policy) throw HttpError.notFound('Insurance policy not found');

    const deductible = policy.deductibleCredits;
    const payout = Math.max(0, Math.min(policy.coverageLimitCredits, repairCost - deductible));

    policy.claimsFiledCount += 1;

    // Reimburse player cash
    const user = await db.findById<any>('users', userId);
    if (user && payout > 0) {
      await db.update('users', userId, { cashBalance: user.cashBalance + payout });
    }

    return { approvedPayout: payout, deductiblePaid: deductible };
  }
}

export class InsuranceController {
  private router: RouterRegistry;
  private service: InsuranceService;

  constructor() {
    this.router = new RouterRegistry('/insurance');
    this.service = new InsuranceService();
    this.registerRoutes();
  }

  public getRouter(): RouterRegistry {
    return this.router;
  }

  private registerRoutes(): void {
    this.router.get('/policies', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const policies = await this.service.getPlayerPolicies(verify.payload.sub);
      return res.json({ policies });
    });

    this.router.post('/purchase', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { vehicleId, policyType } = req.body;
      const policy = await this.service.purchasePolicy(verify.payload.sub, vehicleId, policyType || 'COMPREHENSIVE_COLLISION');
      return res.status(HttpStatus.CREATED).json(policy);
    });

    this.router.post('/claim', async (req: CustomHttpRequest, res: CustomHttpResponse) => {
      const token = this.extractToken(req);
      if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Auth required' });
      const verify = JwtService.verify(token);
      if (!verify.valid || !verify.payload) return res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });

      const { policyId, repairCost } = req.body;
      const claim = await this.service.fileDamageClaim(verify.payload.sub, policyId, repairCost);
      return res.json(claim);
    });
  }

  private extractToken(req: CustomHttpRequest): string | null {
    const authHeader = req.headers['authorization'] as string;
    if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.substring(7);
    if (req.cookies && req.cookies['token']) return req.cookies['token'];
    return null;
  }
}
