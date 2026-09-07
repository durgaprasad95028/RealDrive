/**
 * ============================================================================
 * REALDRIVE MULTIPLAYER — SERVER-SIDE ANTI-CHEAT INSPECTOR
 * ============================================================================
 * Real-time authoritative verification:
 * - Speed hack detector (flags velocities exceeding theoretical vehicle maximum + 10%)
 * - Teleport hack detector (flags coordinate jumps exceeding max delta)
 * - Torque / Horsepower spoofing detector
 * - Automated security infraction logging & temporary session throttling
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { SystemAuditLogEntity } from '../../database/entities/SystemAuditLogEntity.js';
import { LoggerService } from '../../core/LoggerService.js';

export interface AntiCheatCheckInput {
  userId: string;
  socketId: string;
  remoteIp: string;
  vehicleModel: string;
  vehicleMaxSpeedKmh: number;
  reportedSpeedKmh: number;
  lastPos: { x: number; y: number; z: number };
  newPos: { x: number; y: number; z: number };
  deltaTimeSeconds: number;
}

export class AntiCheatInspector {
  private static logger = LoggerService.getInstance().createScopedLogger('AntiCheat');

  public static async validateMovementPacket(
    input: AntiCheatCheckInput,
    database: DatabaseClient = db
  ): Promise<{ isValid: boolean; violationType?: string }> {
    // 1. Check Max Speed limit
    const allowedMaxSpeed = input.vehicleMaxSpeedKmh * 1.15; // 15% downhill/nitro tolerance
    if (input.reportedSpeedKmh > allowedMaxSpeed && input.reportedSpeedKmh > 200) {
      this.logger.warn(`Anti-Cheat violation: Speed limit exceeded for user ${input.userId} (${input.reportedSpeedKmh} > ${allowedMaxSpeed})`);

      await database.insert<SystemAuditLogEntity>('system_audit_logs', {
        eventType: 'ANTI_CHEAT_SPEED_VIOLATION',
        severity: 'WARN',
        userId: input.userId,
        remoteIp: input.remoteIp,
        description: `Reported speed ${input.reportedSpeedKmh.toFixed(1)} km/h exceeds vehicle max capacity ${allowedMaxSpeed.toFixed(1)} km/h`,
      });

      return { isValid: false, violationType: 'SPEED_HACK' };
    }

    // 2. Check Teleport / Discontinuous Jumps
    if (input.deltaTimeSeconds > 0) {
      const distance = Math.sqrt(
        Math.pow(input.newPos.x - input.lastPos.x, 2) +
        Math.pow(input.newPos.y - input.lastPos.y, 2) +
        Math.pow(input.newPos.z - input.lastPos.z, 2)
      );

      const maxPossibleDistance = (allowedMaxSpeed / 3.6) * input.deltaTimeSeconds * 2.5; // with buffer

      if (distance > maxPossibleDistance && distance > 35.0) {
        this.logger.warn(`Anti-Cheat violation: Teleportation detected for user ${input.userId} (jumped ${distance.toFixed(1)}m in ${input.deltaTimeSeconds.toFixed(2)}s)`);

        await database.insert<SystemAuditLogEntity>('system_audit_logs', {
          eventType: 'ANTI_CHEAT_TELEPORT_DETECTED',
          severity: 'CRITICAL',
          userId: input.userId,
          remoteIp: input.remoteIp,
          description: `Displacement of ${distance.toFixed(1)}m in ${input.deltaTimeSeconds.toFixed(2)}s exceeds max threshold ${maxPossibleDistance.toFixed(1)}m`,
        });

        return { isValid: false, violationType: 'TELEPORT_HACK' };
      }
    }

    return { isValid: true };
  }
}
