/**
 * ============================================================================
 * REALDRIVE ENTITY — RACE TOURNAMENT & CHAMPIONSHIP ENTITY
 * ============================================================================
 * Competitive racing leagues, Formula/GT3/Drift championships, qualifying grids,
 * prize pools, weather presets, track configurations, and point standings.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface RaceTournamentEntity {
  id: string;
  tournamentCode: string;
  title: string;
  discipline: 'CIRCUIT_SPRINT' | 'ENDURANCE_LE_MANS' | 'DRIFT_TANDEM_BATTLE' | 'DRAG_ELIMINATOR' | 'TOUGE_DOWNHILL' | 'STREET_OUTLAW_MIDNIGHT';
  requiredLicenseGrade: 'ROOKIE_D' | 'AMATEUR_C' | 'PRO_B' | 'MASTER_A' | 'SUPER_LICENSE_S';
  allowedVehicleClasses: string[];
  trackName: string;
  trackLengthMeters: number;
  totalLaps: number;
  maxGridSlots: number;
  registeredDriversCount: number;
  entryFeeCredits: number;
  totalPrizePoolCredits: number;
  payoutDistributionJson: string; // [50%, 25%, 15%, 10%]
  weatherCondition: 'CLEAR_SUNNY' | 'OVERCAST' | 'RAIN_WET_TRACK' | 'THUNDERSTORM' | 'FOG_MIST' | 'MIDNIGHT_STORM';
  ambientTemperatureC: number;
  trackSurfaceGripMultiplier: number; // 0.65 to 1.10
  status: 'UPCOMING_REGISTRATION' | 'QUALIFYING' | 'LIVE_RACING' | 'FINISHED_CONCLUDED';
  scheduledStart: string;
  concludedAt?: string;
  createdAt: string;
}

export const RaceTournamentSchema: TableSchema<RaceTournamentEntity> = {
  name: 'race_tournaments',
  primaryKey: 'id',
  indexes: ['discipline', 'requiredLicenseGrade', 'status', 'scheduledStart'],
  uniqueKeys: ['tournamentCode'],
  timestamps: true,
  softDeletes: false,
};
