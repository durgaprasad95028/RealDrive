/**
 * ============================================================================
 * REALDRIVE AUTH MODULE — AUTHENTICATION SERVICE
 * ============================================================================
 * Business logic for user registration, login verification, JWT token issuance,
 * profile retrieval, password changing, and 2FA authentication.
 */

import { AuthRepository } from './AuthRepository.js';
import { PasswordHasher } from './PasswordHasher.js';
import { JwtService } from './JwtService.js';
import { TwoFactorAuth } from './TwoFactorAuth.js';
import { HttpError } from '../../core/HttpTypes.js';
import { LoggerService } from '../../core/LoggerService.js';
import { EventBus } from '../../core/EventBus.js';
import crypto from 'crypto';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  countryCode?: string;
}

export interface LoginDto {
  username: string;
  password: string;
  twoFactorCode?: string;
}

export interface AuthResult {
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

export class AuthService {
  private logger = LoggerService.getInstance().createScopedLogger('AuthService');

  constructor(
    private authRepo: AuthRepository = new AuthRepository(),
    private eventBus: EventBus = EventBus.getInstance()
  ) {}

  public async register(dto: RegisterDto): Promise<AuthResult> {
    const cleanUsername = dto.username.trim().toLowerCase();
    const cleanEmail = dto.email.trim().toLowerCase();

    // Check strength
    const strength = PasswordHasher.validatePasswordStrength(dto.password);
    if (!strength.valid) {
      throw HttpError.badRequest(strength.errors.join(' '));
    }

    // Check existing
    const existingUser = await this.authRepo.findByUsername(cleanUsername);
    if (existingUser) {
      throw HttpError.conflict(`Username "${cleanUsername}" is already taken.`);
    }

    const existingEmail = await this.authRepo.findByEmail(cleanEmail);
    if (existingEmail) {
      throw HttpError.conflict(`Email "${cleanEmail}" is already registered.`);
    }

    // Hash password
    const salt = PasswordHasher.generateSalt();
    const passwordHash = PasswordHasher.hashPassword(dto.password, salt);

    // Create user
    const newUser = await this.authRepo.createUser({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      salt,
      role: 'player',
      driverLevel: 1,
      driverXp: 0,
      cashBalance: 25000, // Starter cash
      bankBalance: 50000, // Starter bank deposit
      reputationPoints: 100,
      safetyRating: 5.0,
      twoFactorEnabled: false,
      emailVerified: true,
      isBanned: false,
    });

    // Create default profile
    const profile = await this.authRepo.createProfile({
      userId: newUser.id,
      displayName: cleanUsername,
      avatarUrl: '/avatars/driver_default.png',
      bio: 'New RealDrive pilot.',
      countryCode: dto.countryCode || 'US',
      racingLicenseGrade: 'ROOKIE_D',
      totalRacesFinished: 0,
      totalRacesWon: 0,
      totalPodiums: 0,
      totalDriftScore: 0,
      totalDistanceDrivenKm: 0,
      preferredCameraView: 'COCKPIT_FIRST_PERSON',
      unitsPreference: 'METRIC_KMH',
      steeringAssists: {
        abs: true,
        tractionControl: true,
        stabilityControl: true,
        autoClutch: true,
        racingLineGuide: true,
      },
      audioMix: {
        engineVolume: 1.0,
        tireScreechVolume: 0.8,
        windTurboVolume: 0.8,
        ambientTrafficVolume: 0.6,
        uiSoundVolume: 0.7,
      },
    });

    // Create bank account
    await this.authRepo.createBankAccount({
      userId: newUser.id,
      accountNumber: `RD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      routingNumber: '09100001',
      accountType: 'CHECKING',
      currency: 'RDC',
      balance: 50000,
      availableBalance: 50000,
      escrowLockedBalance: 0,
      annualInterestRatePct: 3.5,
      overdraftLimit: 10000,
      creditScore: 650,
      isFrozen: false,
      openedAt: new Date().toISOString(),
    });

    const sessionId = crypto.randomUUID();
    const token = JwtService.sign({
      sub: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      driverLevel: newUser.driverLevel,
      sessionId,
    });

    this.eventBus.emit('auth.user_registered', { userId: newUser.id, username: newUser.username });

    return {
      accessToken: token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        driverLevel: newUser.driverLevel,
        cashBalance: newUser.cashBalance,
        bankBalance: newUser.bankBalance,
        safetyRating: newUser.safetyRating,
      },
      profile,
    };
  }

  public async login(dto: LoginDto, clientIp: string = '127.0.0.1'): Promise<AuthResult> {
    const cleanUsername = dto.username.trim().toLowerCase();
    const user = await this.authRepo.findByUsername(cleanUsername);

    if (!user) {
      throw HttpError.unauthorized('Invalid username or password credentials.');
    }

    if (user.isBanned) {
      throw HttpError.forbidden(`Your account has been suspended. Reason: ${user.banReason || 'Rule violation'}`);
    }

    const isValidPassword = PasswordHasher.verifyPassword(dto.password, user.salt, user.passwordHash);
    if (!isValidPassword) {
      this.logger.warn(`Failed login attempt for user "${cleanUsername}" from IP ${clientIp}`);
      throw HttpError.unauthorized('Invalid username or password credentials.');
    }

    if (user.twoFactorEnabled && user.twoFactorSecret) {
      if (!dto.twoFactorCode) {
        throw HttpError.unauthorized('Two-factor authentication code required.', { requires2FA: true });
      }
      const is2faValid = TwoFactorAuth.verifyToken(user.twoFactorSecret, dto.twoFactorCode);
      if (!is2faValid) {
        throw HttpError.unauthorized('Invalid 2FA code provided.');
      }
    }

    // Update last login
    await this.authRepo.updateUser(user.id, {
      lastLoginAt: new Date().toISOString(),
      lastLoginIp: clientIp,
    });

    const profile = await this.authRepo.findProfileByUserId(user.id);
    const sessionId = crypto.randomUUID();

    const token = JwtService.sign({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      driverLevel: user.driverLevel,
      sessionId,
    });

    this.eventBus.emit('auth.user_logged_in', { userId: user.id, username: user.username, ip: clientIp });

    return {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        driverLevel: user.driverLevel,
        cashBalance: user.cashBalance,
        bankBalance: user.bankBalance,
        safetyRating: user.safetyRating,
      },
      profile,
    };
  }

  public async getCurrentUser(userId: string): Promise<any> {
    const user = await this.authRepo.findById(userId);
    if (!user) {
      throw HttpError.notFound('User record not found.');
    }

    const profile = await this.authRepo.findProfileByUserId(userId);
    const bankAccount = await this.authRepo.findBankAccountByUserId(userId);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        driverLevel: user.driverLevel,
        driverXp: user.driverXp,
        cashBalance: user.cashBalance,
        bankBalance: user.bankBalance,
        reputationPoints: user.reputationPoints,
        safetyRating: user.safetyRating,
        twoFactorEnabled: user.twoFactorEnabled,
        lastLoginAt: user.lastLoginAt,
      },
      profile,
      bankAccount,
    };
  }

  public async updateProfile(userId: string, updates: any): Promise<any> {
    return this.authRepo.updateProfile(userId, updates);
  }

  public async setupTwoFactor(userId: string): Promise<{ secret: string; otpAuthUrl: string }> {
    const secret = TwoFactorAuth.generateSecret();
    const user = await this.authRepo.findById(userId);
    if (!user) throw HttpError.notFound('User not found');

    await this.authRepo.updateUser(userId, { twoFactorSecret: secret });

    const otpAuthUrl = `otpauth://totp/RealDrive:${user.username}?secret=${secret}&issuer=RealDrive`;
    return { secret, otpAuthUrl };
  }

  public async verifyAndEnableTwoFactor(userId: string, code: string): Promise<boolean> {
    const user = await this.authRepo.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw HttpError.badRequest('Two-factor setup has not been initiated.');
    }

    const valid = TwoFactorAuth.verifyToken(user.twoFactorSecret, code);
    if (!valid) {
      throw HttpError.badRequest('Invalid verification code.');
    }

    await this.authRepo.updateUser(userId, { twoFactorEnabled: true });
    return true;
  }
}
