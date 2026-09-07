/**
 * ============================================================================
 * REALDRIVE ENTITY — USER ENTITY
 * ============================================================================
 * Player account entity, credentials, authentication security metadata,
 * role-based access control (RBAC), and session state.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface UserEntity {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'player' | 'admin' | 'moderator' | 'marshal';
  driverLevel: number;
  driverXp: number;
  cashBalance: number;
  bankBalance: number;
  reputationPoints: number;
  safetyRating: number; // 0.0 to 5.0
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  emailVerified: boolean;
  isBanned: boolean;
  banReason?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export const UserSchema: TableSchema<UserEntity> = {
  name: 'users',
  primaryKey: 'id',
  indexes: ['driverLevel', 'role', 'reputationPoints'],
  uniqueKeys: ['username', 'email'],
  timestamps: true,
  softDeletes: true,
};
