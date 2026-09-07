/**
 * ============================================================================
 * REALDRIVE SEED DATA - CAREER FREIGHT & HEAVY LOGISTICS MANIFESTS DATASET
 * ============================================================================
 * Master freight logistics contracts across regional transport corridors:
 * - Refrigerated Cryogenic Medical Pharmaceuticals (Temp stability monitoring)
 * - High-Octane Volatile Aviation & Racing Fuels (Rollover risk & explosion physics)
 * - Supercar Multi-Level Enclosed Transporters (Zero-damage cargo guarantee)
 * - Mining Heavy Excavator Transformers & Turbines (Oversize Escort Convoys)
 * - Fast Container Intermodal Drayage between Harbor Docks and Rail Terminals
 */

export type CargoClass = 
  | 'refrigerated_cryo'
  | 'hazardous_hazmat_fuel'
  | 'luxury_exotics_transporter'
  | 'oversize_heavy_machinery'
  | 'express_dry_van_parcel';

export interface FreightHaulContract {
  readonly contractId: string;
  readonly shipperCompanyName: string;
  readonly cargoClassification: CargoClass;
  readonly cargoDescription: string;
  readonly cargoMassKg: number;
  readonly originHub: string;
  readonly originCoordsVec3: [number, number, number];
  readonly destinationHub: string;
  readonly destinationCoordsVec3: [number, number, number];
  readonly routeDistanceKm: number;
  readonly timeWindowMinutes: number;
  readonly basePayUSD: number;
  readonly fuelSurchargeUSD: number;
  readonly onTimeBonusUSD: number;
  readonly requiredTrailerType: 'refrigerated_reefer' | 'hazmat_tanker' | 'enclosed_car_hauler' | 'lowboy_heavy_flatbed' | 'dry_van_48ft';
  readonly requiresPilotEscortCar: boolean;
  readonly maxSpeedLimitKph: number;
  readonly temperatureTargetC?: number; // Only for reefer loads
  readonly maxAllowableImpactDecelG: number;
}

export const FREIGHT_HAUL_CONTRACTS_DATABASE: readonly FreightHaulContract[] = [
  {
    contractId: 'frt_exotic_transporter_001',
    shipperCompanyName: 'Apex Hyperdynamics Logistics',
    cargoClassification: 'luxury_exotics_transporter',
    cargoDescription: '4x Homologated Le Mans Prototype Hypercars for Season Finale',
    cargoMassKg: 6500,
    originHub: 'Apex Factory Headquarters (Downtown)',
    originCoordsVec3: [120.0, 4.0, 500.0],
    destinationHub: 'RealDrive International Speedway Paddock',
    destinationCoordsVec3: [1800.0, 14.0, -400.0],
    routeDistanceKm: 18.5,
    timeWindowMinutes: 25,
    basePayUSD: 4500,
    fuelSurchargeUSD: 450,
    onTimeBonusUSD: 1500,
    requiredTrailerType: 'enclosed_car_hauler',
    requiresPilotEscortCar: false,
    maxSpeedLimitKph: 100,
    maxAllowableImpactDecelG: 0.65
  },
  {
    contractId: 'frt_cryo_pharma_002',
    shipperCompanyName: 'BioVax Global Cold Chain',
    cargoClassification: 'refrigerated_cryo',
    cargoDescription: '20,000 Vials mRNA Cellular Vaccines at -80°C Cryogenic Cold',
    cargoMassKg: 12000,
    originHub: 'Port Harbor Biomedical Cargo Terminal',
    originCoordsVec3: [620.0, 1.5, 1400.0],
    destinationHub: 'Metropolitan Central Medical Research Hospital',
    destinationCoordsVec3: [0.0, 0.0, 150.0],
    routeDistanceKm: 14.2,
    timeWindowMinutes: 18,
    basePayUSD: 3800,
    fuelSurchargeUSD: 380,
    onTimeBonusUSD: 1200,
    requiredTrailerType: 'refrigerated_reefer',
    requiresPilotEscortCar: false,
    maxSpeedLimitKph: 90,
    temperatureTargetC: -80.0,
    maxAllowableImpactDecelG: 0.50
  },
  {
    contractId: 'frt_hazmat_fuel_003',
    shipperCompanyName: 'NitroOctane Refining Distribution',
    cargoClassification: 'hazardous_hazmat_fuel',
    cargoDescription: '36,000 Liters 105-Octane Synthetic Motorsport E-Fuel',
    cargoMassKg: 28500,
    originHub: 'Harbor Petrochemical Tank Farm Terminal 4',
    originCoordsVec3: [950.0, 1.5, 1600.0],
    destinationHub: 'Red Rock Desert Speedway Fuel Depots',
    destinationCoordsVec3: [850.0, 140.0, -1350.0],
    routeDistanceKm: 32.0,
    timeWindowMinutes: 35,
    basePayUSD: 6200,
    fuelSurchargeUSD: 850,
    onTimeBonusUSD: 2000,
    requiredTrailerType: 'hazmat_tanker',
    requiresPilotEscortCar: true,
    maxSpeedLimitKph: 80,
    maxAllowableImpactDecelG: 0.40 // Low G to avoid liquid sloshing rollover
  },
  {
    contractId: 'frt_heavy_turbine_004',
    shipperCompanyName: 'Vortex Power Grid Dynamics',
    cargoClassification: 'oversize_heavy_machinery',
    cargoDescription: '120-Ton Wind Turbine Generator Nacelle & Billet Rotor Hub',
    cargoMassKg: 68000,
    originHub: 'Port Heavy Container Gantry Crane Dock 1',
    originCoordsVec3: [500.0, 2.0, 1050.0],
    destinationHub: 'Red Rock Wind Farm Substation Alpha',
    destinationCoordsVec3: [-200.0, 65.0, -1350.0],
    routeDistanceKm: 28.0,
    timeWindowMinutes: 50,
    basePayUSD: 14500,
    fuelSurchargeUSD: 1800,
    onTimeBonusUSD: 4000,
    requiredTrailerType: 'lowboy_heavy_flatbed',
    requiresPilotEscortCar: true,
    maxSpeedLimitKph: 60,
    maxAllowableImpactDecelG: 0.35
  }
];

export class CareerFreightLogisticsService {
  public static getAllContracts(): FreightHaulContract[] {
    return [...FREIGHT_HAUL_CONTRACTS_DATABASE];
  }

  public static getContractById(id: string): FreightHaulContract | undefined {
    return FREIGHT_HAUL_CONTRACTS_DATABASE.find(c => c.contractId === id);
  }

  public static evaluateDeliveryCompletion(
    contract: FreightHaulContract,
    deliveryTimeMinutes: number,
    cargoDamagePercent: number,
    reeferTempExcursionMaxC?: number
  ): {
    totalPayoutUSD: number;
    penaltiesUSD: number;
    deliveredOnTime: boolean;
    cargoPassedInspection: boolean;
    summaryMessage: string;
  } {
    let payout = contract.basePayUSD + contract.fuelSurchargeUSD;
    let penalties = 0;
    const onTime = deliveryTimeMinutes <= contract.timeWindowMinutes;

    if (onTime) {
      payout += contract.onTimeBonusUSD;
    } else {
      const lateMinutes = deliveryTimeMinutes - contract.timeWindowMinutes;
      penalties += lateMinutes * 150;
    }

    if (cargoDamagePercent > 0) {
      const damageCost = (cargoDamagePercent / 100.0) * (contract.basePayUSD * 2.5);
      penalties += damageCost;
    }

    if (contract.temperatureTargetC !== undefined && reeferTempExcursionMaxC !== undefined) {
      if (reeferTempExcursionMaxC > (contract.temperatureTargetC + 5.0)) {
        // Cargo spoiled
        penalties += contract.basePayUSD;
      }
    }

    const netPayout = Math.max(0, Math.round(payout - penalties));
    const passed = penalties < contract.basePayUSD * 0.3;

    return {
      totalPayoutUSD: netPayout,
      penaltiesUSD: Math.round(penalties),
      deliveredOnTime: onTime,
      cargoPassedInspection: passed,
      summaryMessage: passed ? 'Cargo delivered successfully and passed receiver quality audit.' : 'Severe cargo damage or temperature excursion during transit. Major penalties assessed.'
    };
  }
}
