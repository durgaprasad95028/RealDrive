/**
 * ============================================================================
 * REALDRIVE CLIENT API — CAREER & LOGISTICS CLIENT
 * ============================================================================
 */

import { api } from './ApiClient';

export class CareerApiClient {
  public static async getProfile(): Promise<any> {
    return api.get('/career/profile');
  }

  public static async getAvailableRideshareFares(): Promise<{ fares: any[]; count: number }> {
    return api.get('/career/rideshare/available');
  }

  public static async acceptRideshareFare(fareId: string): Promise<any> {
    return api.post(`/career/rideshare/${fareId}/accept`);
  }

  public static async completeRideshareFare(fareId: string, smoothnessScorePct: number): Promise<any> {
    return api.post(`/career/rideshare/${fareId}/complete`, { smoothnessScorePct });
  }

  public static async getFreightContracts(): Promise<{ contracts: any[]; count: number }> {
    return api.get('/career/freight/contracts');
  }

  public static async acceptFreightContract(contractId: string): Promise<any> {
    return api.post(`/career/freight/${contractId}/accept`);
  }

  public static async deliverFreight(contractId: string, cargoHealthPct: number): Promise<any> {
    return api.post(`/career/freight/${contractId}/deliver`, { cargoHealthPct });
  }

  public static async getExpressOrders(): Promise<{ orders: any[]; count: number }> {
    return api.get('/career/express/orders');
  }

  public static async claimExpressOrder(orderId: string): Promise<any> {
    return api.post(`/career/express/${orderId}/claim`);
  }

  public static async deliverExpressOrder(orderId: string, elapsedSeconds: number, shockBumpsCount: number): Promise<any> {
    return api.post(`/career/express/${orderId}/deliver`, { elapsedSeconds, shockBumpsCount });
  }
}
