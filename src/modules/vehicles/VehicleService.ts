/**
 * ============================================================================
 * REALDRIVE VEHICLES — VEHICLE MANAGEMENT SERVICE
 * ============================================================================
 * High-level business logic for vehicle purchases, sales, dyno testing,
 * aftermarket mechanical tuning, paint customizations, and telemetry logging.
 */

import { VehicleRepository } from './VehicleRepository.js';
import { DynoSimulationService, DynoRunResult } from './DynoSimulationService.js';
import { TuningWorkshopService } from './TuningWorkshopService.js';
import { VehicleEntity } from '../../database/entities/VehicleEntity.js';
import { VehicleTuningEntity } from '../../database/entities/VehicleTuningEntity.js';
import { HttpError } from '../../core/HttpTypes.js';
import { EventBus } from '../../core/EventBus.js';
import { db } from '../../database/DatabaseClient.js';
import { UserEntity } from '../../database/entities/UserEntity.js';
import { BankAccountEntity } from '../../database/entities/BankAccountEntity.js';
import crypto from 'crypto';

export class VehicleService {
  constructor(
    private vehicleRepo: VehicleRepository = new VehicleRepository(),
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async getShowroomCatalog(): Promise<VehicleEntity[]> {
    return this.vehicleRepo.getShowroomCatalog();
  }

  public async getOwnedVehicles(userId: string): Promise<Array<{ vehicle: VehicleEntity; tuning: VehicleTuningEntity | null }>> {
    const vehicles = await this.vehicleRepo.findByOwnerId(userId);
    const results = [];
    for (const v of vehicles) {
      const tuning = await this.vehicleRepo.findTuningByVehicleId(v.id);
      results.push({ vehicle: v, tuning });
    }
    return results;
  }

  public async getVehicleDetails(vehicleId: string): Promise<{ vehicle: VehicleEntity; tuning: VehicleTuningEntity | null }> {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw HttpError.notFound('Vehicle not found');

    const tuning = await this.vehicleRepo.findTuningByVehicleId(vehicleId);
    return { vehicle, tuning };
  }

  public async purchaseVehicle(userId: string, showroomVehicleId: string, color?: string): Promise<VehicleEntity> {
    const user = await db.findById<UserEntity>('users', userId);
    if (!user) throw HttpError.notFound('User not found');

    const showroomVehicle = await this.vehicleRepo.findById(showroomVehicleId);
    if (!showroomVehicle) throw HttpError.notFound('Showroom vehicle not found');

    const price = showroomVehicle.basePrice;
    if (user.cashBalance + user.bankBalance < price) {
      throw HttpError.badRequest(`Insufficient funds to purchase ${showroomVehicle.name}. Required: ${price} credits.`);
    }

    // Deduct funds (from cash first, then bank)
    let newCash = user.cashBalance;
    let newBank = user.bankBalance;
    if (newCash >= price) {
      newCash -= price;
    } else {
      const remainder = price - newCash;
      newCash = 0;
      newBank -= remainder;
    }

    await db.update<UserEntity>('users', userId, {
      cashBalance: newCash,
      bankBalance: newBank,
    });

    const bankAcc = await db.findOne<BankAccountEntity>('bank_accounts', { userId });
    if (bankAcc) {
      await db.update<BankAccountEntity>('bank_accounts', bankAcc.id, {
        balance: newBank,
        availableBalance: newBank,
      });
    }

    // Create new owned instance
    const vin = `RD${showroomVehicle.brand.substring(0, 3).toUpperCase()}${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
    const newVehicle = await this.vehicleRepo.createVehicle({
      ownerId: userId,
      modelId: showroomVehicle.modelId,
      name: showroomVehicle.name,
      brand: showroomVehicle.brand,
      vehicleClass: showroomVehicle.vehicleClass,
      year: showroomVehicle.year,
      vin,
      licensePlate: `RD-${Math.floor(100 + Math.random() * 900)}`,
      paintColor: color || showroomVehicle.paintColor,
      paintFinish: showroomVehicle.paintFinish,
      mileageKm: 0.0,
      basePrice: showroomVehicle.basePrice,
      marketValuation: showroomVehicle.basePrice,
      engineType: showroomVehicle.engineType,
      drivetrain: showroomVehicle.drivetrain,
      transmissionType: showroomVehicle.transmissionType,
      horsepower: showroomVehicle.horsepower,
      torqueNm: showroomVehicle.torqueNm,
      curbWeightKg: showroomVehicle.curbWeightKg,
      topSpeedKmh: showroomVehicle.topSpeedKmh,
      zeroToHundredSec: showroomVehicle.zeroToHundredSec,
      brakingDistance100To0M: showroomVehicle.brakingDistance100To0M,
      lateralGForce: showroomVehicle.lateralGForce,
      fuelCapacityLiters: showroomVehicle.fuelCapacityLiters,
      currentFuelLiters: showroomVehicle.fuelCapacityLiters,
      engineConditionPct: 100.0,
      transmissionConditionPct: 100.0,
      brakePadsConditionPct: 100.0,
      tireTreadConditionPct: 100.0,
      oilLifePct: 100.0,
      chassisStructuralDamagePct: 0.0,
      isImpounded: false,
      isInGarage: true,
    });

    // Create default stock tuning
    await this.vehicleRepo.saveTuning(newVehicle.id, {
      ecuStage: 'STOCK',
      ignitionTimingDegrees: 0,
      fuelAirTargetRatio: 12.8,
      revLimiterRpm: 7500,
      launchControlRpm: 3500,
      antiLagEnabled: false,
      forcedInductionType: showroomVehicle.engineType.includes('TURBO') ? 'TWIN_TURBO' : 'NATURALLY_ASPIRATED',
      turboBoostPressureBar: showroomVehicle.engineType.includes('TURBO') ? 1.0 : 0.0,
      wastegateCrackingPressureBar: 0.8,
      blowOffValveAcousticProfile: 'CLEAN_VENT',
      intakeManifoldType: 'STOCK_PLASTIC',
      exhaustSystemType: 'STOCK_CAT',
      suspensionCoiloverType: 'OEM_FACTORY',
      rideHeightFrontMm: 140,
      rideHeightRearMm: 145,
      camberFrontDeg: -1.0,
      camberRearDeg: -0.8,
      toeFrontDeg: 0.0,
      toeRearDeg: 0.05,
      casterFrontDeg: 5.5,
      antiRollBarStiffnessFrontNm: 300,
      antiRollBarStiffnessRearNm: 250,
      damperReboundFrontPct: 50,
      damperReboundRearPct: 50,
      brakePackageType: 'OEM_STEEL',
      brakeBiasFrontPct: 60,
      tireCompound: 'SPORT_SUMMER',
      tirePressureFrontPsi: 32,
      tirePressureRearPsi: 32,
      differentialType: 'VISCOUS_LSD',
      diffAccelLockPct: 40,
      diffDecelLockPct: 20,
      frontSplitterAngleDeg: 0,
      rearWingAngleDeg: 0,
    });

    this.eventBus.emit('vehicle.purchased', { userId, vehicleId: newVehicle.id, vehicleName: newVehicle.name, price });
    return newVehicle;
  }

  public async runDyno(vehicleId: string): Promise<DynoRunResult> {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw HttpError.notFound('Vehicle not found');

    let tuning = await this.vehicleRepo.findTuningByVehicleId(vehicleId);
    if (!tuning) {
      tuning = {
        id: crypto.randomUUID(),
        vehicleId,
        ecuStage: 'STOCK',
        ignitionTimingDegrees: 0,
        fuelAirTargetRatio: 12.8,
        revLimiterRpm: 7500,
        launchControlRpm: 3500,
        antiLagEnabled: false,
        forcedInductionType: 'NATURALLY_ASPIRATED',
        turboBoostPressureBar: 0,
        wastegateCrackingPressureBar: 0,
        blowOffValveAcousticProfile: 'CLEAN_VENT',
        intakeManifoldType: 'STOCK_PLASTIC',
        exhaustSystemType: 'STOCK_CAT',
        suspensionCoiloverType: 'OEM_FACTORY',
        rideHeightFrontMm: 140,
        rideHeightRearMm: 145,
        camberFrontDeg: -1,
        camberRearDeg: -0.8,
        toeFrontDeg: 0,
        toeRearDeg: 0,
        casterFrontDeg: 5,
        antiRollBarStiffnessFrontNm: 300,
        antiRollBarStiffnessRearNm: 250,
        damperReboundFrontPct: 50,
        damperReboundRearPct: 50,
        brakePackageType: 'OEM_STEEL',
        brakeBiasFrontPct: 60,
        tireCompound: 'SPORT_SUMMER',
        tirePressureFrontPsi: 32,
        tirePressureRearPsi: 32,
        differentialType: 'VISCOUS_LSD',
        diffAccelLockPct: 40,
        diffDecelLockPct: 20,
        frontSplitterAngleDeg: 0,
        rearWingAngleDeg: 0,
        createdAt: '',
        updatedAt: '',
      };
    }

    const dynoResult = DynoSimulationService.runDynoPull({
      displacementLiters: 3.8,
      cylinders: 6,
      idleRpm: 900,
      redlineRpm: tuning.revLimiterRpm || 7500,
      baseTorqueNm: vehicle.torqueNm,
      ecuStage: tuning.ecuStage,
      ignitionTimingDegrees: tuning.ignitionTimingDegrees,
      fuelAirTargetRatio: tuning.fuelAirTargetRatio,
      forcedInductionType: tuning.forcedInductionType,
      targetBoostBar: tuning.turboBoostPressureBar,
      intakeType: tuning.intakeManifoldType,
      exhaustType: tuning.exhaustSystemType,
      drivetrain: vehicle.drivetrain,
    }, vehicle.id, vehicle.name);

    return dynoResult;
  }

  public async saveVehicleTuning(vehicleId: string, tuningUpdates: Partial<VehicleTuningEntity>): Promise<{
    tuning: VehicleTuningEntity;
    calculatedStats: any;
  }> {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw HttpError.notFound('Vehicle not found');

    const updatedTuning = await this.vehicleRepo.saveTuning(vehicleId, tuningUpdates);
    const calculatedStats = TuningWorkshopService.calculateModifiedStats(vehicle, updatedTuning);

    // Update vehicle live performance stats
    await this.vehicleRepo.updateVehicle(vehicleId, {
      horsepower: calculatedStats.horsepower,
      torqueNm: calculatedStats.torqueNm,
      topSpeedKmh: calculatedStats.topSpeedKmh,
      zeroToHundredSec: calculatedStats.zeroToHundredSec,
      lateralGForce: calculatedStats.lateralG,
    });

    this.eventBus.emit('vehicle.tuned', { vehicleId, horsepower: calculatedStats.horsepower });

    return {
      tuning: updatedTuning,
      calculatedStats,
    };
  }

  public async recordTelemetry(userId: string, data: any): Promise<any> {
    return this.vehicleRepo.saveTelemetryLog({
      ...data,
      userId,
      createdAt: new Date().toISOString(),
    });
  }
}
