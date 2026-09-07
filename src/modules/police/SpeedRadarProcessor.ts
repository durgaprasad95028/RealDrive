/**
 * ============================================================================
 * REALDRIVE POLICE — SPEED RADAR PHOTO ENFORCEMENT PROCESSOR
 * ============================================================================
 * Automated optical speed enforcement cameras:
 * - Speed threshold violation detection
 * - Fine tiered calculation based on delta over limit
 * - Citation ticketing and payment processing
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { SpeedRadarTicketEntity } from '../../database/entities/SpeedRadarTicketEntity.js';
import { UserEntity } from '../../database/entities/UserEntity.js';
import { BankAccountEntity } from '../../database/entities/BankAccountEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class SpeedRadarProcessor {
  constructor(private database: DatabaseClient = db) {}

  public async getDriverTickets(driverId: string): Promise<SpeedRadarTicketEntity[]> {
    return this.database.findMany<SpeedRadarTicketEntity>('speed_radar_tickets', { driverId });
  }

  public async recordSpeedCameraFlash(data: {
    cameraTrapId: string;
    cameraLocationName: string;
    district: any;
    vehiclePlate: string;
    vehicleModelName: string;
    driverId?: string;
    speedLimitKmh: number;
    recordedSpeedKmh: number;
  }): Promise<SpeedRadarTicketEntity | null> {
    const excess = data.recordedSpeedKmh - data.speedLimitKmh;
    if (excess <= 5) return null; // 5 km/h tolerance threshold

    let fine = 150;
    if (excess > 15) fine = 350;
    if (excess > 30) fine = 750;
    if (excess > 50) fine = 1500;

    let driverUsername = 'Unknown Driver';
    if (data.driverId) {
      const user = await this.database.findById<UserEntity>('users', data.driverId);
      if (user) driverUsername = user.username;
    }

    const ticket = await this.database.insert<SpeedRadarTicketEntity>('speed_radar_tickets', {
      ticketId: `RAD-TKT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      cameraTrapId: data.cameraTrapId,
      cameraLocationName: data.cameraLocationName,
      district: data.district,
      vehiclePlate: data.vehiclePlate,
      vehicleModelName: data.vehicleModelName,
      driverId: data.driverId,
      driverUsername,
      speedLimitKmh: data.speedLimitKmh,
      recordedSpeedKmh: data.recordedSpeedKmh,
      excessSpeedKmh: excess,
      calculatedFineCredits: fine,
      photoCaptureTimestamp: new Date().toISOString(),
      status: 'PENDING_PAYMENT',
      dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    });

    return ticket;
  }

  public async payTicket(ticketId: string, userId: string): Promise<SpeedRadarTicketEntity> {
    const ticket = await this.database.findById<SpeedRadarTicketEntity>('speed_radar_tickets', ticketId);
    if (!ticket) throw HttpError.notFound('Ticket not found');
    if (ticket.status === 'PAID') throw HttpError.badRequest('Ticket is already paid.');

    const user = await this.database.findById<UserEntity>('users', userId);
    if (!user) throw HttpError.notFound('User not found');

    if (user.cashBalance < ticket.calculatedFineCredits) {
      throw HttpError.badRequest('Insufficient cash balance to pay fine.');
    }

    await this.database.update<UserEntity>('users', userId, {
      cashBalance: user.cashBalance - ticket.calculatedFineCredits,
    });

    const updated = await this.database.update<SpeedRadarTicketEntity>('speed_radar_tickets', ticketId, {
      status: 'PAID',
    });

    return updated!;
  }
}
