/**
 * ============================================================================
 * REALDRIVE CLIENT API — VEHICLES & TUNING CLIENT
 * ============================================================================
 */

import { api } from './ApiClient';

export class VehicleApiClient {
  public static async getShowroomCatalog(): Promise<{ vehicles: any[]; total: number }> {
    return api.get('/vehicles/catalog');
  }

  public static async getOwnedVehicles(): Promise<{ vehicles: any[]; count: number }> {
    return api.get('/vehicles/owned');
  }

  public static async getVehicleDetails(vehicleId: string): Promise<any> {
    return api.get(`/vehicles/${vehicleId}`);
  }

  public static async buyVehicle(vehicleId: string, color?: string): Promise<any> {
    return api.post(`/vehicles/${vehicleId}/buy`, { color });
  }

  public static async runDynoTest(vehicleId: string): Promise<any> {
    return api.get(`/vehicles/${vehicleId}/dyno`);
  }

  public static async tuneVehicle(vehicleId: string, tuningUpdates: any): Promise<any> {
    return api.put(`/vehicles/${vehicleId}/tune`, tuningUpdates);
  }

  public static async getTuningPartsCatalog(): Promise<{ parts: any[] }> {
    return api.get('/vehicles/tuning/parts');
  }

  public static async recordTelemetry(vehicleId: string, telemetryData: any): Promise<any> {
    return api.post(`/vehicles/${vehicleId}/telemetry`, telemetryData);
  }
}
