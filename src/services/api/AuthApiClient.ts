/**
 * ============================================================================
 * REALDRIVE CLIENT API — AUTHENTICATION CLIENT
 * ============================================================================
 */

import { api } from './ApiClient';

export interface UserAuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    driverLevel: number;
    cashBalance: number;
    bankBalance: number;
    safetyRating: number;
  };
  profile: any;
}

export class AuthApiClient {
  public static async login(username: string, password: string, twoFactorCode?: string): Promise<UserAuthResponse> {
    const res = await api.post<UserAuthResponse>('/auth/login', { username, password, twoFactorCode });
    if (res.accessToken) {
      api.setToken(res.accessToken);
    }
    return res;
  }

  public static async register(username: string, email: string, password: string, countryCode: string = 'US'): Promise<UserAuthResponse> {
    const res = await api.post<UserAuthResponse>('/auth/register', { username, email, password, countryCode });
    if (res.accessToken) {
      api.setToken(res.accessToken);
    }
    return res;
  }

  public static async getCurrentUser(): Promise<any> {
    return api.get('/auth/me');
  }

  public static async updateProfile(profileUpdates: any): Promise<any> {
    return api.put('/auth/profile', profileUpdates);
  }

  public static async setup2FA(): Promise<{ secret: string; otpAuthUrl: string }> {
    return api.post('/auth/2fa/setup');
  }

  public static async verify2FA(code: string): Promise<{ success: boolean; message: string }> {
    return api.post('/auth/2fa/verify', { code });
  }

  public static async logout(): Promise<void> {
    await api.post('/auth/logout');
    api.setToken(null);
  }
}
