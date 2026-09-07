/**
 * ============================================================================
 * REALDRIVE SEED DATA - URBAN DISTRICT PROPS, OBSTACLES & DESTRUCTIBLE OBJECTS
 * ============================================================================
 * Spatial coordinate registry of 3D physical world obstacles across all districts:
 * - High-intensity LED Streetlights & Highway Masts
 * - 4-Way Traffic Signal Rigging Gantries
 * - Crash Attenuator Sand/Water Inertial Barrels
 * - Steel Armco W-Beam Guardrails & Concrete K-Rails
 * - High-Speed Overhead Radar Speed Cameras
 * - Heavy Cast-Iron Fire Hydrants & Water Mains
 * - Animated Cyberpunk Neon Billboard Screens
 * - Public Transit Shelters & Urban Street Benches
 */

export type PropClassification = 
  | 'traffic_signal_mast'
  | 'led_streetlight_single'
  | 'highway_high_mast_light'
  | 'crash_attenuation_barrel'
  | 'concrete_jersey_barrier'
  | 'steel_armco_guardrail'
  | 'overhead_radar_gantry'
  | 'fire_hydrant_breakaway'
  | 'neon_billboard_video'
  | 'transit_bus_shelter'
  | 'ev_ultra_fast_charger';

export interface UrbanWorldProp {
  readonly propId: string;
  readonly classification: PropClassification;
  readonly districtId: string;
  readonly positionVec3: [number, number, number]; // [X, Y, Z]
  readonly rotationEulerDeg: [number, number, number];
  readonly boundingBoxSizeVec3: [number, number, number]; // [Width, Height, Depth]
  readonly massKg: number;
  readonly isDestructible: boolean;
  readonly breakImpulseThresholdNs: number; // Impulse required to snap / shatter
  readonly emitsLight: boolean;
  readonly lightColorHex: string;
  readonly lightIntensityLumens: number;
  readonly lightRangeM: number;
}

export const URBAN_PROPS_DATABASE: readonly UrbanWorldProp[] = [
  // ==========================================================================
  // DOWNTOWN FINANCIAL CORE PROPS
  // ==========================================================================
  {
    propId: 'prop_dt_sig_001',
    classification: 'traffic_signal_mast',
    districtId: 'downtown_financial',
    positionVec3: [8.5, 0.0, 145.0],
    rotationEulerDeg: [0, 90, 0],
    boundingBoxSizeVec3: [0.6, 6.5, 5.2],
    massKg: 450,
    isDestructible: true,
    breakImpulseThresholdNs: 85000,
    emitsLight: true,
    lightColorHex: '#00FF66',
    lightIntensityLumens: 2500,
    lightRangeM: 35.0
  },
  {
    propId: 'prop_dt_light_001',
    classification: 'led_streetlight_single',
    districtId: 'downtown_financial',
    positionVec3: [9.2, 0.0, 50.0],
    rotationEulerDeg: [0, 0, 0],
    boundingBoxSizeVec3: [0.4, 9.0, 1.8],
    massKg: 280,
    isDestructible: true,
    breakImpulseThresholdNs: 45000,
    emitsLight: true,
    lightColorHex: '#F0F8FF',
    lightIntensityLumens: 12000,
    lightRangeM: 28.0
  },
  {
    propId: 'prop_dt_light_002',
    classification: 'led_streetlight_single',
    districtId: 'downtown_financial',
    positionVec3: [-9.2, 0.0, 100.0],
    rotationEulerDeg: [0, 180, 0],
    boundingBoxSizeVec3: [0.4, 9.0, 1.8],
    massKg: 280,
    isDestructible: true,
    breakImpulseThresholdNs: 45000,
    emitsLight: true,
    lightColorHex: '#F0F8FF',
    lightIntensityLumens: 12000,
    lightRangeM: 28.0
  },
  {
    propId: 'prop_dt_hydrant_001',
    classification: 'fire_hydrant_breakaway',
    districtId: 'downtown_financial',
    positionVec3: [9.8, 0.0, 110.0],
    rotationEulerDeg: [0, 45, 0],
    boundingBoxSizeVec3: [0.5, 0.9, 0.5],
    massKg: 120,
    isDestructible: true,
    breakImpulseThresholdNs: 35000,
    emitsLight: false,
    lightColorHex: '#000000',
    lightIntensityLumens: 0,
    lightRangeM: 0
  },
  {
    propId: 'prop_dt_billboard_001',
    classification: 'neon_billboard_video',
    districtId: 'downtown_financial',
    positionVec3: [42.0, 15.0, 310.0],
    rotationEulerDeg: [0, -35, 0],
    boundingBoxSizeVec3: [12.0, 6.0, 0.8],
    massKg: 3500,
    isDestructible: false,
    breakImpulseThresholdNs: 999999,
    emitsLight: true,
    lightColorHex: '#00E5FF',
    lightIntensityLumens: 45000,
    lightRangeM: 65.0
  },
  {
    propId: 'prop_dt_shelter_001',
    classification: 'transit_bus_shelter',
    districtId: 'downtown_financial',
    positionVec3: [10.2, 0.0, 240.0],
    rotationEulerDeg: [0, 0, 0],
    boundingBoxSizeVec3: [4.5, 2.8, 1.6],
    massKg: 650,
    isDestructible: true,
    breakImpulseThresholdNs: 55000,
    emitsLight: true,
    lightColorHex: '#FFF8DC',
    lightIntensityLumens: 3500,
    lightRangeM: 15.0
  },
  {
    propId: 'prop_dt_charger_001',
    classification: 'ev_ultra_fast_charger',
    districtId: 'downtown_financial',
    positionVec3: [11.5, 0.0, 420.0],
    rotationEulerDeg: [0, -90, 0],
    boundingBoxSizeVec3: [0.9, 2.2, 0.8],
    massKg: 380,
    isDestructible: true,
    breakImpulseThresholdNs: 65000,
    emitsLight: true,
    lightColorHex: '#00FFAA',
    lightIntensityLumens: 1800,
    lightRangeM: 10.0
  },

  // ==========================================================================
  // PACIFIC COASTAL HIGHWAY PROPS
  // ==========================================================================
  {
    propId: 'prop_cst_barrier_001',
    classification: 'steel_armco_guardrail',
    districtId: 'oceanfront_coastal',
    positionVec3: [1440.0, 5.0, -115.0],
    rotationEulerDeg: [0, -55, 0],
    boundingBoxSizeVec3: [0.3, 0.9, 25.0],
    massKg: 1200,
    isDestructible: true,
    breakImpulseThresholdNs: 120000,
    emitsLight: false,
    lightColorHex: '#000000',
    lightIntensityLumens: 0,
    lightRangeM: 0
  },
  {
    propId: 'prop_cst_light_001',
    classification: 'highway_high_mast_light',
    districtId: 'oceanfront_coastal',
    positionVec3: [1460.0, 5.0, -125.0],
    rotationEulerDeg: [0, -55, 0],
    boundingBoxSizeVec3: [0.8, 16.0, 2.4],
    massKg: 850,
    isDestructible: true,
    breakImpulseThresholdNs: 95000,
    emitsLight: true,
    lightColorHex: '#FFE4B5',
    lightIntensityLumens: 28000,
    lightRangeM: 45.0
  },
  {
    propId: 'prop_cst_radar_001',
    classification: 'overhead_radar_gantry',
    districtId: 'oceanfront_coastal',
    positionVec3: [1800.0, 14.0, -400.0],
    rotationEulerDeg: [0, -50, 0],
    boundingBoxSizeVec3: [18.0, 7.5, 1.2],
    massKg: 4200,
    isDestructible: false,
    breakImpulseThresholdNs: 999999,
    emitsLight: true,
    lightColorHex: '#FF3300', // Speed enforcement strobe
    lightIntensityLumens: 15000,
    lightRangeM: 25.0
  },

  // ==========================================================================
  // MOUNT AKINA TOUGE CANYON PROPS
  // ==========================================================================
  {
    propId: 'prop_mtn_guardrail_001',
    classification: 'steel_armco_guardrail',
    districtId: 'mount_akina_touge',
    positionVec3: [1845.0, 115.0, -1605.0], // Hairpin 1 cliff-side barrier
    rotationEulerDeg: [0, 80, 0],
    boundingBoxSizeVec3: [0.4, 1.0, 35.0],
    massKg: 1800,
    isDestructible: false, // Cliff edge barrier is indestructible for safety
    breakImpulseThresholdNs: 999999,
    emitsLight: false,
    lightColorHex: '#000000',
    lightIntensityLumens: 0,
    lightRangeM: 0
  },
  {
    propId: 'prop_mtn_light_001',
    classification: 'led_streetlight_single',
    districtId: 'mount_akina_touge',
    positionVec3: [1855.0, 115.0, -1595.0],
    rotationEulerDeg: [0, 75, 0],
    boundingBoxSizeVec3: [0.4, 7.5, 1.5],
    massKg: 240,
    isDestructible: true,
    breakImpulseThresholdNs: 40000,
    emitsLight: true,
    lightColorHex: '#FFA500', // Amber mountain fog lamp
    lightIntensityLumens: 9500,
    lightRangeM: 22.0
  },

  // ==========================================================================
  // RED ROCK DESERT AUTOBAHN INTERSTATE PROPS
  // ==========================================================================
  {
    propId: 'prop_rdk_barrel_001',
    classification: 'crash_attenuation_barrel',
    districtId: 'red_rock_desert',
    positionVec3: [850.0, 140.0, -1336.0], // Exit ramp gore point
    rotationEulerDeg: [0, 0, 0],
    boundingBoxSizeVec3: [1.8, 1.2, 4.5],
    massKg: 950,
    isDestructible: true,
    breakImpulseThresholdNs: 20000,
    emitsLight: true,
    lightColorHex: '#FFCC00',
    lightIntensityLumens: 800,
    lightRangeM: 8.0
  },
  {
    propId: 'prop_rdk_jersey_001',
    classification: 'concrete_jersey_barrier',
    districtId: 'red_rock_desert',
    positionVec3: [0.0, 95.0, -1350.0],
    rotationEulerDeg: [0, 90, 0],
    boundingBoxSizeVec3: [0.6, 1.1, 50.0],
    massKg: 12500,
    isDestructible: false,
    breakImpulseThresholdNs: 999999,
    emitsLight: false,
    lightColorHex: '#000000',
    lightIntensityLumens: 0,
    lightRangeM: 0
  }
];

export class UrbanPropsSpatialRegistry {
  private static propsList: readonly UrbanWorldProp[] = URBAN_PROPS_DATABASE;

  public static getPropsInRadius(x: number, z: number, radiusM: number): UrbanWorldProp[] {
    const radiusSq = radiusM * radiusM;
    return this.propsList.filter(prop => {
      const dx = prop.positionVec3[0] - x;
      const dz = prop.positionVec3[2] - z;
      return (dx * dx + dz * dz) <= radiusSq;
    });
  }

  public static getLightEmittingProps(): UrbanWorldProp[] {
    return this.propsList.filter(p => p.emitsLight);
  }
}
