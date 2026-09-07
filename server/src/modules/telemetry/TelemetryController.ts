/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - TELEMETRY HTTP CONTROLLER
 * ============================================================================
 * REST API routes for vehicle telemetry streaming, sector splits, and crash data.
 */

import { HttpRequest, HttpResponse } from '../../core/HttpTypes';
import { BlackBoxRecorderService } from './BlackBoxRecorderService';

export class TelemetryController {
  private readonly telemetryService = BlackBoxRecorderService.getInstance();

  public streamTelemetry = async (req: HttpRequest): Promise<HttpResponse> => {
    const sessionId = (req.query?.sessionId as string) || req.user?.userId || 'default_session';
    const sample = req.body;

    if (!sample) {
      return { status: 400, body: { success: false, error: 'Telemetry frame body missing' } };
    }

    this.telemetryService.recordTelemetrySample(sessionId, sample);
    return { status: 200, body: { success: true } };
  };

  public getRecentFrames = async (req: HttpRequest): Promise<HttpResponse> => {
    const sessionId = (req.query?.sessionId as string) || req.user?.userId || 'default_session';
    const count = parseInt((req.query?.count as string) || '60', 10);
    const frames = this.telemetryService.getLiveTelemetryStream(sessionId, count);

    return { status: 200, body: { success: true, count: frames.length, frames } };
  };

  public recordLapCompletion = async (req: HttpRequest): Promise<HttpResponse> => {
    const sessionId = (req.query?.sessionId as string) || req.user?.userId || 'default_session';
    const { timestampMs, isClean } = req.body || {};

    const record = this.telemetryService.completeLap(sessionId, timestampMs || Date.now(), isClean !== false);
    return { status: 200, body: { success: true, lapRecord: record } };
  };

  public getLapTimes = async (req: HttpRequest): Promise<HttpResponse> => {
    const sessionId = (req.query?.sessionId as string) || req.user?.userId || 'default_session';
    const laps = this.telemetryService.getLapRecords(sessionId);

    return { status: 200, body: { success: true, laps } };
  };

  public getCrashEvents = async (req: HttpRequest): Promise<HttpResponse> => {
    const sessionId = (req.query?.sessionId as string) || req.user?.userId || 'default_session';
    const crashes = this.telemetryService.getCrashLog(sessionId);

    return { status: 200, body: { success: true, crashes } };
  };
}
