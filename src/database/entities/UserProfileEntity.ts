/**
 * ============================================================================
 * REALDRIVE ENTITY — USER PROFILE ENTITY
 * ============================================================================
 * Driver biography, avatar customization, license certifications,
 * trophy cabinet, racing team affiliations, and HUD telemetry preferences.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface UserProfileEntity {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  countryCode: string;
  racingLicenseGrade: 'ROOKIE_D' | 'AMATEUR_C' | 'PRO_B' | 'MASTER_A' | 'SUPER_LICENSE_S';
  totalRacesFinished: number;
  totalRacesWon: number;
  totalPodiums: number;
  totalDriftScore: number;
  totalDistanceDrivenKm: number;
  favoriteVehicleId?: string;
  activeRacingTeamId?: string;
  preferredCameraView: 'COCKPIT_FIRST_PERSON' | 'HOOD_VIEW' | 'CHASE_NEAR' | 'CHASE_FAR' | 'BUMPER';
  unitsPreference: 'METRIC_KMH' | 'IMPERIAL_MPH';
  steeringAssists: {
    abs: boolean;
    tractionControl: boolean;
    stabilityControl: boolean;
    autoClutch: boolean;
    racingLineGuide: boolean;
  };
  audioMix: {
    engineVolume: number;
    tireScreechVolume: number;
    windTurboVolume: number;
    ambientTrafficVolume: number;
    uiSoundVolume: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const UserProfileSchema: TableSchema<UserProfileEntity> = {
  name: 'user_profiles',
  primaryKey: 'id',
  indexes: ['userId', 'racingLicenseGrade'],
  uniqueKeys: ['userId'],
  foreignKeys: [
    {
      field: 'userId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: true,
  softDeletes: false,
};
