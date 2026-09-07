/**
 * ============================================================================
 * REALDRIVE ENTITY — TRACK BLUEPRINT & PROCEDURAL CIRCUIT ENTITY
 * ============================================================================
 * Player-created race circuits, Catmull-Rom spline waypoints, banking angles,
 * kerb placements, checkpoint gates, and community rating reviews.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface TrackWaypoint {
  index: number;
  posX: number;
  posY: number;
  posZ: number;
  widthMeters: number;
  bankingDegrees: number;
  isCheckpoint: boolean;
  isSectorBoundary: boolean;
  sectorIndex?: number;
  hasCurbsLeft: boolean;
  hasCurbsRight: boolean;
  surfaceGripMultiplier: number;
}

export interface TrackBlueprintEntity {
  id: string;
  creatorId: string;
  creatorUsername: string;
  title: string;
  description: string;
  district: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  trackType: 'CIRCUIT_LOOP' | 'POINT_TO_POINT_SPRINT' | 'DRAG_STRIP_1_4_MILE' | 'DRIFT_GYMKHANA_ARENA';
  totalLengthMeters: number;
  cornersCount: number;
  elevationChangeMeters: number;
  waypointsJson: string; // Serialized TrackWaypoint[]
  recommendedVehicleClass: string;
  isPublished: boolean;
  playCount: number;
  upvotesCount: number;
  downvotesCount: number;
  ratingScore: number;
  createdAt: string;
  updatedAt: string;
}

export const TrackBlueprintSchema: TableSchema<TrackBlueprintEntity> = {
  name: 'track_blueprints',
  primaryKey: 'id',
  indexes: ['creatorId', 'district', 'trackType', 'isPublished', 'ratingScore'],
  foreignKeys: [
    {
      field: 'creatorId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: true,
  softDeletes: false,
};
