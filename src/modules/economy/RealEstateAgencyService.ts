/**
 * ============================================================================
 * REALDRIVE ECONOMY — REAL ESTATE AGENCY & PROPERTY SERVICE
 * ============================================================================
 * Luxury penthouses, beachfront estates, industrial garage workshops,
 * daily rental passive income collections, and property deeds.
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { RealEstatePropertyEntity } from '../../database/entities/RealEstatePropertyEntity.js';
import { GarageEntity } from '../../database/entities/GarageEntity.js';
import { UserEntity } from '../../database/entities/UserEntity.js';
import { BankAccountEntity } from '../../database/entities/BankAccountEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class RealEstateAgencyService {
  constructor(private database: DatabaseClient = db) {}

  public async getAvailableProperties(): Promise<RealEstatePropertyEntity[]> {
    const q = this.database.query<RealEstatePropertyEntity>('real_estate_properties');
    q.whereNull('ownerId');
    return this.database.executeQuery(q);
  }

  public async getPlayerProperties(userId: string): Promise<RealEstatePropertyEntity[]> {
    return this.database.findMany<RealEstatePropertyEntity>('real_estate_properties', { ownerId: userId });
  }

  public async purchaseProperty(userId: string, propertyId: string): Promise<RealEstatePropertyEntity> {
    const property = await this.database.findById<RealEstatePropertyEntity>('real_estate_properties', propertyId);
    if (!property) throw HttpError.notFound('Property not found');
    if (property.ownerId) throw HttpError.badRequest('Property is already owned.');

    const bankAcc = await this.database.findOne<BankAccountEntity>('bank_accounts', { userId });
    if (!bankAcc || bankAcc.availableBalance < property.purchasePrice) {
      throw HttpError.badRequest(`Insufficient bank funds to purchase deed. Price: ${property.purchasePrice} RDC.`);
    }

    const newBalance = bankAcc.balance - property.purchasePrice;
    await this.database.update<BankAccountEntity>('bank_accounts', bankAcc.id, {
      balance: newBalance,
      availableBalance: newBalance,
    });

    const updated = await this.database.update<RealEstatePropertyEntity>('real_estate_properties', propertyId, {
      ownerId: userId,
      acquiredAt: new Date().toISOString(),
    });

    // Automatically create garage attached to property if parking slots exist
    if (property.garageParkingSlots > 0) {
      await this.database.insert<GarageEntity>('garages', {
        ownerId: userId,
        name: `${property.title} Garage`,
        district: property.district,
        address: property.streetAddress,
        tier: property.garageParkingSlots >= 25 ? 'COMMERCIAL_25_CAR' : (property.garageParkingSlots >= 10 ? 'MANSION_10_CAR' : 'WORKSHOP_5_CAR'),
        vehicleCapacity: property.garageParkingSlots,
        currentVehicleCount: 0,
        hasHydraulicLift: property.hasPrivateDynoBay,
        hasDynoTuningCell: property.hasPrivateDynoBay,
        hasPaintBooth: true,
        hasLaserWheelAlignment: true,
        securityLevel: 5,
        dailyMaintenanceCost: 150,
        marketValuation: Math.round(property.purchasePrice * 0.3),
        interiorTheme: 'LUXURY_SHOWROOM',
      });
    }

    return updated!;
  }
}
