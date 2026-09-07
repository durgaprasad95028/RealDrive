/**
 * ============================================================================
 * REALDRIVE ENTITY — ACHIEVEMENTS & TROPHIES ENTITY
 * ============================================================================
 * Player trophies, milestone unlock criteria, custom badge iconography,
 * bonus cash and driver XP rewards.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface AchievementEntity {
  id: string;
  achievementKey: string;
  title: string;
  description: string;
  category: 'DRIVING_MASTERY' | 'CAREER_LOGISTICS' | 'WEALTH_EXPANSION' | 'POLICE_OUTLAW' | 'TUNING_CREATIVITY' | 'RACING_CHAMPION';
  iconKey: string;
  rewardCredits: number;
  rewardDriverXp: number;
  isSecret: boolean;
  requiredMetric: string;
  targetThresholdValue: number;
  createdAt: string;
}

export interface UserAchievementProgressEntity {
  id: string;
  userId: string;
  achievementId: string;
  currentProgressValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export const AchievementSchema: TableSchema<AchievementEntity> = {
  name: 'achievements',
  primaryKey: 'id',
  indexes: ['category', 'isSecret'],
  uniqueKeys: ['achievementKey'],
  timestamps: false,
  softDeletes: false,
};

export const UserAchievementProgressSchema: TableSchema<UserAchievementProgressEntity> = {
  name: 'user_achievement_progress',
  primaryKey: 'id',
  indexes: ['userId', 'achievementId', 'isUnlocked'],
  foreignKeys: [
    {
      field: 'userId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
    {
      field: 'achievementId',
      referencesTable: 'achievements',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
