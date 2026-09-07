/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - DRIVER BEHAVIOR ANALYTICS & HEATMAP SERVICE
 * ============================================================================
 * Aggregates driver skill telemetry, cornering smoothness indices, trail-braking
 * finesse scores, incident heatmaps, and server performance metrics.
 */

export interface DriverStyleProfile {
  readonly userId: string;
  readonly totalDistanceDrivenKm: number;
  readonly totalTimeDrivenMinutes: number;
  readonly overallDriverSkillRating: number; // 0 to 100
  readonly smoothnessScore: number;          // 0 to 100
  readonly throttleFinesseScore: number;     // 0 to 100
  readonly trailBrakingEfficiencyScore: number; // 0 to 100
  readonly crashFrequencyPer100Km: number;
  readonly topSpeedEverRecordedKph: number;
  readonly preferredVehicleCategory: string;
  readonly favoriteDistrict: string;
}

export interface IncidentHeatmapPoint {
  readonly districtId: string;
  readonly coordsVec3: [number, number, number];
  readonly incidentType: 'barrier_collision' | 'vehicle_spin' | 'speed_camera_violation' | 'overheat_failure';
  readonly severityIntensity: number; // 1 to 10
  readonly timestamp: number;
}

export class PlayerBehaviorAnalyticsService {
  private static instance: PlayerBehaviorAnalyticsService;
  private readonly driverProfiles: Map<string, DriverStyleProfile> = new Map();
  private readonly incidentHeatmap: IncidentHeatmapPoint[] = [];

  private constructor() {}

  public static getInstance(): PlayerBehaviorAnalyticsService {
    if (!PlayerBehaviorAnalyticsService.instance) {
      PlayerBehaviorAnalyticsService.instance = new PlayerBehaviorAnalyticsService();
    }
    return PlayerBehaviorAnalyticsService.instance;
  }

  public getDriverProfile(userId: string): DriverStyleProfile {
    let profile = this.driverProfiles.get(userId);
    if (!profile) {
      profile = {
        userId,
        totalDistanceDrivenKm: 142.5,
        totalTimeDrivenMinutes: 185,
        overallDriverSkillRating: 84,
        smoothnessScore: 88,
        throttleFinesseScore: 82,
        trailBrakingEfficiencyScore: 79,
        crashFrequencyPer100Km: 1.4,
        topSpeedEverRecordedKph: 342.5,
        preferredVehicleCategory: 'hypercar',
        favoriteDistrict: 'Downtown Financial Core'
      };
      this.driverProfiles.set(userId, profile);
    }
    return profile;
  }

  public logIncident(point: IncidentHeatmapPoint): void {
    this.incidentHeatmap.push(point);
    if (this.incidentHeatmap.length > 5000) {
      this.incidentHeatmap.shift(); // Keep latest 5000 points
    }
  }

  public getHeatmapForDistrict(districtId: string): IncidentHeatmapPoint[] {
    return this.incidentHeatmap.filter(p => p.districtId === districtId);
  }

  public getAllHeatmaps(): IncidentHeatmapPoint[] {
    return [...this.incidentHeatmap];
  }
}
