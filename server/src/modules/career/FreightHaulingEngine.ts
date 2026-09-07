/**
 * ============================================================================
 * REALDRIVE CAREER — FREIGHT HAULING & LOGISTICS ENGINE
 * ============================================================================
 * Industrial heavy freight contract logistics:
 * - Cargo weight dynamics (up to 40 tons), center of mass tipping risks
 * - Fragile & hazardous cargo speed limit compliance
 * - Structural container damage depreciation
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { FreightContractEntity } from '../../database/entities/FreightContractEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class FreightHaulingEngine {
  constructor(private database: DatabaseClient = db) {}

  public async generateFreightContracts(count: number = 4): Promise<FreightContractEntity[]> {
    const contracts: FreightContractEntity[] = [];
    const cargoTypes = [
      { type: 'INDUSTRIAL_MACHINERY', weight: 28.5, payout: 45000, isHazardous: false, isFragile: false },
      { type: 'LIQUID_PETROLEUM', weight: 34.0, payout: 68000, isHazardous: true, isFragile: false },
      { type: 'LUXURY_SUPERCAR_FLEET', weight: 12.0, payout: 85000, isHazardous: false, isFragile: true },
      { type: 'HIGH_VOLTAGE_BATTERIES', weight: 22.0, payout: 58000, isHazardous: true, isFragile: true },
    ] as const;

    for (let i = 0; i < count; i++) {
      const template = cargoTypes[i % cargoTypes.length];
      const distance = Number((15.0 + Math.random() * 25.0).toFixed(1));

      const contract = await this.database.insert<FreightContractEntity>('freight_contracts', {
        contractCode: `FRT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
        driverId: undefined,
        cargoType: template.type,
        cargoWeightTons: template.weight,
        isFragile: template.isFragile,
        isHazardous: template.isHazardous,
        originHub: 'Metropolis Harbor Logistics Terminal #4',
        originDistrict: 'INDUSTRIAL_HARBOR',
        destinationHub: 'Mountain Pass High Altitude Research Station',
        destinationDistrict: 'MOUNTAIN_PASS',
        totalDistanceKm: distance,
        payoutAmount: Math.round(template.payout * (distance / 20.0)),
        penaltyPerDamagePct: template.isFragile ? 800 : 350,
        timeLimitSeconds: Math.round(distance * 60),
        cargoHealthPct: 100.0,
        status: 'AVAILABLE',
        createdAt: new Date().toISOString(),
      });

      contracts.push(contract);
    }

    return contracts;
  }

  public async acceptContract(contractId: string, driverId: string): Promise<FreightContractEntity> {
    const contract = await this.database.findById<FreightContractEntity>('freight_contracts', contractId);
    if (!contract) throw HttpError.notFound('Freight contract not found.');
    if (contract.status !== 'AVAILABLE') throw HttpError.badRequest('Contract already taken.');

    const updated = await this.database.update<FreightContractEntity>('freight_contracts', contractId, {
      driverId,
      status: 'IN_TRANSIT',
    });

    return updated!;
  }

  public async deliverFreight(contractId: string, finalCargoHealthPct: number): Promise<{
    contract: FreightContractEntity;
    grossPayout: number;
    damagePenalty: number;
    netPayout: number;
  }> {
    const contract = await this.database.findById<FreightContractEntity>('freight_contracts', contractId);
    if (!contract) throw HttpError.notFound('Freight contract not found.');

    const damageLostPct = Math.max(0, 100.0 - finalCargoHealthPct);
    const penalty = Math.round(damageLostPct * contract.penaltyPerDamagePct);
    const netPayout = Math.max(0, contract.payoutAmount - penalty);
    const status = finalCargoHealthPct >= 95 ? 'DELIVERED_PERFECT' : 'DELIVERED_DAMAGED';

    const updated = await this.database.update<FreightContractEntity>('freight_contracts', contractId, {
      cargoHealthPct: finalCargoHealthPct,
      status,
      deliveredAt: new Date().toISOString(),
    });

    return {
      contract: updated!,
      grossPayout: contract.payoutAmount,
      damagePenalty: penalty,
      netPayout,
    };
  }
}
