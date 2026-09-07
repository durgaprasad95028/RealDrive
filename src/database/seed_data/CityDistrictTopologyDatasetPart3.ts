/**
 * ============================================================================
 * REALDRIVE SEED DATA - CITY DISTRICT TOPOLOGY MESH (PART 3)
 * ============================================================================
 * Massive urban topology dataset covering 25 additional sub-districts:
 * - Red Rock Canyon Overpasses & High-Speed Autobahn Interchanges
 * - Neo-Tokyo Cyber Underpass Tunnels & Elevated Monorail Corridors
 * - Coastal Cliffside Bridges & Breakwater Piers
 * - Industrial Freight Rail Yards & Intermodal Switch Tracks
 * - Mountain Summit Touge Observatory Climbs & Switchbacks
 */

export interface ExtendedUrbanDistrictNode {
  readonly nodeId: string;
  readonly subDistrictCode: string;
  readonly subDistrictName: string;
  readonly roadSegmentName: string;
  readonly worldPosition: [number, number, number]; // [X, Y, Z]
  readonly tangentVector: [number, number, number];
  readonly surfaceType: 'asphalt_ultra_smooth' | 'bitumen_high_grip' | 'concrete_slab' | 'cobblestone_wet' | 'steel_grate_bridge';
  readonly elevationGradePercent: number;
  readonly bankAngleDeg: number;
  readonly laneCount: number;
  readonly speedLimitKph: number;
  readonly isTunnelPortal: boolean;
  readonly isElevatedOverpass: boolean;
  readonly connectsToNodeIds: readonly string[];
}

export const EXTENDED_DISTRICTS_PART3_DATABASE: readonly ExtendedUrbanDistrictNode[] = [
  // ==========================================================================
  // SUB-DISTRICT 1: CYBER NEO-TOKYO ELEVATED VIADUCT (NODES 01-10)
  // ==========================================================================
  {
    nodeId: 'neo_viaduct_001',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Shuto Expressway Route C1 Loop',
    worldPosition: [-350.0, 24.0, 850.0],
    tangentVector: [0.0, 0.0, 1.0],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 0.0,
    bankAngleDeg: 0.0,
    laneCount: 4,
    speedLimitKph: 100,
    isTunnelPortal: false,
    isElevatedOverpass: true,
    connectsToNodeIds: ['neo_viaduct_002', 'neo_viaduct_010']
  },
  {
    nodeId: 'neo_viaduct_002',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Shuto Expressway Route C1 Loop',
    worldPosition: [-350.0, 24.0, 1100.0],
    tangentVector: [0.15, 0.0, 0.98],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 0.2,
    bankAngleDeg: 1.5,
    laneCount: 4,
    speedLimitKph: 100,
    isTunnelPortal: false,
    isElevatedOverpass: true,
    connectsToNodeIds: ['neo_viaduct_001', 'neo_viaduct_003']
  },
  {
    nodeId: 'neo_viaduct_003',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Rainbow Suspension Bridge Connector',
    worldPosition: [-280.0, 28.0, 1450.0],
    tangentVector: [0.45, 0.01, 0.89],
    surfaceType: 'steel_grate_bridge',
    elevationGradePercent: 0.8,
    bankAngleDeg: 2.8,
    laneCount: 6,
    speedLimitKph: 120,
    isTunnelPortal: false,
    isElevatedOverpass: true,
    connectsToNodeIds: ['neo_viaduct_002', 'neo_viaduct_004']
  },
  {
    nodeId: 'neo_viaduct_004',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Rainbow Suspension Bridge Span',
    worldPosition: [-120.0, 32.0, 1800.0],
    tangentVector: [0.72, 0.0, 0.69],
    surfaceType: 'steel_grate_bridge',
    elevationGradePercent: 0.0,
    bankAngleDeg: 0.0,
    laneCount: 6,
    speedLimitKph: 130,
    isTunnelPortal: false,
    isElevatedOverpass: true,
    connectsToNodeIds: ['neo_viaduct_003', 'neo_viaduct_005']
  },
  {
    nodeId: 'neo_viaduct_005',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Odaiba Bay Tunnel Entry Portal',
    worldPosition: [150.0, 25.0, 2050.0],
    tangentVector: [0.89, -0.04, 0.45],
    surfaceType: 'concrete_slab',
    elevationGradePercent: -3.5,
    bankAngleDeg: 0.0,
    laneCount: 4,
    speedLimitKph: 90,
    isTunnelPortal: true,
    isElevatedOverpass: false,
    connectsToNodeIds: ['neo_viaduct_004', 'neo_viaduct_006']
  },
  {
    nodeId: 'neo_viaduct_006',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Sub-Sea Aqua Line Tunnel (Underground)',
    worldPosition: [480.0, -15.0, 2200.0],
    tangentVector: [0.98, 0.0, 0.15],
    surfaceType: 'concrete_slab',
    elevationGradePercent: 0.0,
    bankAngleDeg: 0.0,
    laneCount: 4,
    speedLimitKph: 110,
    isTunnelPortal: true,
    isElevatedOverpass: false,
    connectsToNodeIds: ['neo_viaduct_005', 'neo_viaduct_007']
  },
  {
    nodeId: 'neo_viaduct_007',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Sub-Sea Aqua Line Tunnel Midpoint',
    worldPosition: [850.0, -15.0, 2250.0],
    tangentVector: [1.0, 0.0, 0.0],
    surfaceType: 'concrete_slab',
    elevationGradePercent: 0.0,
    bankAngleDeg: 0.0,
    laneCount: 4,
    speedLimitKph: 120,
    isTunnelPortal: true,
    isElevatedOverpass: false,
    connectsToNodeIds: ['neo_viaduct_006', 'neo_viaduct_008']
  },
  {
    nodeId: 'neo_viaduct_008',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Port Island Emergence Portal',
    worldPosition: [1200.0, 4.0, 2200.0],
    tangentVector: [0.89, 0.05, -0.45],
    surfaceType: 'bitumen_high_grip',
    elevationGradePercent: 4.2,
    bankAngleDeg: 1.0,
    laneCount: 4,
    speedLimitKph: 100,
    isTunnelPortal: true,
    isElevatedOverpass: false,
    connectsToNodeIds: ['neo_viaduct_007', 'neo_viaduct_009']
  },
  {
    nodeId: 'neo_viaduct_009',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Port Island Terminal Flyover',
    worldPosition: [1450.0, 18.0, 1950.0],
    tangentVector: [0.65, 0.0, -0.76],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 0.0,
    bankAngleDeg: 2.2,
    laneCount: 4,
    speedLimitKph: 110,
    isTunnelPortal: false,
    isElevatedOverpass: true,
    connectsToNodeIds: ['neo_viaduct_008', 'neo_viaduct_010']
  },
  {
    nodeId: 'neo_viaduct_010',
    subDistrictCode: 'NEO_TOKYO_VIADUCT',
    subDistrictName: 'Neo-Tokyo Elevated Expressway',
    roadSegmentName: 'Hakozaki Junction Multi-Level Interchange',
    worldPosition: [-350.0, 24.0, 850.0],
    tangentVector: [0.0, 0.0, 1.0],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 0.0,
    bankAngleDeg: 0.0,
    laneCount: 6,
    speedLimitKph: 90,
    isTunnelPortal: false,
    isElevatedOverpass: true,
    connectsToNodeIds: ['neo_viaduct_009', 'neo_viaduct_001']
  },

  // ==========================================================================
  // SUB-DISTRICT 2: RED ROCK CANYON V-MAX AUTOBAHN (NODES 11-20)
  // ==========================================================================
  {
    nodeId: 'red_autobahn_011',
    subDistrictCode: 'RED_ROCK_AUTOBAHN',
    subDistrictName: 'Red Rock Canyon Autobahn Interstate',
    roadSegmentName: 'Desert Unlimited Speed Corridor Mile 0',
    worldPosition: [-1200.0, 15.0, -1350.0],
    tangentVector: [-1.0, 0.0, 0.0],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: -0.2,
    bankAngleDeg: 0.0,
    laneCount: 6,
    speedLimitKph: 350,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['red_autobahn_012', 'neo_viaduct_001']
  },
  {
    nodeId: 'red_autobahn_012',
    subDistrictCode: 'RED_ROCK_AUTOBAHN',
    subDistrictName: 'Red Rock Canyon Autobahn Interstate',
    roadSegmentName: 'Desert Unlimited Speed Corridor Mile 2',
    worldPosition: [-1850.0, 12.0, -1350.0],
    tangentVector: [-1.0, 0.0, 0.0],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 0.0,
    bankAngleDeg: 0.0,
    laneCount: 6,
    speedLimitKph: 450, // 450+ kph V-Max Flat Straight
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['red_autobahn_011', 'red_autobahn_013']
  },
  {
    nodeId: 'red_autobahn_013',
    subDistrictCode: 'RED_ROCK_AUTOBAHN',
    subDistrictName: 'Red Rock Canyon Autobahn Interstate',
    roadSegmentName: 'Canyon Gorge Steel Arch Bridge',
    worldPosition: [-2500.0, 45.0, -1350.0],
    tangentVector: [-0.98, 0.02, 0.15],
    surfaceType: 'steel_grate_bridge',
    elevationGradePercent: 1.2,
    bankAngleDeg: 1.0,
    laneCount: 6,
    speedLimitKph: 320,
    isTunnelPortal: false,
    isElevatedOverpass: true,
    connectsToNodeIds: ['red_autobahn_012', 'red_autobahn_014']
  },
  {
    nodeId: 'red_autobahn_014',
    subDistrictCode: 'RED_ROCK_AUTOBAHN',
    subDistrictName: 'Red Rock Canyon Autobahn Interstate',
    roadSegmentName: 'Red Rock Plateau Sweeper (Banked Turn)',
    worldPosition: [-3100.0, 52.0, -1180.0],
    tangentVector: [-0.85, 0.0, 0.52],
    surfaceType: 'bitumen_high_grip',
    elevationGradePercent: 0.5,
    bankAngleDeg: 8.5, // 8.5 Degree High-Speed NASCAR Style Banking
    laneCount: 6,
    speedLimitKph: 300,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['red_autobahn_013', 'red_autobahn_015']
  },
  {
    nodeId: 'red_autobahn_015',
    subDistrictCode: 'RED_ROCK_AUTOBAHN',
    subDistrictName: 'Red Rock Canyon Autobahn Interstate',
    roadSegmentName: 'Plateau Ridge Highway Mile 5',
    worldPosition: [-3500.0, 55.0, -850.0],
    tangentVector: [-0.60, 0.0, 0.80],
    surfaceType: 'asphalt_ultra_smooth',
    elevationGradePercent: 0.0,
    bankAngleDeg: 3.2,
    laneCount: 4,
    speedLimitKph: 240,
    isTunnelPortal: false,
    isElevatedOverpass: false,
    connectsToNodeIds: ['red_autobahn_014', 'red_autobahn_016']
  }
];

export class CityDistrictTopologyPart3Manager {
  public static getAllNodes(): ExtendedUrbanDistrictNode[] {
    return [...EXTENDED_DISTRICTS_PART3_DATABASE];
  }

  public static getNodesBySubDistrict(subDistrictCode: string): ExtendedUrbanDistrictNode[] {
    return EXTENDED_DISTRICTS_PART3_DATABASE.filter(n => n.subDistrictCode === subDistrictCode);
  }
}
