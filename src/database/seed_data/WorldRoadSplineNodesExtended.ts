/**
 * ============================================================================
 * REALDRIVE SEED DATA - EXTENDED WORLD ROAD SPLINE NODES & TOPOLOGY MESH
 * ============================================================================
 * Comprehensive 3D spline vector nodes spanning 7 distinct open-world districts:
 * 1. Downtown Financial Metropolis (Grid & Overpasses)
 * 2. Oceanfront Pacific Highway (Sweeping High-Speed Coastal Curves)
 * 3. Mount Akina Touge Canyon (Technical Hairpins & Switchbacks)
 * 4. Industrial Harbor Shipping Docks (Wide Loading Zones & Rail Crossings)
 * 5. Cyberpunk Neon Boulevard (Elevated Viaducts & Multi-Level Flyovers)
 * 6. Red Rock Desert Interstate (High-Speed Flat Out V-Max Straights)
 * 7. Green Hills Suburbia (Chicanes, Roundabouts, and Residential Loops)
 */

export interface RoadSplineNode {
  readonly nodeId: string;
  readonly districtId: string;
  readonly districtName: string;
  readonly positionVec3: [number, number, number]; // [X, Y, Z] in meters
  readonly forwardTangentVec3: [number, number, number];
  readonly upNormalVec3: [number, number, number];
  readonly roadWidthM: number;
  readonly laneCount: number;
  readonly speedLimitKph: number;
  readonly bankAngleDeg: number;
  readonly elevationGradePercent: number;
  readonly surfaceFrictionMu: number;
  readonly surfaceType: 'smooth_asphalt' | 'grooved_concrete' | 'wet_cobblestone' | 'coastal_tarmac' | 'mountain_bitumen';
  readonly isTunnelSection: boolean;
  readonly isBridgeSection: boolean;
  readonly connectedNodeIds: readonly string[];
}

export const WORLD_ROAD_SPLINE_NODES: readonly RoadSplineNode[] = [
  // ==========================================================================
  // DISTRICT 1: DOWNTOWN FINANCIAL METROPOLIS
  // ==========================================================================
  {
    nodeId: 'dt_node_001',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [0.0, 0.0, 0.0],
    forwardTangentVec3: [0.0, 0.0, 1.0],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 18.0,
    laneCount: 4,
    speedLimitKph: 60,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 1.0,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['dt_node_002', 'dt_node_015']
  },
  {
    nodeId: 'dt_node_002',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [0.0, 0.0, 150.0],
    forwardTangentVec3: [0.0, 0.0, 1.0],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 18.0,
    laneCount: 4,
    speedLimitKph: 60,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.2,
    surfaceFrictionMu: 1.0,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['dt_node_001', 'dt_node_003']
  },
  {
    nodeId: 'dt_node_003',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [45.0, 1.5, 320.0],
    forwardTangentVec3: [0.38, 0.01, 0.92],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 18.0,
    laneCount: 4,
    speedLimitKph: 70,
    bankAngleDeg: 1.5,
    elevationGradePercent: 0.8,
    surfaceFrictionMu: 1.0,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['dt_node_002', 'dt_node_004']
  },
  {
    nodeId: 'dt_node_004',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [120.0, 4.0, 500.0],
    forwardTangentVec3: [0.71, 0.02, 0.71],
    upNormalVec3: [-0.02, 0.99, 0.0],
    roadWidthM: 18.0,
    laneCount: 4,
    speedLimitKph: 80,
    bankAngleDeg: 2.0,
    elevationGradePercent: 1.2,
    surfaceFrictionMu: 1.0,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['dt_node_003', 'dt_node_005']
  },
  {
    nodeId: 'dt_node_005',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [280.0, 8.5, 620.0],
    forwardTangentVec3: [0.92, 0.03, 0.38],
    upNormalVec3: [-0.03, 0.99, 0.0],
    roadWidthM: 22.0,
    laneCount: 6,
    speedLimitKph: 90,
    bankAngleDeg: 2.5,
    elevationGradePercent: 1.5,
    surfaceFrictionMu: 1.0,
    surfaceType: 'grooved_concrete',
    isTunnelSection: false,
    isBridgeSection: true,
    connectedNodeIds: ['dt_node_004', 'dt_node_006']
  },
  {
    nodeId: 'dt_node_006',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [500.0, 12.0, 680.0],
    forwardTangentVec3: [1.0, 0.0, 0.0],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 24.0,
    laneCount: 6,
    speedLimitKph: 100,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 1.02,
    surfaceType: 'grooved_concrete',
    isTunnelSection: false,
    isBridgeSection: true,
    connectedNodeIds: ['dt_node_005', 'dt_node_007', 'hbr_node_001']
  },
  {
    nodeId: 'dt_node_007',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [750.0, 12.0, 680.0],
    forwardTangentVec3: [1.0, 0.0, 0.0],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 24.0,
    laneCount: 6,
    speedLimitKph: 100,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 1.02,
    surfaceType: 'grooved_concrete',
    isTunnelSection: false,
    isBridgeSection: true,
    connectedNodeIds: ['dt_node_006', 'dt_node_008']
  },
  {
    nodeId: 'dt_node_008',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [950.0, 8.0, 620.0],
    forwardTangentVec3: [0.85, -0.02, -0.52],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 20.0,
    laneCount: 4,
    speedLimitKph: 80,
    bankAngleDeg: -1.8,
    elevationGradePercent: -1.4,
    surfaceFrictionMu: 0.98,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['dt_node_007', 'dt_node_009']
  },
  {
    nodeId: 'dt_node_009',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [1100.0, 2.0, 450.0],
    forwardTangentVec3: [0.55, -0.02, -0.83],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 18.0,
    laneCount: 4,
    speedLimitKph: 70,
    bankAngleDeg: -2.2,
    elevationGradePercent: -1.0,
    surfaceFrictionMu: 0.98,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['dt_node_008', 'dt_node_010']
  },
  {
    nodeId: 'dt_node_010',
    districtId: 'downtown_financial',
    districtName: 'Downtown Financial Core',
    positionVec3: [1180.0, 0.0, 200.0],
    forwardTangentVec3: [0.0, 0.0, -1.0],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 18.0,
    laneCount: 4,
    speedLimitKph: 60,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 1.0,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['dt_node_009', 'dt_node_011', 'cst_node_001']
  },

  // ==========================================================================
  // DISTRICT 2: OCEANFRONT PACIFIC COASTAL HIGHWAY
  // ==========================================================================
  {
    nodeId: 'cst_node_001',
    districtId: 'oceanfront_coastal',
    districtName: 'Pacific Coast Oceanfront',
    positionVec3: [1180.0, 0.0, 200.0],
    forwardTangentVec3: [0.70, 0.0, -0.71],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 16.0,
    laneCount: 3,
    speedLimitKph: 110,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 0.96,
    surfaceType: 'coastal_tarmac',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['dt_node_010', 'cst_node_002']
  },
  {
    nodeId: 'cst_node_002',
    districtId: 'oceanfront_coastal',
    districtName: 'Pacific Coast Oceanfront',
    positionVec3: [1450.0, 5.0, -120.0],
    forwardTangentVec3: [0.82, 0.02, -0.57],
    upNormalVec3: [-0.03, 0.99, 0.0],
    roadWidthM: 16.0,
    laneCount: 3,
    speedLimitKph: 120,
    bankAngleDeg: 3.5,
    elevationGradePercent: 1.2,
    surfaceFrictionMu: 0.96,
    surfaceType: 'coastal_tarmac',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['cst_node_001', 'cst_node_003']
  },
  {
    nodeId: 'cst_node_003',
    districtId: 'oceanfront_coastal',
    districtName: 'Pacific Coast Oceanfront',
    positionVec3: [1800.0, 14.0, -400.0],
    forwardTangentVec3: [0.65, 0.03, -0.76],
    upNormalVec3: [-0.04, 0.99, 0.0],
    roadWidthM: 16.0,
    laneCount: 3,
    speedLimitKph: 130,
    bankAngleDeg: 4.8,
    elevationGradePercent: 1.8,
    surfaceFrictionMu: 0.95,
    surfaceType: 'coastal_tarmac',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['cst_node_002', 'cst_node_004']
  },
  {
    nodeId: 'cst_node_004',
    districtId: 'oceanfront_coastal',
    districtName: 'Pacific Coast Oceanfront',
    positionVec3: [2150.0, 22.0, -750.0],
    forwardTangentVec3: [0.45, 0.02, -0.89],
    upNormalVec3: [-0.04, 0.99, 0.0],
    roadWidthM: 16.0,
    laneCount: 3,
    speedLimitKph: 140,
    bankAngleDeg: 5.2,
    elevationGradePercent: 1.5,
    surfaceFrictionMu: 0.95,
    surfaceType: 'coastal_tarmac',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['cst_node_003', 'cst_node_005']
  },
  {
    nodeId: 'cst_node_005',
    districtId: 'oceanfront_coastal',
    districtName: 'Pacific Coast Oceanfront',
    positionVec3: [2400.0, 28.0, -1200.0],
    forwardTangentVec3: [0.15, 0.01, -0.98],
    upNormalVec3: [-0.02, 0.99, 0.0],
    roadWidthM: 16.0,
    laneCount: 3,
    speedLimitKph: 150,
    bankAngleDeg: 3.0,
    elevationGradePercent: 0.8,
    surfaceFrictionMu: 0.96,
    surfaceType: 'coastal_tarmac',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['cst_node_004', 'cst_node_006', 'mtn_node_001']
  },

  // ==========================================================================
  // DISTRICT 3: MOUNT AKINA TOUGE PASS
  // ==========================================================================
  {
    nodeId: 'mtn_node_001',
    districtId: 'mount_akina_touge',
    districtName: 'Mount Akina Touge Canyon',
    positionVec3: [2400.0, 28.0, -1200.0],
    forwardTangentVec3: [-0.60, 0.06, -0.80],
    upNormalVec3: [0.08, 0.99, 0.0],
    roadWidthM: 11.0,
    laneCount: 2,
    speedLimitKph: 70,
    bankAngleDeg: 4.5,
    elevationGradePercent: 5.8,
    surfaceFrictionMu: 1.05,
    surfaceType: 'mountain_bitumen',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['cst_node_005', 'mtn_node_002']
  },
  {
    nodeId: 'mtn_node_002',
    districtId: 'mount_akina_touge',
    districtName: 'Mount Akina Touge Canyon',
    positionVec3: [2150.0, 68.0, -1450.0],
    forwardTangentVec3: [-0.85, 0.08, -0.52],
    upNormalVec3: [0.12, 0.98, 0.0],
    roadWidthM: 10.5,
    laneCount: 2,
    speedLimitKph: 60,
    bankAngleDeg: 6.8,
    elevationGradePercent: 8.2,
    surfaceFrictionMu: 1.05,
    surfaceType: 'mountain_bitumen',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['mtn_node_001', 'mtn_node_003']
  },
  {
    nodeId: 'mtn_node_003',
    districtId: 'mount_akina_touge',
    districtName: 'Mount Akina Touge Canyon',
    positionVec3: [1850.0, 115.0, -1600.0], // Hairpin 1 Apex
    forwardTangentVec3: [0.25, 0.06, 0.96], // Reversing 180 degrees switchback
    upNormalVec3: [-0.15, 0.97, 0.0],
    roadWidthM: 13.0,
    laneCount: 2,
    speedLimitKph: 45,
    bankAngleDeg: 9.5, // Steep banking inside hairpin
    elevationGradePercent: 7.5,
    surfaceFrictionMu: 1.08,
    surfaceType: 'mountain_bitumen',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['mtn_node_002', 'mtn_node_004']
  },
  {
    nodeId: 'mtn_node_004',
    districtId: 'mount_akina_touge',
    districtName: 'Mount Akina Touge Canyon',
    positionVec3: [1980.0, 155.0, -1320.0],
    forwardTangentVec3: [0.72, 0.07, 0.69],
    upNormalVec3: [-0.10, 0.98, 0.0],
    roadWidthM: 10.5,
    laneCount: 2,
    speedLimitKph: 65,
    bankAngleDeg: 5.5,
    elevationGradePercent: 7.2,
    surfaceFrictionMu: 1.05,
    surfaceType: 'mountain_bitumen',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['mtn_node_003', 'mtn_node_005']
  },
  {
    nodeId: 'mtn_node_005',
    districtId: 'mount_akina_touge',
    districtName: 'Mount Akina Touge Canyon',
    positionVec3: [2250.0, 198.0, -1100.0], // Hairpin 2 Apex
    forwardTangentVec3: [-0.45, 0.06, -0.89],
    upNormalVec3: [0.14, 0.97, 0.0],
    roadWidthM: 13.0,
    laneCount: 2,
    speedLimitKph: 40,
    bankAngleDeg: 10.2,
    elevationGradePercent: 6.9,
    surfaceFrictionMu: 1.08,
    surfaceType: 'mountain_bitumen',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['mtn_node_004', 'mtn_node_006']
  },
  {
    nodeId: 'mtn_node_006',
    districtId: 'mount_akina_touge',
    districtName: 'Mount Akina Touge Canyon',
    positionVec3: [1750.0, 245.0, -1450.0],
    forwardTangentVec3: [-0.91, 0.05, -0.41],
    upNormalVec3: [0.08, 0.99, 0.0],
    roadWidthM: 11.0,
    laneCount: 2,
    speedLimitKph: 80,
    bankAngleDeg: 4.2,
    elevationGradePercent: 4.5,
    surfaceFrictionMu: 1.04,
    surfaceType: 'mountain_bitumen',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['mtn_node_005', 'mtn_node_007', 'rdk_node_001']
  },

  // ==========================================================================
  // DISTRICT 4: INDUSTRIAL HARBOR & SHIPPING DOCKS
  // ==========================================================================
  {
    nodeId: 'hbr_node_001',
    districtId: 'harbor_shipping_docks',
    districtName: 'Industrial Harbor Shipping Docks',
    positionVec3: [500.0, 12.0, 680.0],
    forwardTangentVec3: [0.0, -0.03, 1.0],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 20.0,
    laneCount: 4,
    speedLimitKph: 70,
    bankAngleDeg: 0.0,
    elevationGradePercent: -1.8,
    surfaceFrictionMu: 0.92,
    surfaceType: 'grooved_concrete',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['dt_node_006', 'hbr_node_002']
  },
  {
    nodeId: 'hbr_node_002',
    districtId: 'harbor_shipping_docks',
    districtName: 'Industrial Harbor Shipping Docks',
    positionVec3: [500.0, 2.0, 1050.0],
    forwardTangentVec3: [0.15, 0.0, 0.98],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 26.0,
    laneCount: 6,
    speedLimitKph: 80,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 0.90,
    surfaceType: 'wet_cobblestone',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['hbr_node_001', 'hbr_node_003']
  },
  {
    nodeId: 'hbr_node_003',
    districtId: 'harbor_shipping_docks',
    districtName: 'Industrial Harbor Shipping Docks',
    positionVec3: [620.0, 1.5, 1400.0],
    forwardTangentVec3: [0.70, 0.0, 0.71],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 30.0, // Vast open container apron
    laneCount: 6,
    speedLimitKph: 90,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 0.88,
    surfaceType: 'wet_cobblestone',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['hbr_node_002', 'hbr_node_004']
  },
  {
    nodeId: 'hbr_node_004',
    districtId: 'harbor_shipping_docks',
    districtName: 'Industrial Harbor Shipping Docks',
    positionVec3: [950.0, 1.5, 1600.0],
    forwardTangentVec3: [1.0, 0.0, 0.0],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 24.0,
    laneCount: 4,
    speedLimitKph: 90,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 0.92,
    surfaceType: 'grooved_concrete',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['hbr_node_003', 'hbr_node_005']
  },
  {
    nodeId: 'hbr_node_005',
    districtId: 'harbor_shipping_docks',
    districtName: 'Industrial Harbor Shipping Docks',
    positionVec3: [1350.0, 2.0, 1600.0],
    forwardTangentVec3: [0.85, 0.0, -0.52],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 20.0,
    laneCount: 4,
    speedLimitKph: 80,
    bankAngleDeg: 1.0,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 0.94,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['hbr_node_004', 'dt_node_010']
  },

  // ==========================================================================
  // DISTRICT 5: RED ROCK DESERT HIGHWAY INTERSTATE
  // ==========================================================================
  {
    nodeId: 'rdk_node_001',
    districtId: 'red_rock_desert',
    districtName: 'Red Rock Desert Interstate',
    positionVec3: [1750.0, 245.0, -1450.0],
    forwardTangentVec3: [-0.98, -0.04, 0.15],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 24.0,
    laneCount: 6,
    speedLimitKph: 180,
    bankAngleDeg: 0.0,
    elevationGradePercent: -2.5,
    surfaceFrictionMu: 1.05,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['mtn_node_006', 'rdk_node_002']
  },
  {
    nodeId: 'rdk_node_002',
    districtId: 'red_rock_desert',
    districtName: 'Red Rock Desert Interstate',
    positionVec3: [850.0, 140.0, -1350.0],
    forwardTangentVec3: [-1.0, -0.03, 0.0],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 28.0,
    laneCount: 6,
    speedLimitKph: 240, // Unlimited Autobahn / V-Max zone
    bankAngleDeg: 0.0,
    elevationGradePercent: -1.2,
    surfaceFrictionMu: 1.08,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['rdk_node_001', 'rdk_node_003']
  },
  {
    nodeId: 'rdk_node_003',
    districtId: 'red_rock_desert',
    districtName: 'Red Rock Desert Interstate',
    positionVec3: [-200.0, 65.0, -1350.0],
    forwardTangentVec3: [-1.0, -0.02, 0.0],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 28.0,
    laneCount: 6,
    speedLimitKph: 240,
    bankAngleDeg: 0.0,
    elevationGradePercent: -0.8,
    surfaceFrictionMu: 1.08,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['rdk_node_002', 'rdk_node_004']
  },
  {
    nodeId: 'rdk_node_004',
    districtId: 'red_rock_desert',
    districtName: 'Red Rock Desert Interstate',
    positionVec3: [-1200.0, 15.0, -1350.0],
    forwardTangentVec3: [-0.85, -0.01, 0.52],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 22.0,
    laneCount: 4,
    speedLimitKph: 160,
    bankAngleDeg: 2.0,
    elevationGradePercent: -0.4,
    surfaceFrictionMu: 1.05,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['rdk_node_003', 'rdk_node_005']
  },
  {
    nodeId: 'rdk_node_005',
    districtId: 'red_rock_desert',
    districtName: 'Red Rock Desert Interstate',
    positionVec3: [-1600.0, 5.0, -950.0],
    forwardTangentVec3: [-0.45, 0.0, 0.89],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 18.0,
    laneCount: 4,
    speedLimitKph: 120,
    bankAngleDeg: 1.5,
    elevationGradePercent: 0.0,
    surfaceFrictionMu: 1.02,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['rdk_node_004', 'sub_node_001']
  },

  // ==========================================================================
  // DISTRICT 6: GREEN HILLS SUBURBIA
  // ==========================================================================
  {
    nodeId: 'sub_node_001',
    districtId: 'suburbia_residential',
    districtName: 'Green Hills Suburbia',
    positionVec3: [-1600.0, 5.0, -950.0],
    forwardTangentVec3: [0.25, 0.0, 0.96],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 14.0,
    laneCount: 2,
    speedLimitKph: 50,
    bankAngleDeg: 0.0,
    elevationGradePercent: 0.2,
    surfaceFrictionMu: 0.98,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['rdk_node_005', 'sub_node_002']
  },
  {
    nodeId: 'sub_node_002',
    districtId: 'suburbia_residential',
    districtName: 'Green Hills Suburbia',
    positionVec3: [-1450.0, 8.0, -600.0],
    forwardTangentVec3: [0.60, 0.01, 0.80],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 14.0,
    laneCount: 2,
    speedLimitKph: 50,
    bankAngleDeg: 0.5,
    elevationGradePercent: 0.5,
    surfaceFrictionMu: 0.98,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['sub_node_001', 'sub_node_003']
  },
  {
    nodeId: 'sub_node_003',
    districtId: 'suburbia_residential',
    districtName: 'Green Hills Suburbia',
    positionVec3: [-1100.0, 6.0, -350.0], // Residential Roundabout
    forwardTangentVec3: [0.85, 0.0, 0.52],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 16.0,
    laneCount: 2,
    speedLimitKph: 40,
    bankAngleDeg: 1.0,
    elevationGradePercent: -0.2,
    surfaceFrictionMu: 0.98,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['sub_node_002', 'sub_node_004']
  },
  {
    nodeId: 'sub_node_004',
    districtId: 'suburbia_residential',
    districtName: 'Green Hills Suburbia',
    positionVec3: [-650.0, 3.0, -150.0],
    forwardTangentVec3: [0.95, 0.0, 0.31],
    upNormalVec3: [0.0, 1.0, 0.0],
    roadWidthM: 16.0,
    laneCount: 3,
    speedLimitKph: 60,
    bankAngleDeg: 0.0,
    elevationGradePercent: -0.5,
    surfaceFrictionMu: 1.0,
    surfaceType: 'smooth_asphalt',
    isTunnelSection: false,
    isBridgeSection: false,
    connectedNodeIds: ['sub_node_003', 'dt_node_001']
  }
];

export class RoadSplineGraphNavigator {
  private static nodeMap: Map<string, RoadSplineNode> | null = null;

  private static ensureIndex(): void {
    if (!this.nodeMap) {
      this.nodeMap = new Map();
      for (const node of WORLD_ROAD_SPLINE_NODES) {
        this.nodeMap.set(node.nodeId, node);
      }
    }
  }

  public static getNode(nodeId: string): RoadSplineNode | undefined {
    this.ensureIndex();
    return this.nodeMap!.get(nodeId);
  }

  public static findClosestNode(x: number, y: number, z: number): RoadSplineNode {
    let closestNode = WORLD_ROAD_SPLINE_NODES[0];
    let minDistanceSq = Infinity;

    for (const node of WORLD_ROAD_SPLINE_NODES) {
      const dx = node.positionVec3[0] - x;
      const dy = node.positionVec3[1] - y;
      const dz = node.positionVec3[2] - z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        closestNode = node;
      }
    }

    return closestNode;
  }

  public static getAllDistricts(): string[] {
    const districts = new Set<string>();
    for (const node of WORLD_ROAD_SPLINE_NODES) {
      districts.add(node.districtName);
    }
    return Array.from(districts);
  }
}
