/**
 * ============================================================================
 * REALDRIVE TESTS — AUTHENTICATION & SECURITY TEST SUITE
 * ============================================================================
 * Unit & integration tests for user registration, Argon2/PBKDF2 password hashing,
 * JWT token signing and verification, and TOTP 2FA multi-factor authentication.
 */

import { PasswordHasher } from '../modules/auth/PasswordHasher.js';
import { JwtService } from '../modules/auth/JwtService.js';
import { TwoFactorAuth } from '../modules/auth/TwoFactorAuth.js';
import { DatabaseClient } from '../database/DatabaseClient.js';
import { DatabaseSeeder } from '../database/DatabaseSeeder.js';
import { AuthService } from '../modules/auth/AuthService.js';

export async function runAuthTestSuite(): Promise<{ passed: number; failed: number; tests: string[] }> {
  const tests: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      tests.push(`[PASS] ${testName}`);
      passed++;
    } else {
      tests.push(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Password Hasher
  const salt = PasswordHasher.generateSalt();
  const hash1 = PasswordHasher.hashPassword('MySecurePass123!', salt);
  const verifyValid = PasswordHasher.verifyPassword('MySecurePass123!', salt, hash1);
  const verifyInvalid = PasswordHasher.verifyPassword('WrongPass', salt, hash1);
  assert(verifyValid === true, 'PasswordHasher verifies correct password');
  assert(verifyInvalid === false, 'PasswordHasher rejects incorrect password');

  // Test 2: JWT Service
  const token = JwtService.sign({
    sub: 'usr_test_123',
    username: 'testpilot',
    email: 'test@realdrive.game',
    role: 'player',
    driverLevel: 5,
    sessionId: 'sess_1',
  }, 3600);

  const verification = JwtService.verify(token);
  assert(verification.valid === true, 'JwtService verifies valid HMAC-SHA256 signature');
  assert(verification.payload?.username === 'testpilot', 'JwtService decodes claims correctly');

  // Test 3: Two Factor Authentication TOTP
  const secret = TwoFactorAuth.generateSecret();
  const currentToken = TwoFactorAuth.generateTotpToken(secret, 0);
  const is2faValid = TwoFactorAuth.verifyToken(secret, currentToken);
  assert(is2faValid === true, 'TwoFactorAuth generates and verifies RFC-6238 TOTP tokens');

  // Test 4: AuthService full register & login flow
  const testDb = DatabaseClient.getInstance();
  DatabaseSeeder.registerAllSchemas(testDb);
  const authService = new AuthService();

  try {
    const regResult = await authService.register({
      username: `pilot_${Date.now()}`,
      email: `pilot_${Date.now()}@realdrive.test`,
      password: 'password123',
    });
    assert(regResult.accessToken.length > 20, 'AuthService.register creates user and returns JWT');

    const loginResult = await authService.login({
      username: regResult.user.username,
      password: 'password123',
    });
    assert(loginResult.user.username === regResult.user.username, 'AuthService.login authenticates user');
  } catch (err: any) {
    assert(false, `AuthService flow error: ${err.message}`);
  }

  return { passed, failed, tests };
}
