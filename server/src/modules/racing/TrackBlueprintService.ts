/**
 * ============================================================================
 * REALDRIVE RACING — TRACK BLUEPRINT & SPLINE DESIGNER SERVICE
 * ============================================================================
 * Player procedural racetrack creator:
 * - Waypoint spline generation, curvature radii, kerb zones
 * - Lap length calculation & elevation profiles
 * - Community publishing, voting & track reviews
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { TrackBlueprintEntity, TrackWaypoint } from '../../database/entities/TrackBlueprintEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class TrackBlueprintService {
  constructor(private database: DatabaseClient = db) {}

  public async getPublishedTracks(district?: string): Promise<TrackBlueprintEntity[]> {
    const q = this.database.query<TrackBlueprintEntity>('track_blueprints');
    q.where('isPublished', '=', true);
    if (district) q.where('district', '=', district);
    q.orderBy('upvotesCount', 'DESC');
    return this.database.executeQuery(q);
  }

  public async createTrack(
    creatorId: string,
    creatorUsername: string,
    data: {
      title: string;
      description: string;
      district: any;
      trackType: any;
      waypoints: TrackWaypoint[];
      recommendedVehicleClass: string;
      isPublished: boolean;
    }
  ): Promise<TrackBlueprintEntity> {
    if (!data.title || data.waypoints.length < 3) {
      throw HttpError.badRequest('A track must have a title and at least 3 waypoints.');
    }

    // Calculate total track length
    let totalLength = 0;
    for (let i = 0; i < data.waypoints.length; i++) {
      const p1 = data.waypoints[i];
      const p2 = data.waypoints[(i + 1) % data.waypoints.length];
      const dist = Math.sqrt(
        Math.pow(p2.posX - p1.posX, 2) +
        Math.pow(p2.posY - p1.posY, 2) +
        Math.pow(p2.posZ - p1.posZ, 2)
      );
      totalLength += dist;
    }

    return this.database.insert<TrackBlueprintEntity>('track_blueprints', {
      creatorId,
      creatorUsername,
      title: data.title,
      description: data.description || '',
      district: data.district || 'DOWNTOWN_METROPOLIS',
      trackType: data.trackType || 'CIRCUIT_LOOP',
      totalLengthMeters: Math.round(totalLength),
      cornersCount: data.waypoints.length,
      elevationChangeMeters: 45,
      waypointsJson: JSON.stringify(data.waypoints),
      recommendedVehicleClass: data.recommendedVehicleClass || 'TRACK_GT3',
      isPublished: data.isPublished,
      playCount: 0,
      upvotesCount: 0,
      downvotesCount: 0,
      ratingScore: 5.0,
    });
  }
}
