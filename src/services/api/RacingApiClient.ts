/**
 * ============================================================================
 * REALDRIVE CLIENT API — RACING & TOURNAMENT CLIENT
 * ============================================================================
 */

import { api } from './ApiClient';

export class RacingApiClient {
  public static async getTournaments(): Promise<{ tournaments: any[]; count: number }> {
    return api.get('/racing/tournaments');
  }

  public static async getTournament(id: string): Promise<any> {
    return api.get(`/racing/tournaments/${id}`);
  }

  public static async registerForTournament(tournamentId: string, vehicleId: string): Promise<any> {
    return api.post(`/racing/tournaments/${tournamentId}/register`, { vehicleId });
  }

  public static async getLeaderboard(category?: string): Promise<{ category: string; scores: any[]; count: number }> {
    return api.get('/racing/leaderboards', { category });
  }

  public static async submitLeaderboardScore(data: {
    category: string;
    score: number;
    formattedScore: string;
    vehicleName: string;
    district?: string;
  }): Promise<any> {
    return api.post('/racing/leaderboards', data);
  }

  public static async getTracks(district?: string): Promise<{ tracks: any[]; count: number }> {
    return api.get('/racing/tracks', { district });
  }

  public static async createTrack(trackData: any): Promise<any> {
    return api.post('/racing/tracks', trackData);
  }
}
