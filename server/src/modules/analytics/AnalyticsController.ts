/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - ANALYTICS HTTP CONTROLLER
 * ============================================================================
 * REST API routes for player driver style profiling and urban incident heatmaps.
 */

import { HttpRequest, HttpResponse } from '../../core/HttpTypes';
import { PlayerBehaviorAnalyticsService } from './PlayerBehaviorAnalyticsService';

export class AnalyticsController {
  private readonly analyticsService = PlayerBehaviorAnalyticsService.getInstance();

  public getMyDriverProfile = async (req: HttpRequest): Promise<HttpResponse> => {
    const userId = req.user?.userId || 'guest_user';
    const profile = this.analyticsService.getDriverProfile(userId);

    return { status: 200, body: { success: true, profile } };
  };

  public getIncidentHeatmap = async (req: HttpRequest): Promise<HttpResponse> => {
    const districtId = req.query?.districtId as string;
    const points = districtId ? 
      this.analyticsService.getHeatmapForDistrict(districtId) : 
      this.analyticsService.getAllHeatmaps();

    return { status: 200, body: { success: true, count: points.length, heatmapPoints: points } };
  };

  public reportIncident = async (req: HttpRequest): Promise<HttpResponse> => {
    const { districtId, coordsVec3, incidentType, severityIntensity } = req.body || {};

    if (!districtId || !coordsVec3 || !incidentType) {
      return { status: 400, body: { success: false, error: 'Missing required incident fields' } };
    }

    this.analyticsService.logIncident({
      districtId,
      coordsVec3,
      incidentType,
      severityIntensity: severityIntensity || 5,
      timestamp: Date.now()
    });

    return { status: 201, body: { success: true } };
  };
}
