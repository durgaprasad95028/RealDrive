/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - DEALERSHIP HTTP CONTROLLER
 * ============================================================================
 * REST API routes for vehicle showrooms, financing quotes, and trade-in valuations.
 */

import { HttpRequest, HttpResponse } from '../../core/HttpTypes';
import { ShowroomInventoryService } from './ShowroomInventoryService';

export class DealershipController {
  private readonly showroomService = ShowroomInventoryService.getInstance();

  public getShowroomCatalog = async (_req: HttpRequest): Promise<HttpResponse> => {
    const vehicles = this.showroomService.getAvailableShowroomVehicles();
    return { status: 200, body: { success: true, count: vehicles.length, vehicles } };
  };

  public calculateFinancing = async (req: HttpRequest): Promise<HttpResponse> => {
    const { vehiclePriceUSD, downPaymentUSD, creditScoreRating, loanTermMonths } = req.body || {};
    if (!vehiclePriceUSD) {
      return { status: 400, body: { success: false, error: 'vehiclePriceUSD is required' } };
    }

    const plan = this.showroomService.calculateFinancing(
      vehiclePriceUSD,
      downPaymentUSD || 0,
      creditScoreRating || 'good',
      loanTermMonths || 48
    );

    return { status: 200, body: { success: true, financingPlan: plan } };
  };

  public appraiseTradeIn = async (req: HttpRequest): Promise<HttpResponse> => {
    const vinOrId = (req.query?.vin as string) || (req.body?.vin as string);
    if (!vinOrId) {
      return { status: 400, body: { success: false, error: 'vin parameter is required' } };
    }

    const appraisal = this.showroomService.appraiseTradeInVehicle(vinOrId);
    return { status: 200, body: { success: true, appraisal } };
  };
}
