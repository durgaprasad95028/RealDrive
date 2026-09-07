/**
 * ============================================================================
 * REALDRIVE RACING — TOURNAMENT LEAGUE & CHAMPIONSHIP SERVICE
 * ============================================================================
 * Grand Prix Championships, GT3 Endurance cups, Street Outlaw showdowns:
 * - Qualifying grid positions & time penalties
 * - Points standings calculation (25-18-15-12-10-8-6-4-2-1)
 * - Prize pool escrow allocations & trophy distribution
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { RaceTournamentEntity } from '../../database/entities/RaceTournamentEntity.js';
import { RaceEntryEntity } from '../../database/entities/RaceEntryEntity.js';
import { UserEntity } from '../../database/entities/UserEntity.js';
import { VehicleEntity } from '../../database/entities/VehicleEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class TournamentLeagueService {
  constructor(private database: DatabaseClient = db) {}

  public async getActiveTournaments(): Promise<RaceTournamentEntity[]> {
    return this.database.findMany<RaceTournamentEntity>('race_tournaments');
  }

  public async getTournamentById(id: string): Promise<RaceTournamentEntity | null> {
    return this.database.findById<RaceTournamentEntity>('race_tournaments', id);
  }

  public async registerDriver(
    tournamentId: string,
    driverUserId: string,
    vehicleId: string
  ): Promise<RaceEntryEntity> {
    const tournament = await this.getTournamentById(tournamentId);
    if (!tournament) throw HttpError.notFound('Tournament not found');

    if (tournament.registeredDriversCount >= tournament.maxGridSlots) {
      throw HttpError.badRequest('Tournament grid is completely full.');
    }

    const driver = await this.database.findById<UserEntity>('users', driverUserId);
    if (!driver) throw HttpError.notFound('Driver not found');

    const vehicle = await this.database.findById<VehicleEntity>('vehicles', vehicleId);
    if (!vehicle) throw HttpError.notFound('Vehicle not found');

    if (tournament.allowedVehicleClasses.length > 0 && !tournament.allowedVehicleClasses.includes(vehicle.vehicleClass)) {
      throw HttpError.badRequest(`Vehicle class "${vehicle.vehicleClass}" is not eligible for this tournament. Allowed: ${tournament.allowedVehicleClasses.join(', ')}`);
    }

    // Check entry fee
    if (tournament.entryFeeCredits > 0) {
      if (driver.cashBalance < tournament.entryFeeCredits) {
        throw HttpError.badRequest(`Insufficient cash balance for entry fee of ${tournament.entryFeeCredits} credits.`);
      }

      await this.database.update<UserEntity>('users', driverUserId, {
        cashBalance: driver.cashBalance - tournament.entryFeeCredits,
      });
    }

    const startingPos = tournament.registeredDriversCount + 1;

    const entry = await this.database.insert<RaceEntryEntity>('race_entries', {
      tournamentId,
      driverId: driverUserId,
      driverUsername: driver.username,
      vehicleId: vehicle.id,
      vehicleModelName: vehicle.name,
      startingGridPosition: startingPos,
      lapsCompleted: 0,
      pitStopsCount: 0,
      penaltiesTimeSeconds: 0,
      disqualified: false,
      prizeMoneyWon: 0,
      championshipPointsEarned: 0,
      status: 'REGISTERED',
      createdAt: new Date().toISOString(),
    });

    await this.database.update<RaceTournamentEntity>('race_tournaments', tournamentId, {
      registeredDriversCount: tournament.registeredDriversCount + 1,
    });

    return entry;
  }

  public async getTournamentEntries(tournamentId: string): Promise<RaceEntryEntity[]> {
    return this.database.findMany<RaceEntryEntity>('race_entries', { tournamentId });
  }
}
