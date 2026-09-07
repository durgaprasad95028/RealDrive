/**
 * ============================================================================
 * REALDRIVE ENTITY — LEADERBOARD & GLOBAL RANKINGS ENTITY
 * ============================================================================
 * Competitive leaderboards: Top Speed Speed-Trap Traps, Longest Drift Continuous,
 * Career Net Worth, Fastest 1/4 Mile Drag, and Safety Rating Rankings.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface LeaderboardScoreEntity {
  id: string;
  category:
    | 'TOP_SPEED_GLOBAL'
    | 'DRIFT_COMBO_SCORE'
    | 'DRAG_QUARTER_MILE'
    | 'CAREER_NET_WORTH'
    | 'CIRCUIT_TIME_ATTACK'
    | 'LONGEST_POLICE_EVASION'
    | 'RIDESHARE_TOP_EARNER';
  userId: string;
  username: string;
  vehicleModelName: string;
  numericScore: number;
  formattedScore: string; // e.g. "412.5 km/h", "1,850,200 pts", "8.125s"
  rankPosition: number;
  seasonId: string; // e.g. "SEASON_1_2026"
  district?: string;
  verifiedAntiCheat: boolean;
  achievedAt: string;
}

export const LeaderboardScoreSchema: TableSchema<LeaderboardScoreEntity> = {
  name: 'leaderboard_scores',
  primaryKey: 'id',
  indexes: ['category', 'userId', 'seasonId', 'numericScore', 'rankPosition'],
  foreignKeys: [
    {
      field: 'userId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
