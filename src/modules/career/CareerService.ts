/**
 * ============================================================================
 * REALDRIVE CAREER — CAREER & LOGISTICS ORCHESTRATION SERVICE
 * ============================================================================
 * Driver XP progression, professional endorsements, rideshare & cargo earnings.
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { RideshareDispatchEngine } from './RideshareDispatchEngine.js';
import { FreightHaulingEngine } from './FreightHaulingEngine.js';
import { ExpressDeliveryEngine } from './ExpressDeliveryEngine.js';
import { CareerDriverEntity } from '../../database/entities/CareerDriverEntity.js';
import { UserEntity } from '../../database/entities/UserEntity.js';
import { EventBus } from '../../core/EventBus.js';
import { HttpError } from '../../core/HttpTypes.js';

export class CareerService {
  private rideshareEngine: RideshareDispatchEngine;
  private freightEngine: FreightHaulingEngine;
  private expressEngine: ExpressDeliveryEngine;

  constructor(
    private database: DatabaseClient = db,
    private eventBus: EventBus = EventBus.getInstance()
  ) {
    this.rideshareEngine = new RideshareDispatchEngine(database);
    this.freightEngine = new FreightHaulingEngine(database);
    this.expressEngine = new ExpressDeliveryEngine(database);
  }

  public async getDriverProfile(userId: string): Promise<CareerDriverEntity> {
    let driver = await this.database.findOne<CareerDriverEntity>('career_drivers', { userId });
    if (!driver) {
      driver = await this.database.insert<CareerDriverEntity>('career_drivers', {
        userId,
        careerLevel: 1,
        careerXp: 0,
        overallRating: 5.0,
        totalCompletedJobs: 0,
        totalCancelledJobs: 0,
        totalCareerEarnings: 0,
        hasRideshareLicense: true,
        rideshareTier: 'BRONZE',
        hasCdlFreightLicense: false,
        hasHazmatEndorsement: false,
        hasHeavyHaulEndorsement: false,
        hasExpressCourierLicense: true,
        hasArmoredValuablesLicense: false,
        onTimeDeliveryRatePct: 100.0,
        cargoIntegrityAveragePct: 100.0,
        passengerComfortRating: 5.0,
        speedingViolationCount: 0,
      });
    }
    return driver;
  }

  public async addCareerEarningsAndXp(userId: string, earnings: number, xp: number): Promise<CareerDriverEntity> {
    const driver = await this.getDriverProfile(userId);
    const user = await this.database.findById<UserEntity>('users', userId);

    const newEarnings = driver.totalCareerEarnings + earnings;
    const newXp = driver.careerXp + xp;
    const newCompleted = driver.totalCompletedJobs + 1;
    const newLevel = Math.floor(1 + newXp / 2500);

    // Update driver
    const updatedDriver = await this.database.update<CareerDriverEntity>('career_drivers', driver.id, {
      totalCareerEarnings: newEarnings,
      careerXp: newXp,
      careerLevel: newLevel,
      totalCompletedJobs: newCompleted,
    });

    // Award player cash
    if (user) {
      await this.database.update<UserEntity>('users', userId, {
        cashBalance: user.cashBalance + earnings,
        driverXp: user.driverXp + xp,
      });
    }

    this.eventBus.emit('career.job_completed', { userId, earnings, xp, level: newLevel });
    return updatedDriver!;
  }

  public getRideshareEngine(): RideshareDispatchEngine {
    return this.rideshareEngine;
  }

  public getFreightEngine(): FreightHaulingEngine {
    return this.freightEngine;
  }

  public getExpressEngine(): ExpressDeliveryEngine {
    return this.expressEngine;
  }
}
