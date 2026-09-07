/**
 * ============================================================================
 * REALDRIVE SERVER MODULE - TELEMETRY RECORDER SERVICE
 * ============================================================================
 * Manages active telemetry recording sessions, high-frequency flight recorders,
 * lap time delta benchmarks, and historical crash crash-test analysis.
 */

import { BlackBoxFlightRecorder, TelemetryFrame, LapSectorTimingRecord, CrashEventSignature } from '../../simulations/telemetry/BlackBoxFlightRecorder';

export class BlackBoxRecorderService {
  private static instance: BlackBoxRecorderService;
  private readonly activeRecorders: Map<string, BlackBoxFlightRecorder> = new Map();

  private constructor() {}

  public static getInstance(): BlackBoxRecorderService {
    if (!BlackBoxRecorderService.instance) {
      BlackBoxRecorderService.instance = new BlackBoxRecorderService();
    }
    return BlackBoxRecorderService.instance;
  }

  public getOrCreateRecorder(sessionId: string): BlackBoxFlightRecorder {
    let recorder = this.activeRecorders.get(sessionId);
    if (!recorder) {
      recorder = new BlackBoxFlightRecorder(36000); // 5 min buffer at 120Hz
      this.activeRecorders.set(sessionId, recorder);
    }
    return recorder;
  }

  public recordTelemetrySample(sessionId: string, frame: TelemetryFrame): void {
    const recorder = this.getOrCreateRecorder(sessionId);
    recorder.pushFrame(frame);
  }

  public completeLap(sessionId: string, timestampMs: number, isClean: boolean = true): LapSectorTimingRecord {
    const recorder = this.getOrCreateRecorder(sessionId);
    return recorder.finalizeLap(timestampMs, isClean);
  }

  public getLiveTelemetryStream(sessionId: string, count: number = 60): TelemetryFrame[] {
    const recorder = this.getOrCreateRecorder(sessionId);
    return recorder.getRecentFrames(count);
  }

  public getLapRecords(sessionId: string): readonly LapSectorTimingRecord[] {
    const recorder = this.getOrCreateRecorder(sessionId);
    return recorder.getCompletedLaps();
  }

  public getCrashLog(sessionId: string): readonly CrashEventSignature[] {
    const recorder = this.getOrCreateRecorder(sessionId);
    return recorder.getCrashEvents();
  }

  public removeSession(sessionId: string): void {
    this.activeRecorders.delete(sessionId);
  }
}
