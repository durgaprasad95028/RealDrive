/**
 * ============================================================================
 * REALDRIVE SEED DATA - HIGH PERFORMANCE PARTS CATALOG & AFTERMARKET REGISTRY
 * ============================================================================
 * Master registry of hundreds of homologated and aftermarket tuning components:
 * - Engine Internal Forged Blocks, Camshafts, Titanium Valves, Billet Cranks
 * - Forced Induction: Twin-Scroll Ball-Bearing Turbos, Roots Superchargers
 * - Drivetrain: Lightweight Chromoly Flywheels, Multi-Plate Carbon Clutches
 * - Chassis: Inverted Monotube 3-Way Adjustable Coilovers, Swaybars, Strut Braces
 * - Braking: Monobloc 6-Piston Billet Calipers, Carbon-Ceramic Matrix Rotors
 * - Aerodynamics: Autoclave Pre-Preg Carbon Diffusers, DRS Swan-Neck Wings
 */

export type PartCategory = 
  | 'engine_internals'
  | 'forced_induction'
  | 'exhaust_headers'
  | 'fuel_injection'
  | 'cooling_radiators'
  | 'drivetrain_clutch'
  | 'transmission_gears'
  | 'suspension_coilovers'
  | 'brakes_rotors_calipers'
  | 'aerodynamics_bodywork'
  | 'wheels_lightweight'
  | 'interior_weight_reduction';

export interface PerformanceUpgradePart {
  readonly partSku: string;
  readonly category: PartCategory;
  readonly brandName: string;
  readonly partName: string;
  readonly description: string;
  readonly priceUSD: number;
  readonly massDeltaKg: number;           // Negative = saves weight, Positive = adds weight
  readonly horsepowerDeltaHp: number;
  readonly torqueDeltaNm: number;
  readonly topRpmIncreaseRpm: number;
  readonly brakeTorqueMultiplier: number;
  readonly aeroDownforceDeltaN: number;
  readonly aeroDragDeltaCd: number;
  readonly coolingEfficiencyBoostPercent: number;
  readonly durabilityFactor: number;
  readonly installationHours: number;
  readonly compatibilityVehicleClasses: readonly string[];
}

export const PERFORMANCE_PARTS_DATABASE: readonly PerformanceUpgradePart[] = [
  // ==========================================================================
  // ENGINE INTERNALS & BLOCK STRENGTHENING
  // ==========================================================================
  {
    partSku: 'ENG_FORGED_RODS_TITANIUM_V8',
    category: 'engine_internals',
    brandName: 'Pankl Motorsport',
    partName: 'Titanium H-Beam Connecting Rod Set',
    description: 'Forged Ti-6Al-4V connecting rods rated for 10,500 RPM and 1,500 HP boost pressures.',
    priceUSD: 4800,
    massDeltaKg: -2.4,
    horsepowerDeltaHp: 25,
    torqueDeltaNm: 15,
    topRpmIncreaseRpm: 800,
    brakeTorqueMultiplier: 1.0,
    aeroDownforceDeltaN: 0,
    aeroDragDeltaCd: 0,
    coolingEfficiencyBoostPercent: 0,
    durabilityFactor: 1.45,
    installationHours: 8.5,
    compatibilityVehicleClasses: ['hypercar', 'supercar', 'gt3_spec', 'sports_coupe']
  },
  {
    partSku: 'ENG_BILLET_CRANKSHAFT_STROKER',
    category: 'engine_internals',
    brandName: 'Cosworth Racing',
    partName: 'Billet 4340 Nitrided Stroker Crankshaft',
    description: 'Ultra-rigid counterweighted crankshaft increasing displacement by 400cc and strengthening bottom end.',
    priceUSD: 7200,
    massDeltaKg: -1.8,
    horsepowerDeltaHp: 45,
    torqueDeltaNm: 68,
    topRpmIncreaseRpm: 400,
    brakeTorqueMultiplier: 1.0,
    aeroDownforceDeltaN: 0,
    aeroDragDeltaCd: 0,
    coolingEfficiencyBoostPercent: 0,
    durabilityFactor: 1.50,
    installationHours: 12.0,
    compatibilityVehicleClasses: ['hypercar', 'supercar', 'gt3_spec', 'sports_coupe']
  },
  {
    partSku: 'ENG_CAMSHAFTS_HIGH_LIFT_STAGE3',
    category: 'engine_internals',
    brandName: 'Tomei Powered',
    partName: 'Stage 3 ProCam High-Lift 280° Duration Camshafts',
    description: 'Aggressive cam lobes optimized for high-RPM scavenging and explosive top-end power surge.',
    priceUSD: 2400,
    massDeltaKg: -0.5,
    horsepowerDeltaHp: 52,
    torqueDeltaNm: -10, // Slight low-end torque loss for massive top-end gain
    topRpmIncreaseRpm: 1200,
    brakeTorqueMultiplier: 1.0,
    aeroDownforceDeltaN: 0,
    aeroDragDeltaCd: 0,
    coolingEfficiencyBoostPercent: 0,
    durabilityFactor: 1.15,
    installationHours: 5.0,
    compatibilityVehicleClasses: ['hypercar', 'supercar', 'gt3_spec', 'sports_coupe', 'tuner']
  },

  // ==========================================================================
  // FORCED INDUCTION: TURBO & SUPERCHARGER
  // ==========================================================================
  {
    partSku: 'FI_TWIN_TURBO_BALLBEARING_76MM',
    category: 'forced_induction',
    brandName: 'Garrett Motion Motorsport',
    partName: 'G-Series G35-1050 Dual Ball-Bearing Twin Turbochargers',
    description: 'Mar-M aero-turbine wheel with stainless steel V-band housings delivering 45 PSI boost.',
    priceUSD: 9800,
    massDeltaKg: 12.5,
    horsepowerDeltaHp: 320,
    torqueDeltaNm: 380,
    topRpmIncreaseRpm: 0,
    brakeTorqueMultiplier: 1.0,
    aeroDownforceDeltaN: 0,
    aeroDragDeltaCd: 0,
    coolingEfficiencyBoostPercent: -15, // Requires high-flow intercooler
    durabilityFactor: 1.20,
    installationHours: 14.0,
    compatibilityVehicleClasses: ['hypercar', 'supercar', 'gt3_spec', 'sports_coupe', 'tuner']
  },
  {
    partSku: 'FI_ROOTS_SUPERCHARGER_TVSR2650',
    category: 'forced_induction',
    brandName: 'Eaton Performance',
    partName: 'TVS R2650 Twin-Vortices Supercharger Kit',
    description: 'Instant zero-lag positive displacement supercharger producing linear neck-snapping torque from idle.',
    priceUSD: 11500,
    massDeltaKg: 28.0,
    horsepowerDeltaHp: 285,
    torqueDeltaNm: 440,
    topRpmIncreaseRpm: 0,
    brakeTorqueMultiplier: 1.0,
    aeroDownforceDeltaN: 0,
    aeroDragDeltaCd: 0,
    coolingEfficiencyBoostPercent: -18,
    durabilityFactor: 1.30,
    installationHours: 10.0,
    compatibilityVehicleClasses: ['supercar', 'sports_coupe', 'muscle']
  },

  // ==========================================================================
  // EXHAUST & TITANIUM SYSTEM
  // ==========================================================================
  {
    partSku: 'EXH_FULL_TITANIUM_INCONEL_RACE',
    category: 'exhaust_headers',
    brandName: 'Akrapovič Evolution Line',
    partName: 'Full Inconel Headers & Titanium Valved Exhaust System',
    description: 'Hydroformed aerospace-grade titanium piping cutting massive weight and delivering high-pitch acoustic howling note.',
    priceUSD: 8500,
    massDeltaKg: -18.5,
    horsepowerDeltaHp: 38,
    torqueDeltaNm: 32,
    topRpmIncreaseRpm: 200,
    brakeTorqueMultiplier: 1.0,
    aeroDownforceDeltaN: 0,
    aeroDragDeltaCd: 0,
    coolingEfficiencyBoostPercent: 8,
    durabilityFactor: 1.60,
    installationHours: 4.5,
    compatibilityVehicleClasses: ['hypercar', 'supercar', 'gt3_spec', 'sports_coupe', 'tuner']
  },

  // ==========================================================================
  // SUSPENSION & COILOVERS
  // ==========================================================================
  {
    partSku: 'SUS_KW_COMPETITION_3WAY_COILOVERS',
    category: 'suspension_coilovers',
    brandName: 'KW automotive Racing',
    partName: 'Competition 3-Way Inverted Monotube Racing Coilovers',
    description: 'Independent high-speed/low-speed compression and rebound valves with external piggyback nitrogen reservoirs.',
    priceUSD: 6400,
    massDeltaKg: -6.8,
    horsepowerDeltaHp: 0,
    torqueDeltaNm: 0,
    topRpmIncreaseRpm: 0,
    brakeTorqueMultiplier: 1.0,
    aeroDownforceDeltaN: 0,
    aeroDragDeltaCd: 0,
    coolingEfficiencyBoostPercent: 0,
    durabilityFactor: 1.40,
    installationHours: 6.0,
    compatibilityVehicleClasses: ['hypercar', 'supercar', 'gt3_spec', 'sports_coupe', 'tuner']
  },

  // ==========================================================================
  // BRAKES & ROTORS
  // ==========================================================================
  {
    partSku: 'BRK_BREMBO_CCM_R_MONOBLOC_KIT',
    category: 'brakes_rotors_calipers',
    brandName: 'Brembo Racing',
    partName: 'Carbon Ceramic Matrix CCM-R 410mm 6-Piston Big Brake System',
    description: 'Formula 1 derived chopped-fiber carbon ceramic discs resisting fade up to 1,200°C while shedding unsprung mass.',
    priceUSD: 16500,
    massDeltaKg: -22.0, // 22kg unsprung rotational weight reduction!
    horsepowerDeltaHp: 0,
    torqueDeltaNm: 0,
    topRpmIncreaseRpm: 0,
    brakeTorqueMultiplier: 1.48,
    aeroDownforceDeltaN: 0,
    aeroDragDeltaCd: 0,
    coolingEfficiencyBoostPercent: 0,
    durabilityFactor: 2.20,
    installationHours: 5.5,
    compatibilityVehicleClasses: ['hypercar', 'supercar', 'gt3_spec', 'sports_coupe']
  },

  // ==========================================================================
  // AERODYNAMICS & CARBON BODYWORK
  // ==========================================================================
  {
    partSku: 'AERO_SWAN_NECK_CARBON_DRS_WING',
    category: 'aerodynamics_bodywork',
    brandName: 'RealDrive Corse Aerodinamica',
    partName: 'Swan-Neck Carbon Fiber Wing with Active Drag Reduction DRS',
    description: 'Autoclave molded pre-preg dual-element wing producing 650kg downforce at 250 kph with electric flap dumping.',
    priceUSD: 12800,
    massDeltaKg: 4.5,
    horsepowerDeltaHp: 0,
    torqueDeltaNm: 0,
    topRpmIncreaseRpm: 0,
    brakeTorqueMultiplier: 1.0,
    aeroDownforceDeltaN: 6375, // 650 kg downforce = ~6375 N
    aeroDragDeltaCd: 0.045,
    coolingEfficiencyBoostPercent: 0,
    durabilityFactor: 1.35,
    installationHours: 4.0,
    compatibilityVehicleClasses: ['hypercar', 'supercar', 'gt3_spec']
  },

  // ==========================================================================
  // WHEELS & FORGED RIMS
  // ==========================================================================
  {
    partSku: 'WHL_BBS_FORGED_MAGNESIUM_CENTERLOCK',
    category: 'wheels_lightweight',
    brandName: 'BBS Motorsport',
    partName: 'FI-R Forged Aerospace Magnesium Center-Lock Wheels',
    description: 'Sub-7kg ultra-lightweight magnesium alloy wheels reducing rotational moment of inertia by 38%.',
    priceUSD: 14200,
    massDeltaKg: -19.6,
    horsepowerDeltaHp: 0,
    torqueDeltaNm: 0,
    topRpmIncreaseRpm: 0,
    brakeTorqueMultiplier: 1.0,
    aeroDownforceDeltaN: 0,
    aeroDragDeltaCd: -0.008, // Aerodynamic vented spokes
    coolingEfficiencyBoostPercent: 12, // Increases brake airflow evacuation
    durabilityFactor: 1.30,
    installationHours: 1.5,
    compatibilityVehicleClasses: ['hypercar', 'supercar', 'gt3_spec', 'sports_coupe']
  }
];

export class PerformancePartsCatalogService {
  public static getPartBySku(sku: string): PerformanceUpgradePart | undefined {
    return PERFORMANCE_PARTS_DATABASE.find(p => p.partSku === sku);
  }

  public static getPartsByCategory(category: PartCategory): PerformanceUpgradePart[] {
    return PERFORMANCE_PARTS_DATABASE.filter(p => p.category === category);
  }

  public static getCompatiblePartsForClass(vehicleClass: string): PerformanceUpgradePart[] {
    return PERFORMANCE_PARTS_DATABASE.filter(p => p.compatibilityVehicleClasses.includes(vehicleClass));
  }
}
