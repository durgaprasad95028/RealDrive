/**
 * ============================================================================
 * REALDRIVE ENTITY — CAREER DRIVER LOGISTICS ENTITY
 * ============================================================================
 * Commercial driver profile, ratings, unlocked professional licenses:
 * Class A CDL (Freight), Class B (Bus/Coach), Rideshare Diamond Tier,
 * Hazardous Material (HAZMAT) endorsements, courier certifications.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface CareerDriverEntity {
  id: string;
  userId: string;
  careerLevel: number;
  careerXp: number;
  overallRating: number; // 1.00 to 5.00
  totalCompletedJobs: number;
  totalCancelledJobs: number;
  totalCareerEarnings: number;
  
  // Professional Licenses & Endorsements
  hasRideshareLicense: boolean;
  rideshareTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  hasCdlFreightLicense: boolean;
  hasHazmatEndorsement: boolean;
  hasHeavyHaulEndorsement: boolean;
  hasExpressCourierLicense: boolean;
  hasArmoredValuablesLicense: boolean;
  
  // Performance Statistics
  onTimeDeliveryRatePct: number; // 0 to 100%
  cargoIntegrityAveragePct: number; // 0 to 100%
  passengerComfortRating: number; // 1.00 to 5.00
  speedingViolationCount: number;
  
  createdAt: string;
  updatedAt: string;
}

export const CareerDriverSchema: TableSchema<CareerDriverEntity> = {
  name: 'career_drivers',
  primaryKey: 'id',
  indexes: ['userId', 'careerLevel', 'overallRating', 'rideshareTier'],
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
