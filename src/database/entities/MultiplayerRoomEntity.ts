/**
 * ============================================================================
 * REALDRIVE ENTITY — MULTIPLAYER ROOM & SERVER LOBBY ENTITY
 * ============================================================================
 * Distributed multiplayer game world rooms, spatial district boundaries,
 * tick rate configurations (30Hz, 60Hz), max player capacities, and access passwords.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface MultiplayerRoomEntity {
  id: string;
  roomCode: string;
  name: string;
  hostUserId?: string;
  district: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS' | 'OPEN_WORLD_GLOBAL';
  mode: 'FREE_ROAM' | 'STREET_RACE_LOBBY' | 'DRIFT_MEET' | 'POLICE_CHASE_OUTLAW' | 'CRUISING_CAR_MEET';
  maxPlayers: number;
  currentPlayersCount: number;
  tickRateHz: 30 | 60;
  isPasswordProtected: boolean;
  passwordHash?: string;
  pvpCollisionsEnabled: boolean;
  trafficAiEnabled: boolean;
  weatherSyncEnabled: boolean;
  status: 'OPEN' | 'IN_GAME' | 'CLOSING';
  createdAt: string;
  updatedAt: string;
}

export const MultiplayerRoomSchema: TableSchema<MultiplayerRoomEntity> = {
  name: 'multiplayer_rooms',
  primaryKey: 'id',
  indexes: ['district', 'mode', 'status', 'currentPlayersCount'],
  uniqueKeys: ['roomCode'],
  timestamps: true,
  softDeletes: false,
};
