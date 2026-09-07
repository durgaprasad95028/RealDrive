/**
 * ============================================================================
 * REALDRIVE VEHICLES — VEHICLE DATA REPOSITORY
 * ============================================================================
 * Database queries for owned garage vehicles, vehicle catalog, mechanical tunings,
 * and high-frequency telemetry session records.
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { VehicleEntity } from '../../database/entities/VehicleEntity.js';
import { VehicleTuningEntity } from '../../database/entities/VehicleTuningEntity.js';
import { VehicleTelemetryEntity } from '../../database/entities/VehicleTelemetryEntity.js';

export class VehicleRepository {
  constructor(private database: DatabaseClient = db) {}

  public async findById(id: string): Promise<VehicleEntity | null> {
    return this.database.findById<VehicleEntity>('vehicles', id);
  }

  public async findByOwnerId(ownerId: string): Promise<VehicleEntity[]> {
    return this.database.findMany<VehicleEntity>('vehicles', { ownerId });
  }

  public async getShowroomCatalog(): Promise<VehicleEntity[]> {
    const q = this.database.query<VehicleEntity>('vehicles');
    q.whereNull('ownerId');
    return this.database.executeQuery(q);
  }

  public async createVehicle(data: Partial<VehicleEntity>): Promise<VehicleEntity> {
    return this.database.insert<VehicleEntity>('vehicles', data);
  }

  public async updateVehicle(id: string, updates: Partial<VehicleEntity>): Promise<VehicleEntity | null> {
    return this.database.update<VehicleEntity>('vehicles', id, updates);
  }

  public async findTuningByVehicleId(vehicleId: string): Promise<VehicleTuningEntity | null> {
    return this.database.findOne<VehicleTuningEntity>('vehicle_tunings', { vehicleId });
  }

  public async saveTuning(vehicleId: string, tuningData: Partial<VehicleTuningEntity>): Promise<VehicleTuningEntity> {
    const existing = await this.findTuningByVehicleId(vehicleId);
    if (existing) {
      return (await this.database.update<VehicleTuningEntity>('vehicle_tunings', existing.id, tuningData))!;
    }
    return this.database.insert<VehicleTuningEntity>('vehicle_tunings', { ...tuningData, vehicleId });
  }

  public async saveTelemetryLog(logData: Partial<VehicleTelemetryEntity>): Promise<VehicleTelemetryEntity> {
    return this.database.insert<VehicleTelemetryEntity>('vehicle_telemetry_logs', logData);
  }

  public async getTelemetryHistory(vehicleId: string, limit: number = 10): Promise<VehicleTelemetryEntity[]> {
    const q = this.database.query<VehicleTelemetryEntity>('vehicle_telemetry_logs');
    q.where('vehicleId', '=', vehicleId);
    q.limit(limit);
    return this.database.executeQuery(q);
  }
}
