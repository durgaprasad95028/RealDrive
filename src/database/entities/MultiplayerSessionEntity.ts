/**
 * ============================================================================
 * REALDRIVE ENTITY — MULTIPLAYER PLAYER SESSION ENTITY
 * ============================================================================
 * Active network connection sessions, socket IDs, ping round-trip times,
 * jitter statistics, current 3D world coordinates, vehicle synchronizations.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface MultiplayerSessionEntity {
  id: string;
  socketId: string;
  userId: string;
  username: string;
  roomId: string;
  vehicleId: string;
  vehicleModelName: string;
  vehicleColor: string;
  pingMs: number;
  packetLossPct: number;
  jitterMs: number;
  posX: number;
  posY: number;
  posZ: number;
  rotYaw: number;
  speedKmh: number;
  steeringAngleDeg: number;
  brakeActive: boolean;
  handbrakeActive: boolean;
  headlightsActive: boolean;
  hornActive: boolean;
  nitroActive: boolean;
  lastHeartbeatAt: string;
  joinedAt: string;
}

export const MultiplayerSessionSchema: TableSchema<MultiplayerSessionEntity> = {
  name: 'multiplayer_sessions',
  primaryKey: 'id',
  indexes: ['userId', 'roomId', 'socketId', 'pingMs'],
  uniqueKeys: ['socketId', 'userId'],
  foreignKeys: [
    {
      field: 'userId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
    {
      field: 'roomId',
      referencesTable: 'multiplayer_rooms',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
