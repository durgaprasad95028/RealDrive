/**
 * ============================================================================
 * REALDRIVE AUTH MODULE — JWT AUTHENTICATION TOKEN SERVICE
 * ============================================================================
 * HMAC-SHA256 signed JSON Web Tokens (JWT) for stateless session authentication,
 * access token signing, refresh token rotation, and claims validation.
 */

import crypto from 'crypto';
import { ConfigManager } from '../../core/ConfigManager.js';

export interface JwtPayload {
  sub: string; // User ID
  username: string;
  email: string;
  role: 'player' | 'admin' | 'moderator' | 'marshal';
  driverLevel: number;
  sessionId: string;
  iat: number;
  exp: number;
}

export class JwtService {
  private static base64UrlEncode(str: string | Buffer): string {
    const base64 = (Buffer.isBuffer(str) ? str : Buffer.from(str)).toString('base64');
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  private static base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  public static sign(
    payload: Omit<JwtPayload, 'iat' | 'exp'>,
    expiresInSeconds: number = 86400 // 24 hours
  ): string {
    const secret = ConfigManager.getInstance().jwtSecret;
    const now = Math.floor(Date.now() / 1000);

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const fullPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const encodedHeader = JwtService.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = JwtService.base64UrlEncode(JSON.stringify(fullPayload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac('sha256', secret)
      .update(signatureInput)
      .digest();
    const encodedSignature = JwtService.base64UrlEncode(signature);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  public static verify(token: string): { valid: boolean; payload?: JwtPayload; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid JWT format' };
      }

      const [encodedHeader, encodedPayload, encodedSignature] = parts;
      const secret = ConfigManager.getInstance().jwtSecret;
      const signatureInput = `${encodedHeader}.${encodedPayload}`;

      const expectedSignature = JwtService.base64UrlEncode(
        crypto.createHmac('sha256', secret).update(signatureInput).digest()
      );

      if (encodedSignature !== expectedSignature) {
        return { valid: false, error: 'Invalid JWT signature' };
      }

      const payloadStr = JwtService.base64UrlDecode(encodedPayload);
      const payload: JwtPayload = JSON.parse(payloadStr);

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return { valid: false, error: 'JWT token has expired' };
      }

      return { valid: true, payload };
    } catch (err: any) {
      return { valid: false, error: err.message || 'JWT parsing error' };
    }
  }
}
