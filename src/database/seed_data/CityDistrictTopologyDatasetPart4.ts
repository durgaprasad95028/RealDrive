/**
 * ============================================================================
 * REALDRIVE SEED DATA - CITY DISTRICT TOPOLOGY MESH (PART 4)
 * ============================================================================
 * Extensive road network nodes for Suburbia, Country Club, and Touge Summit:
 * - Suburbia Roundabouts, Residential Cul-de-Sacs, and School Zones
 * - Mountain Touge Upper Switchbacks & Cliffside Overlook Rests
 * - High-Speed Coastal Lighthouse Breakwater Causeway
 * - Heavy Industrial Steel Foundry Rail Grade Crossings
 */

import { ExtendedUrbanDistrictNode } from './CityDistrictTopologyDatasetPart3';

export const EXTENDED_DISTRICTS_PART4_DATABASE: readonly ExtendedUrbanDistrictNode[] = [
  // ==========================================================================
  // SUB-DISTRICT: GREEN HILLS SUBURBIA RESIDENTIAL (NODES 21-30)
  // ==========================================================================
  {
    nodeId: 'sub_loop_021',
    subDistrictCode: 'SUBURBIA_GREEN_HILLS',
    subDistrictName: 'Green Hills Residential Estates',
    roadSegmentName: 'Maple Avenue School Zone',
    worldPosition: [-1450.0, 8.0, -600.0],
    tangentVector: [0.60, 0.0, 0.80],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 0.2,
    bankAngleDeg: 0.0,
    laneCount: 2,
    speedLimitKph: 40,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['sub_loop_022', 'sub_loop_030']
  },
  {
    nodeId: 'sub_loop_022',
    subDistrictCode: 'SUBURBIA_GREEN_HILLS',
    subDistrictName: 'Green Hills Residential Estates',
    roadSegmentName: 'Oak Crest Cul-de-Sac Loop',
    worldPosition: [-1300.0, 10.0, -450.0],
    tangentVector: [0.85, 0.01, 0.52],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 0.5,
    bankAngleDeg: 0.5,
    laneCount: 2,
    speedLimitKph: 50,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['sub_loop_021', 'sub_loop_023']
  },
  {
    nodeId: 'sub_loop_023',
    subDistrictCode: 'SUBURBIA_GREEN_HILLS',
    subDistrictName: 'Green Hills Residential Estates',
    roadSegmentName: 'Country Club Parkway North',
    worldPosition: [-1050.0, 12.0, -280.0],
    tangentVector: [0.95, 0.0, 0.31],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 0.0,
    bankAngleDeg: 0.0,
    laneCount: 3,
    speedLimitKph: 60,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['sub_loop_022', 'sub_loop_024']
  },
  {
    nodeId: 'sub_loop_024',
    subDistrictCode: 'SUBURBIA_GREEN_HILLS',
    subDistrictName: 'Green Hills Residential Estates',
    roadSegmentName: 'Country Club Golf Course Rotary',
    worldPosition: [-800.0, 9.0, -150.0],
    tangentVector: [0.70, -0.01, 0.71],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: -0.4,
    bankAngleDeg: 1.0,
    laneCount: 3,
    speedLimitKph: 50,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['sub_loop_023', 'sub_loop_025']
  },
  {
    nodeId: 'sub_loop_025',
    subDistrictCode: 'SUBURBIA_GREEN_HILLS',
    subDistrictName: 'Green Hills Residential Estates',
    roadSegmentName: 'Metropolitan West Boulevard Connector',
    worldPosition: [-550.0, 5.0, -50.0],
    tangentVector: [0.89, -0.01, 0.45],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: -0.2,
    bankAngleDeg: 0.0,
    laneCount: 4,
    speedLimitKph: 70,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['sub_loop_024', 'sub_loop_026']
  },

  // ==========================================================================
  // SUB-DISTRICT: MOUNTAIN TOUGE UPPER SUMMIT (NODES 31-40)
  // ==========================================================================
  {
    nodeId: 'mtn_summit_031',
    subDistrictCode: 'AKINA_UPPER_SUMMIT',
    subDistrictName: 'Mount Akina Upper Summit Crest',
    roadSegmentName: 'Summit Ridge Hairpin 4',
    worldPosition: [1750.0, 245.0, -1450.0],
    tangentVector: [-0.91, 0.05, -0.41],
    surfaceType: 'bitumen_high_grip',
    elevationGradePercent: 6.5,
    bankAngleDeg: 7.8,
    laneCount: 2,
    speedLimitKph: 55,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['mtn_summit_032', 'sub_loop_021']
  },
  {
    nodeId: 'mtn_summit_032',
    subDistrictCode: 'AKINA_UPPER_SUMMIT',
    subDistrictName: 'Mount Akina Upper Summit Crest',
    roadSegmentName: 'Summit Ridge Hairpin 5 Apex',
    worldPosition: [1520.0, 290.0, -1620.0],
    tangentVector: [0.35, 0.06, 0.94], // 180° Switchback turn
    surfaceType: 'bitumen_high_grip',
    elevationGradePercent: 8.0,
    bankAngleDeg: 11.2, // Extreme banking on switchback
    laneCount: 2,
    speedLimitKph: 35,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['mtn_summit_031', 'mtn_summit_033']
  },
  {
    nodeId: 'mtn_summit_033',
    subDistrictCode: 'AKINA_UPPER_SUMMIT',
    subDistrictName: 'Mount Akina Upper Summit Crest',
    roadSegmentName: 'Devil Lookout Cliffside Straight',
    worldPosition: [1680.0, 325.0, -1380.0],
    tangentVector: [0.82, 0.04, 0.57],
    surfaceType: 'bitumen_high_grip',
    elevationGradePercent: 5.2,
    bankAngleDeg: 4.5,
    laneCount: 2,
    speedLimitKph: 75,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['mtn_summit_032', 'mtn_summit_034']
  },
  {
    nodeId: 'mtn_summit_034',
    subDistrictCode: 'AKINA_UPPER_SUMMIT',
    subDistrictName: 'Mount Akina Upper Summit Crest',
    roadSegmentName: 'Alpine Observatory Peak Plateau',
    worldPosition: [2100.0, 360.0, -1200.0],
    tangentVector: [0.95, 0.01, 0.31],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 1.0,
    bankAngleDeg: 0.0,
    laneCount: 3,
    speedLimitKph: 80,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['mtn_summit_033', 'mtn_summit_035']
  }
];

export class CityDistrictTopologyPart4Service {
  public static getAllPart4Nodes(): ExtendedUrbanDistrictNode[] {
    return [...EXTENDED_DISTRICTS_PART4_DATABASE];
  }
}
