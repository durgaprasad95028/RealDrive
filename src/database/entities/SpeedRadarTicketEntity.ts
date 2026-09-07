/**
 * ============================================================================
 * REALDRIVE ENTITY — SPEED RADAR PHOTO TICKET ENTITY
 * ============================================================================
 * Automated optical speed enforcement cameras, flash photo capture metadata,
 * speed delta calculations, fine processing, and court appeal status.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface SpeedRadarTicketEntity {
  id: string;
  ticketId: string;
  cameraTrapId: string;
  cameraLocationName: string;
  district: 'DOWNTOWN_METROPOLIS' | 'COASTAL_HIGHWAY' | 'INDUSTRIAL_HARBOR' | 'NEON_DISTRICT' | 'SUBURBAN_HILLS' | 'AIRPORT_RUNWAY' | 'MOUNTAIN_PASS';
  vehiclePlate: string;
  vehicleModelName: string;
  driverId?: string;
  driverUsername?: string;
  speedLimitKmh: number;
  recordedSpeedKmh: number;
  excessSpeedKmh: number;
  calculatedFineCredits: number;
  photoCaptureTimestamp: string;
  status: 'PENDING_PAYMENT' | 'PAID' | 'DISPUTED_IN_REVIEW' | 'OVERDUE_PENALTY';
  dueDate: string;
  createdAt: string;
}

export const SpeedRadarTicketSchema: TableSchema<SpeedRadarTicketEntity> = {
  name: 'speed_radar_tickets',
  primaryKey: 'id',
  indexes: ['cameraTrapId', 'vehiclePlate', 'driverId', 'status', 'photoCaptureTimestamp'],
  uniqueKeys: ['ticketId'],
  foreignKeys: [
    {
      field: 'driverId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'SET_NULL',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
