/**
 * ============================================================================
 * REALDRIVE ENTITY — VEHICLE ENTITY
 * ============================================================================
 * Vehicle catalog specifications and player-owned vehicle instances:
 * VIN, powertrain, thermodynamics, chassis rigidity, wear & maintenance.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface VehicleEntity {
  id: string;
  ownerId?: string; // Null if stock showroom vehicle
  modelId: string;
  name: string;
  brand: string;
  vehicleClass: 'SUPERCAR' | 'HYPERCAR' | 'JDM_TUNER' | 'MUSCLE' | 'TRACK_GT3' | 'FORMULA' | 'OFFROAD' | 'COMMERCIAL_TRUCK' | 'LUXURY_SEDAN' | 'ELECTRIC_HYPER';
  year: number;
  vin: string;
  licensePlate: string;
  paintColor: string;
  paintFinish: 'GLOSS' | 'MATTE' | 'METALLIC' | 'CHROME' | 'SATIN_PEARL';
  mileageKm: number;
  basePrice: number;
  marketValuation: number;
  
  // Mechanical Specs
  engineType: 'INLINE_4' | 'INLINE_6' | 'BOXER_6' | 'V6_TWINTURBO' | 'V8_SUPERCHARGED' | 'V10_NATURAL' | 'V12_QUADTURBO' | 'DUAL_MOTOR_EV';
  drivetrain: 'RWD' | 'FWD' | 'AWD' | '4WD';
  transmissionType: 'MANUAL_6SPD' | 'DCT_7SPD' | 'SEQUENTIAL_6SPD' | 'SINGLE_DIRECT_EV';
  horsepower: number;
  torqueNm: number;
  curbWeightKg: number;
  topSpeedKmh: number;
  zeroToHundredSec: number;
  brakingDistance100To0M: number;
  lateralGForce: number;
  fuelCapacityLiters: number;
  currentFuelLiters: number;
  batteryCapacityKwh?: number;
  currentBatteryKwh?: number;

  // Mechanical Wear & Health State (0.0 to 100.0)
  engineConditionPct: number;
  transmissionConditionPct: number;
  brakePadsConditionPct: number;
  tireTreadConditionPct: number;
  oilLifePct: number;
  chassisStructuralDamagePct: number;
  isImpounded: boolean;
  isInGarage: boolean;
  garageLocationId?: string;
  
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export const VehicleSchema: TableSchema<VehicleEntity> = {
  name: 'vehicles',
  primaryKey: 'id',
  indexes: ['ownerId', 'vehicleClass', 'brand', 'marketValuation'],
  uniqueKeys: ['vin'],
  foreignKeys: [
    {
      field: 'ownerId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: true,
  softDeletes: true,
};
