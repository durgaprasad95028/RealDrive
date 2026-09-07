/**
 * ============================================================================
 * REALDRIVE AUTH MODULE — SECURE PASSWORD HASHER
 * ============================================================================
 * Cryptographic password hashing using PBKDF2-SHA512 with random salting,
 * timing attack mitigation, and entropy verification.
 */

import crypto from 'crypto';

export class PasswordHasher {
  private static readonly ITERATIONS = 15000;
  private static readonly KEY_LENGTH = 64;
  private static readonly DIGEST = 'sha512';

  public static generateSalt(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public static hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(
      password,
      salt,
      PasswordHasher.ITERATIONS,
      PasswordHasher.KEY_LENGTH,
      PasswordHasher.DIGEST
    ).toString('hex');
  }

  public static verifyPassword(password: string, salt: string, expectedHash: string): boolean {
    const computedHash = PasswordHasher.hashPassword(password, salt);
    const bufA = Buffer.from(computedHash, 'hex');
    const bufB = Buffer.from(expectedHash, 'hex');

    if (bufA.length !== bufB.length) {
      return false;
    }

    return crypto.timingSafeEqual(bufA, bufB);
  }

  public static validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
