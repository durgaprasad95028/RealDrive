/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - DYNO TUNING HTTP CONTROLLER
 * ============================================================================
 * REST API routes for vehicle dynamometer pulls, ECU fuel map tuning, and live graphs.
 */

import { HttpRequest, HttpResponse } from '../../core/HttpTypes';
import { DynoGraphGeneratorService } from './DynoGraphGeneratorService';

export class DynoController {
  private readonly dynoService = DynoGraphGeneratorService.getInstance();

  public runDynoPull = async (req: HttpRequest): Promise<HttpResponse> => {
    const { baseHp, baseTorque, maxRpm, turboBoostTargetPsi, targetAirFuelRatio, ignitionAdvanceDeg, drivetrainLossPercent } = req.body || {};

    const summary = this.dynoService.runDynamometerPull(
      baseHp || 450,
      baseTorque || 500,
      maxRpm || 8500,
      turboBoostTargetPsi || 18.0,
      targetAirFuelRatio || 12.2,
      ignitionAdvanceDeg || 24.0,
      drivetrainLossPercent || 14.5
    );

    return { status: 200, body: { success: true, dynoReport: summary } };
  };
}
