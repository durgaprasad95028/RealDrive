/**
 * ============================================================================
 * REALDRIVE CLIENT API — POLICE & CITATION CLIENT
 * ============================================================================
 */

import { api } from './ApiClient';

export class PoliceApiClient {
  public static async getTickets(): Promise<{ tickets: any[]; count: number }> {
    return api.get('/police/tickets');
  }

  public static async triggerSpeedFlash(data: {
    cameraTrapId: string;
    cameraLocationName: string;
    district: string;
    vehiclePlate: string;
    vehicleModelName: string;
    driverId?: string;
    speedLimitKmh: number;
    recordedSpeedKmh: number;
  }): Promise<any> {
    return api.post('/police/tickets/flash', data);
  }

  public static async payTicket(ticketId: string): Promise<any> {
    return api.post(`/police/tickets/${ticketId}/pay`);
  }

  public static async getWantedStatus(): Promise<{ inPursuit: boolean; wantedRecord: any }> {
    return api.get('/police/wanted');
  }

  public static async triggerWantedPursuit(data: {
    vehicleId: string;
    heatLevel: number;
    district: string;
    coords: { x: number; y: number; z: number };
  }): Promise<any> {
    return api.post('/police/wanted/trigger', data);
  }

  public static async evadePursuit(pursuitId: string): Promise<any> {
    return api.post(`/police/wanted/${pursuitId}/evade`);
  }

  public static async arrestDriver(pursuitId: string): Promise<any> {
    return api.post(`/police/wanted/${pursuitId}/arrest`);
  }
}
