/**
 * ============================================================================
 * REALDRIVE AUTH MODULE — AUTHENTICATION REPOSITORY
 * ============================================================================
 * Data access layer for user accounts, profiles, sessions, and credentials.
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { UserEntity } from '../../database/entities/UserEntity.js';
import { UserProfileEntity } from '../../database/entities/UserProfileEntity.js';
import { BankAccountEntity } from '../../database/entities/BankAccountEntity.js';

export class AuthRepository {
  constructor(private database: DatabaseClient = db) {}

  public async findByUsername(username: string): Promise<UserEntity | null> {
    return this.database.findOne<UserEntity>('users', { username });
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return this.database.findOne<UserEntity>('users', { email });
  }

  public async findById(id: string): Promise<UserEntity | null> {
    return this.database.findById<UserEntity>('users', id);
  }

  public async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    return this.database.insert<UserEntity>('users', userData);
  }

  public async updateUser(id: string, updates: Partial<UserEntity>): Promise<UserEntity | null> {
    return this.database.update<UserEntity>('users', id, updates);
  }

  public async findProfileByUserId(userId: string): Promise<UserProfileEntity | null> {
    return this.database.findOne<UserProfileEntity>('user_profiles', { userId });
  }

  public async createProfile(profileData: Partial<UserProfileEntity>): Promise<UserProfileEntity> {
    return this.database.insert<UserProfileEntity>('user_profiles', profileData);
  }

  public async updateProfile(userId: string, updates: Partial<UserProfileEntity>): Promise<UserProfileEntity | null> {
    const existing = await this.findProfileByUserId(userId);
    if (!existing) return null;
    return this.database.update<UserProfileEntity>('user_profiles', existing.id, updates);
  }

  public async findBankAccountByUserId(userId: string): Promise<BankAccountEntity | null> {
    return this.database.findOne<BankAccountEntity>('bank_accounts', { userId });
  }

  public async createBankAccount(accountData: Partial<BankAccountEntity>): Promise<BankAccountEntity> {
    return this.database.insert<BankAccountEntity>('bank_accounts', accountData);
  }
}
