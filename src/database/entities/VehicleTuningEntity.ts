/**
 * ============================================================================
 * REALDRIVE ENTITY — VEHICLE TUNING ENTITY
 * ============================================================================
 * Aftermarket engine mods, forced induction, suspension geometry,
 * aerodynamic aero packages, limited slip differential ramp angles.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface VehicleTuningEntity {
  id: string;
  vehicleId: string;
  
  // ECU & Engine Upgrades
  ecuStage: 'STOCK' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3' | 'PRO_CUSTOM_STANDALONE';
  ignitionTimingDegrees: number; // -10.0 to +15.0 deg
  fuelAirTargetRatio: number; // 11.0 to 14.7 AFR
  revLimiterRpm: number;
  launchControlRpm: number;
  antiLagEnabled: boolean;
  
  // Forced Induction (Turbo / Supercharger)
  forcedInductionType: 'NATURALLY_ASPIRATED' | 'SINGLE_TURBO' | 'TWIN_TURBO' | 'ROOTS_SUPERCHARGER' | 'CENTRIFUGAL_SUPERCHARGER';
  turboBoostPressureBar: number; // 0.0 to 3.5 bar
  wastegateCrackingPressureBar: number;
  blowOffValveAcousticProfile: 'AGGRESSIVE_STUTTER' | 'CLEAN_VENT' | 'TWIN_SCREAM' | 'SILENT_RECIRC';
  
  // Exhaust & Intake
  intakeManifoldType: 'STOCK_PLASTIC' | 'COLD_AIR_CARBON' | 'INDIVIDUAL_THROTTLE_BODIES';
  exhaustSystemType: 'STOCK_CAT' | 'SPORT_CAT_3INCH' | 'STRAIGHT_PIPE_TITANIUM' | 'HOOD_EXIT_SCREAMER';
  
  // Suspension Geometry & Alignment
  suspensionCoiloverType: 'OEM_FACTORY' | 'SPORT_LOWERED' | 'PRO_2WAY_ADJUSTABLE' | 'AIR_SUSPENSION_SLAM';
  rideHeightFrontMm: number; // 60 to 180mm
  rideHeightRearMm: number;
  camberFrontDeg: number; // -5.0 to 0.0 deg
  camberRearDeg: number;
  toeFrontDeg: number; // -1.0 to +1.0 deg
  toeRearDeg: number;
  casterFrontDeg: number; // 3.0 to 9.0 deg
  antiRollBarStiffnessFrontNm: number;
  antiRollBarStiffnessRearNm: number;
  damperReboundFrontPct: number;
  damperReboundRearPct: number;
  
  // Brakes & Tires
  brakePackageType: 'OEM_STEEL' | 'SLOTTED_SPORT_PADS' | 'CARBON_CERAMIC_6POT' | 'ENDURANCE_RACE_CALIPERS';
  brakeBiasFrontPct: number; // 40% to 75%
  tireCompound: 'STREET_ALL_SEASON' | 'SPORT_SUMMER' | 'SEMI_SLICK_TRACK' | 'FULL_SLICK_RACE' | 'RALLY_GRAVEL' | 'STUDDED_SNOW';
  tirePressureFrontPsi: number; // 22 to 40 psi
  tirePressureRearPsi: number;
  
  // Differential & Aerodynamics
  differentialType: 'OPEN' | 'VISCOUS_LSD' | '1.5_WAY_CLUTCH' | '2.0_WAY_DRIFT' | 'ELECTRONIC_VECTORING' | 'SPOOL_LOCKED';
  diffAccelLockPct: number; // 10% to 100%
  diffDecelLockPct: number;
  frontSplitterAngleDeg: number; // 0 to 15 deg
  rearWingAngleDeg: number; // 0 to 25 deg
  
  createdAt: string;
  updatedAt: string;
}

export const VehicleTuningSchema: TableSchema<VehicleTuningEntity> = {
  name: 'vehicle_tunings',
  primaryKey: 'id',
  indexes: ['vehicleId'],
  uniqueKeys: ['vehicleId'],
  foreignKeys: [
    {
      field: 'vehicleId',
      referencesTable: 'vehicles',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: true,
  softDeletes: false,
};
