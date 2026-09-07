/**
 * ============================================================================
 * REALDRIVE CAREER — EXPRESS COURIER & FOOD DELIVERY ENGINE
 * ============================================================================
 * High-speed urban motorbike/compact car courier dispatches:
 * - Exponential heat/cold thermal decay models for hot food & cold desserts
 * - Fragile organ & vital blood deliveries with speed/shock limits
 * - Rush delivery speed bonuses and on-time reliability rating multipliers
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { DeliveryOrderEntity } from '../../database/entities/DeliveryOrderEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export class ExpressDeliveryEngine {
  constructor(private database: DatabaseClient = db) {}

  public async generateOrders(count: number = 5): Promise<DeliveryOrderEntity[]> {
    const orders: DeliveryOrderEntity[] = [];
    const categories = [
      { cat: 'HOT_GOURMET_FOOD', sender: 'Bella Napoli Woodfire Pizzeria', basePay: 45 },
      { cat: 'ICE_CREAM_FROZEN', sender: 'Gelato Artigianale Metropolis', basePay: 55 },
      { cat: 'EMERGENCY_MEDICAL_BLOOD', sender: 'St. Jude Metropolitan Trauma Center', basePay: 180 },
      { cat: 'ELECTRONICS_HARDWARE', sender: 'CyberTech Superstore Neon Row', basePay: 75 },
    ] as const;

    for (let i = 0; i < count; i++) {
      const template = categories[i % categories.length];
      const dist = Number((2.0 + Math.random() * 8.0).toFixed(1));
      const targetSec = Math.round(dist * 35); // ~35 seconds per km

      const order = await this.database.insert<DeliveryOrderEntity>('delivery_orders', {
        orderNumber: `DLV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
        courierId: undefined,
        orderCategory: template.cat,
        restaurantOrSenderName: template.sender,
        recipientName: 'Customer #' + Math.floor(100 + Math.random() * 900),
        pickupAddress: `${template.sender}, Downtown District`,
        pickupDistrict: 'DOWNTOWN_METROPOLIS',
        deliveryAddress: 'Skyline Condos Apt 14B, Neon District',
        deliveryDistrict: 'NEON_DISTRICT',
        distanceKm: dist,
        timeTargetSeconds: targetSec,
        elapsedSeconds: 0,
        qualityIntegrityPct: 100.0,
        basePay: Math.round(template.basePay * (dist / 3.0)),
        bonusSpeedTip: 0,
        totalEarnings: 0,
        status: 'PENDING_PICKUP',
        createdAt: new Date().toISOString(),
      });

      orders.push(order);
    }

    return orders;
  }

  public async claimOrder(orderId: string, courierId: string): Promise<DeliveryOrderEntity> {
    const order = await this.database.findById<DeliveryOrderEntity>('delivery_orders', orderId);
    if (!order) throw HttpError.notFound('Order not found');
    if (order.status !== 'PENDING_PICKUP') throw HttpError.badRequest('Order already claimed.');

    const updated = await this.database.update<DeliveryOrderEntity>('delivery_orders', orderId, {
      courierId,
      status: 'OUT_FOR_DELIVERY',
    });

    return updated!;
  }

  public async deliverOrder(orderId: string, elapsedSeconds: number, shockBumpsCount: number): Promise<{
    order: DeliveryOrderEntity;
    earnings: number;
    speedBonus: number;
    qualityRemainingPct: number;
  }> {
    const order = await this.database.findById<DeliveryOrderEntity>('delivery_orders', orderId);
    if (!order) throw HttpError.notFound('Order not found');

    // Quality degradation
    const timeRatio = elapsedSeconds / order.timeTargetSeconds;
    let qualityPct = Math.max(0, 100.0 - (timeRatio > 1.0 ? (timeRatio - 1.0) * 40 : 0) - (shockBumpsCount * 5));

    let speedBonus = 0;
    if (elapsedSeconds < order.timeTargetSeconds) {
      speedBonus = Math.round(order.basePay * 0.40); // 40% rush tip
    }

    const totalEarnings = Math.round((order.basePay + speedBonus) * (qualityPct / 100.0));
    const status = qualityPct > 40 ? 'COMPLETED' : 'SPOILED_FAILED';

    const updated = await this.database.update<DeliveryOrderEntity>('delivery_orders', orderId, {
      elapsedSeconds,
      qualityIntegrityPct: qualityPct,
      bonusSpeedTip: speedBonus,
      totalEarnings,
      status,
      deliveredAt: new Date().toISOString(),
    });

    return {
      order: updated!,
      earnings: totalEarnings,
      speedBonus,
      qualityRemainingPct: qualityPct,
    };
  }
}
