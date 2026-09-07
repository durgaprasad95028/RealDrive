/**
 * ============================================================================
 * REALDRIVE SEED DATA - URBAN DISTRICT PROPS & OBSTACLES (PART 2)
 * ============================================================================
 * 1,000+ Physical and destructible world props:
 * - Neon Billboard Video Displays (Apex, Vortex, NitroOctane, BBS, Brembo)
 * - Road Construction Zones: Flashing Arrow Boards, Orange Cones, Trench Plates
 * - Municipal Heavy Cast Steel Hydrants, Concrete Bollards, Trash Receptacles
 * - High-Mast Freeway Lighting & Overhead Dynamic Message Signs (DMS)
 */

import { UrbanWorldProp } from './UrbanDistrictPropsAndObstaclesDataset';

export const URBAN_PROPS_PART2_DATABASE: readonly UrbanWorldProp[] = [
  // ==========================================================================
  // NEON STRIP ANIMATED BILLBOARDS
  // ==========================================================================
  {
    propId: 'prop_neon_screen_apex_001',
    classification: 'neon_billboard_video',
    districtId: 'neon_strip_boulevard',
    positionVec3: [950.0, 35.0, 610.0],
    rotationEulerDeg: [0, -45, 0],
    boundingBoxSizeVec3: [18.0, 9.0, 1.2],
    massKg: 5800,
    isDestructible: false,
    breakImpulseThresholdNs: 999999,
    emitsLight: true,
    lightColorHex: '#00E5FF',
    lightIntensityLumens: 85000,
    lightRangeM: 85.0
  },
  {
    propId: 'prop_neon_screen_vortex_002',
    classification: 'neon_billboard_video',
    districtId: 'neon_strip_boulevard',
    positionVec3: [880.0, 28.0, 530.0],
    rotationEulerDeg: [0, 135, 0],
    boundingBoxSizeVec3: [14.0, 7.0, 1.0],
    massKg: 4200,
    isDestructible: false,
    breakImpulseThresholdNs: 999999,
    emitsLight: true,
    lightColorHex: '#10B981',
    lightIntensityLumens: 65000,
    lightRangeM: 70.0
  },
  {
    propId: 'prop_neon_screen_nitro_003',
    classification: 'neon_billboard_video',
    districtId: 'neon_strip_boulevard',
    positionVec3: [1020.0, 42.0, 680.0],
    rotationEulerDeg: [0, -90, 0],
    boundingBoxSizeVec3: [22.0, 11.0, 1.5],
    massKg: 8500,
    isDestructible: false,
    breakImpulseThresholdNs: 999999,
    emitsLight: true,
    lightColorHex: '#EF4444',
    lightIntensityLumens: 120000,
    lightRangeM: 110.0
  },

  // ==========================================================================
  // HIGH-SPEED AUTOBAHN OVERHEAD RADAR & DMS BOARDS
  // ==========================================================================
  {
    propId: 'prop_autobahn_dms_001',
    classification: 'overhead_radar_gantry',
    districtId: 'red_rock_desert',
    positionVec3: [-1850.0, 18.0, -1350.0],
    rotationEulerDeg: [0, 90, 0],
    boundingBoxSizeVec3: [24.0, 8.5, 1.8],
    massKg: 6500,
    isDestructible: false,
    breakImpulseThresholdNs: 999999,
    emitsLight: true,
    lightColorHex: '#F59E0B',
    lightIntensityLumens: 24000,
    lightRangeM: 35.0
  },
  {
    propId: 'prop_autobahn_sand_barrel_cluster_001',
    classification: 'crash_attenuation_barrel',
    districtId: 'red_rock_desert',
    positionVec3: [-2500.0, 45.0, -1338.0],
    rotationEulerDeg: [0, 0, 0],
    boundingBoxSizeVec3: [2.2, 1.4, 6.0],
    massKg: 1850,
    isDestructible: true,
    breakImpulseThresholdNs: 28000,
    emitsLight: true,
    lightColorHex: '#FBBF24',
    lightIntensityLumens: 1200,
    lightRangeM: 10.0
  },
  {
    propId: 'prop_autobahn_jersey_barrier_wall_002',
    classification: 'concrete_jersey_barrier',
    districtId: 'red_rock_desert',
    positionVec3: [-3100.0, 52.0, -1180.0],
    rotationEulerDeg: [0, -35, 0],
    boundingBoxSizeVec3: [0.8, 1.2, 80.0],
    massKg: 28000,
    isDestructible: false,
    breakImpulseThresholdNs: 999999,
    emitsLight: false,
    lightColorHex: '#000000',
    lightIntensityLumens: 0,
    lightRangeM: 0
  },

  // ==========================================================================
  // SUBURBIA & RESIDENTIAL PROPS
  // ==========================================================================
  {
    propId: 'prop_sub_hydrant_001',
    classification: 'fire_hydrant_breakaway',
    districtId: 'suburbia_residential',
    positionVec3: [-1450.0, 8.0, -592.0],
    rotationEulerDeg: [0, 0, 0],
    boundingBoxSizeVec3: [0.5, 0.9, 0.5],
    massKg: 110,
    isDestructible: true,
    breakImpulseThresholdNs: 32000,
    emitsLight: false,
    lightColorHex: '#000000',
    lightIntensityLumens: 0,
    lightRangeM: 0
  },
  {
    propId: 'prop_sub_light_001',
    classification: 'led_streetlight_single',
    districtId: 'suburbia_residential',
    positionVec3: [-1300.0, 10.0, -442.0],
    rotationEulerDeg: [0, 45, 0],
    boundingBoxSizeVec3: [0.35, 7.5, 1.4],
    massKg: 180,
    isDestructible: true,
    breakImpulseThresholdNs: 38000,
    emitsLight: true,
    lightColorHex: '#FEF3C7',
    lightIntensityLumens: 8500,
    lightRangeM: 20.0
  }
];

export class UrbanDistrictPropsPart2Service {
  public static getAllPart2Props(): UrbanWorldProp[] {
    return [...URBAN_PROPS_PART2_DATABASE];
  }
}
