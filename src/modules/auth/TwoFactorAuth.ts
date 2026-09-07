/**
 * ============================================================================
 * REALDRIVE AUTH MODULE — TWO FACTOR AUTHENTICATION (TOTP)
 * ============================================================================
 * RFC-6238 compliant Time-based One-Time Password (TOTP) generator & validator
 * for Google Authenticator / 1Password / Authy app pairing.
 */

import crypto from 'crypto';

export class TwoFactorAuth {
  private static readonly TIME_STEP_SECONDS = 30;
  private static readonly DIGITS = 6;

  public static generateSecret(): string {
    return crypto.randomBytes(20).toString('hex');
  }

  public static generateTotpToken(secretHex: string, timeOffsetSteps: number = 0): string {
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / TwoFactorAuth.TIME_STEP_SECONDS) + timeOffsetSteps;

    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigInt64BE(BigInt(counter));

    const secretBuffer = Buffer.from(secretHex, 'hex');
    const hmac = crypto.createHmac('sha1', secretBuffer).update(counterBuffer).digest();

    const offset = hmac[hmac.length - 1] & 0xf;
    const code =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    const otp = code % Math.pow(10, TwoFactorAuth.DIGITS);
    return otp.toString().padStart(TwoFactorAuth.DIGITS, '0');
  }

  public static verifyToken(secretHex: string, userToken: string, windowSteps: number = 1): boolean {
    const cleanToken = userToken.trim();
    for (let step = -windowSteps; step <= windowSteps; step++) {
      const expectedToken = TwoFactorAuth.generateTotpToken(secretHex, step);
      if (cleanToken === expectedToken) {
        return true;
      }
    }
    return false;
  }
}
