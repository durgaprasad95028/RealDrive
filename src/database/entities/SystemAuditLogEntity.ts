/**
 * ============================================================================
 * REALDRIVE ENTITY — SYSTEM SECURITY & AUDIT LOG ENTITY
 * ============================================================================
 * Immutable server audit events: anti-cheat triggers (speed hacks, torque spikes,
 * teleports), administrative overrides, balance modifications, and security warnings.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface SystemAuditLogEntity {
  id: string;
  eventType:
    | 'ANTI_CHEAT_SPEED_VIOLATION'
    | 'ANTI_CHEAT_TELEPORT_DETECTED'
    | 'ANTI_CHEAT_TORQUE_INJECTION'
    | 'ADMIN_USER_BAN'
    | 'ADMIN_BALANCE_ADJUSTMENT'
    | 'SECURITY_LOGIN_FAILED_BRUTEFORCE'
    | 'RATE_LIMIT_IP_BLOCK'
    | 'MARKETPLACE_ESCROW_RELEASE';
  severity: 'INFO' | 'WARN' | 'CRITICAL' | 'SECURITY_BREACH';
  userId?: string;
  targetId?: string;
  remoteIp: string;
  description: string;
  rawPayloadJson?: string;
  createdAt: string;
}

export const SystemAuditLogSchema: TableSchema<SystemAuditLogEntity> = {
  name: 'system_audit_logs',
  primaryKey: 'id',
  indexes: ['eventType', 'severity', 'userId', 'createdAt'],
  timestamps: false,
  softDeletes: false,
};
