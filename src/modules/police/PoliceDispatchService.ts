/**
 * ============================================================================
 * REALDRIVE POLICE — DISPATCH & PURSUIT TACTICS SERVICE
 * ============================================================================
 * Law enforcement AI unit coordinator:
 * - Wanted Heat Level 1-5 escalation parameters
 * - Cruiser deployment (Crown Vic, Charger Interceptor, Corvette ZR1, Rhino Heavy)
 * - Roadblock placements, spike strip traps, police helicopter spotlight tracking
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { WantedRecordEntity, PursuitCruiserUnit } from '../../database/entities/WantedRecordEntity.js';
import { PoliceInfractionEntity } from '../../database/entities/PoliceInfractionEntity.js';
import { VehicleEntity } from '../../database/entities/VehicleEntity.js';
import { UserEntity } from '../../database/entities/UserEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class PoliceDispatchService {
  constructor(private database: DatabaseClient = db) {}

  public async triggerPursuit(
    driverId: string,
    vehicleId: string,
    initialHeat: 1 | 2 | 3 | 4 | 5 = 1,
    district: any = 'DOWNTOWN_METROPOLIS',
    coords: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
  ): Promise<WantedRecordEntity> {
    const driver = await this.database.findById<UserEntity>('users', driverId);
    if (!driver) throw HttpError.notFound('Driver not found');

    const vehicle = await this.database.findById<VehicleEntity>('vehicles', vehicleId);
    if (!vehicle) throw HttpError.notFound('Vehicle not found');

    // Generate initial cruisers based on heat
    const cruisers: PursuitCruiserUnit[] = [];
    const count = initialHeat * 2;
    for (let i = 0; i < count; i++) {
      let type: PursuitCruiserUnit['unitType'] = 'CROWN_VICTORIA_PATROL';
      if (initialHeat >= 3) type = 'CHARGER_INTERCEPTOR';
      if (initialHeat >= 5) type = 'CORVETTE_PURSUIT';

      cruisers.push({
        unitId: `cruiser_${Date.now()}_${i}`,
        unitType: type,
        callsign: `METRO-${10 + i}`,
        distanceToSuspectM: 150 + i * 40,
        damagePct: 0,
        hasLineOfSight: true,
      });
    }

    const record = await this.database.insert<WantedRecordEntity>('wanted_records', {
      driverId,
      driverUsername: driver.username,
      vehicleId,
      vehiclePlate: vehicle.licensePlate,
      heatLevel: initialHeat,
      bountyRewardCredits: initialHeat * 5000,
      pursuitDurationSeconds: 0,
      lastKnownDistrict: district,
      lastKnownCoords: coords,
      searchRadiusMeters: initialHeat * 300,
      activeCruisersJson: JSON.stringify(cruisers),
      roadblocksDeployed: initialHeat >= 3 ? 2 : 0,
      spikeStripsDeployed: initialHeat >= 4 ? 1 : 0,
      helicopterActive: initialHeat >= 4,
      evasionCooldownRemainingSeconds: 30,
      status: 'ACTIVE_PURSUIT',
      startedAt: new Date().toISOString(),
    });

    return record;
  }

  public async getActivePursuit(driverId: string): Promise<WantedRecordEntity | null> {
    return this.database.findOne<WantedRecordEntity>('wanted_records', {
      driverId,
      status: 'ACTIVE_PURSUIT',
    });
  }

  public async evadePursuit(pursuitId: string): Promise<WantedRecordEntity> {
    const pursuit = await this.database.findById<WantedRecordEntity>('wanted_records', pursuitId);
    if (!pursuit) throw HttpError.notFound('Pursuit record not found');

    const updated = await this.database.update<WantedRecordEntity>('wanted_records', pursuitId, {
      status: 'EVADED_SUCCESS',
      endedAt: new Date().toISOString(),
    });

    // Award evasion cash reward
    const user = await this.database.findById<UserEntity>('users', pursuit.driverId);
    if (user) {
      await this.database.update<UserEntity>('users', pursuit.driverId, {
        cashBalance: user.cashBalance + pursuit.bountyRewardCredits,
      });
    }

    return updated!;
  }

  public async arrestDriver(pursuitId: string): Promise<{
    pursuit: WantedRecordEntity;
    infraction: PoliceInfractionEntity;
    fineAmount: number;
  }> {
    const pursuit = await this.database.findById<WantedRecordEntity>('wanted_records', pursuitId);
    if (!pursuit) throw HttpError.notFound('Pursuit record not found');

    const fine = pursuit.heatLevel * 2500;

    const updated = await this.database.update<WantedRecordEntity>('wanted_records', pursuitId, {
      status: 'BUSTED_ARRESTED',
      endedAt: new Date().toISOString(),
    });

    // Impound vehicle
    await this.database.update<VehicleEntity>('vehicles', pursuit.vehicleId, {
      isImpounded: true,
      isInGarage: false,
    });

    // Create infraction
    const infraction = await this.database.insert<PoliceInfractionEntity>('police_infractions', {
      citationNumber: `CIT-EVADE-${Date.now()}`,
      driverId: pursuit.driverId,
      driverUsername: pursuit.driverUsername,
      vehicleId: pursuit.vehicleId,
      vehiclePlate: pursuit.vehiclePlate,
      violationType: 'EVADING_POLICE_PURSUIT',
      district: pursuit.lastKnownDistrict,
      fineAmount: fine,
      penaltyPoints: pursuit.heatLevel * 2,
      isPaid: false,
      isImpoundedVehicle: true,
      pursuitDurationSeconds: pursuit.pursuitDurationSeconds,
      issuedAt: new Date().toISOString(),
    });

    return {
      pursuit: updated!,
      infraction,
      fineAmount: fine,
    };
  }
}
