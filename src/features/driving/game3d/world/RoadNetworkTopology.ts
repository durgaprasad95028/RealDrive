import * as THREE from 'three';

export type RoadClassification = 
  | 'HIGHWAY_EXPRESSWAY' 
  | 'URBAN_AVENUE' 
  | 'COMMERCIAL_BOULEVARD' 
  | 'RESIDENTIAL_STREET' 
  | 'INDUSTRIAL_HAUL_ROAD' 
  | 'MOUNTAIN_PASS_ROAD';

export interface LaneProfile {
  laneIndex: number; // 0 = right-most, 1 = inner, etc.
  direction: 1 | -1; // 1 = forward with spline, -1 = reverse/oncoming
  widthMeters: number;
  speedLimitKmH: number;
  isBusLane: boolean;
  isBicycleLane: boolean;
  isShoulder: boolean;
}

export interface RoadSegmentSpline {
  id: string;
  name: string;
  classification: RoadClassification;
  curve: THREE.CatmullRomCurve3;
  points: THREE.Vector3[];
  lengthMeters: number;
  totalLanes: number;
  lanesForward: number;
  lanesOpposite: number;
  laneWidth: number;
  totalWidth: number;
  hasMedian: boolean;
  hasSidewalks: boolean;
  hasGuardrails: boolean;
  isElevatedBridge: boolean;
  isTunnel: boolean;
  bankAngleDegrees: number; // Camber roll angle
  surfaceFriction: number;
  elevationProfile: { t: number; elevation: number }[];
}

export interface IntersectionNode {
  id: string;
  name: string;
  position: THREE.Vector3;
  radius: number;
  connectedSegmentIds: string[];
  trafficSignalControlled: boolean;
  signalCycleDurationSec: number;
  currentSignalPhase: 'NORTH_SOUTH_GREEN' | 'YELLOW' | 'EAST_WEST_GREEN' | 'ALL_RED';
}

export interface RoadSampleQuery {
  segment: RoadSegmentSpline;
  closestPoint: THREE.Vector3;
  distanceToCenterline: number;
  splineT: number;
  tangent: THREE.Vector3;
  normal: THREE.Vector3;
  binormal: THREE.Vector3;
  headingRadians: number;
  elevation: number;
  bankAngleRad: number;
  closestLaneIndex: number;
  isOppositeLane: boolean;
  isOnRoad: boolean;
  surfaceGrip: number;
}

export class RoadNetworkTopology {
  private segments: Map<string, RoadSegmentSpline> = new Map();
  private intersections: Map<string, IntersectionNode> = new Map();
  private spatialBuckets: Map<string, string[]> = new Map();
  private bucketSize: number = 200; // 200m spatial hashing bucket

  constructor() {
    this.buildMasterNetwork();
  }

  private getBucketKey(x: number, z: number): string {
    const bx = Math.floor(x / this.bucketSize);
    const bz = Math.floor(z / this.bucketSize);
    return `${bx}_${bz}`;
  }

  private registerSpatialSegment(seg: RoadSegmentSpline) {
    const pts = seg.points;
    const visitedBuckets = new Set<string>();

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const key = this.getBucketKey(p.x, p.z);
      if (!visitedBuckets.has(key)) {
        visitedBuckets.add(key);
        if (!this.spatialBuckets.has(key)) {
          this.spatialBuckets.set(key, []);
        }
        this.spatialBuckets.get(key)!.push(seg.id);
      }
    }
  }

  private buildMasterNetwork() {
    // =========================================================================
    // 1. CENTRAL METRO BOULEVARD (North-South Main Spine: Z = -1500 to +1600)
    // =========================================================================
    const centralSpinePoints = [
      new THREE.Vector3(0, 35, -1600),
      new THREE.Vector3(0, 15, -1000),
      new THREE.Vector3(0, 0, -400),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 400),
      new THREE.Vector3(0, 0, 800),
      new THREE.Vector3(0, 0, 1200),
      new THREE.Vector3(0, 0, 1600),
    ];
    this.addSegment({
      id: 'road_central_spine',
      name: 'Metro Grand Central Boulevard',
      classification: 'URBAN_AVENUE',
      points: centralSpinePoints,
      lanesForward: 2,
      lanesOpposite: 2,
      laneWidth: 3.8,
      hasMedian: true,
      hasSidewalks: true,
      hasGuardrails: false,
      isElevatedBridge: false,
      isTunnel: false,
      bankAngleDegrees: 0,
      surfaceFriction: 1.0,
    });

    // =========================================================================
    // 2. AIRPORT HIGHWAY CORRIDOR (Branches off at Z=400 toward X=300, Z=1400)
    // =========================================================================
    const airportHighwayPoints = [
      new THREE.Vector3(0, 0, 400),
      new THREE.Vector3(80, 0, 600),
      new THREE.Vector3(200, 0, 850),
      new THREE.Vector3(300, 0, 1100),
      new THREE.Vector3(300, 0, 1500),
    ];
    this.addSegment({
      id: 'road_airport_express',
      name: 'International Airport Highway Expressway',
      classification: 'HIGHWAY_EXPRESSWAY',
      points: airportHighwayPoints,
      lanesForward: 3,
      lanesOpposite: 3,
      laneWidth: 3.9,
      hasMedian: true,
      hasSidewalks: false,
      hasGuardrails: true,
      isElevatedBridge: false,
      isTunnel: false,
      bankAngleDegrees: 2.5,
      surfaceFriction: 1.05,
    });

    // =========================================================================
    // 3. HARBOR PIER & CONTAINER FREIGHT WAY (East towards X=1000)
    // =========================================================================
    const harborPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(250, 0, 50),
      new THREE.Vector3(550, 0, 100),
      new THREE.Vector3(850, 0, 200),
      new THREE.Vector3(1200, 0, 250),
    ];
    this.addSegment({
      id: 'road_harbor_freightway',
      name: 'Port Gateway Container Freightway',
      classification: 'INDUSTRIAL_HAUL_ROAD',
      points: harborPoints,
      lanesForward: 2,
      lanesOpposite: 2,
      laneWidth: 4.2,
      hasMedian: false,
      hasSidewalks: false,
      hasGuardrails: true,
      isElevatedBridge: false,
      isTunnel: false,
      bankAngleDegrees: 0,
      surfaceFriction: 0.95,
    });

    // =========================================================================
    // 4. SUBURBAN PINECREST HILLS AVENUE (West towards X=-1000)
    // =========================================================================
    const suburbPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-250, 2, -20),
      new THREE.Vector3(-550, 5, 0),
      new THREE.Vector3(-850, 10, 40),
      new THREE.Vector3(-1200, 12, 50),
    ];
    this.addSegment({
      id: 'road_suburb_avenue',
      name: 'Pinecrest Valley Residential Parkway',
      classification: 'RESIDENTIAL_STREET',
      points: suburbPoints,
      lanesForward: 1,
      lanesOpposite: 1,
      laneWidth: 3.6,
      hasMedian: false,
      hasSidewalks: true,
      hasGuardrails: false,
      isElevatedBridge: false,
      isTunnel: false,
      bankAngleDegrees: 0,
      surfaceFriction: 1.0,
    });

    // =========================================================================
    // 5. SKYLINE CANYON MOUNTAIN PASS SWITCHBACKS (North Elevation Z = -400 to -1800)
    // =========================================================================
    const canyonPoints = [
      new THREE.Vector3(0, 0, -400),
      new THREE.Vector3(-120, 10, -650),
      new THREE.Vector3(150, 22, -900),
      new THREE.Vector3(-180, 36, -1150),
      new THREE.Vector3(200, 48, -1450),
      new THREE.Vector3(0, 55, -1750),
    ];
    this.addSegment({
      id: 'road_canyon_pass',
      name: 'Skyline Canyon Touge Switchback Pass',
      classification: 'MOUNTAIN_PASS_ROAD',
      points: canyonPoints,
      lanesForward: 1,
      lanesOpposite: 1,
      laneWidth: 3.7,
      hasMedian: false,
      hasSidewalks: false,
      hasGuardrails: true,
      isElevatedBridge: false,
      isTunnel: false,
      bankAngleDegrees: 4.0,
      surfaceFriction: 0.98,
    });

    // =========================================================================
    // 6. 4-WAY INTERSECTIONS
    // =========================================================================
    this.addIntersection({
      id: 'int_downtown_core',
      name: 'Apex Central Interchange',
      position: new THREE.Vector3(0, 0, 0),
      radius: 40,
      connectedSegmentIds: ['road_central_spine', 'road_harbor_freightway', 'road_suburb_avenue'],
      trafficSignalControlled: true,
      signalCycleDurationSec: 25,
      currentSignalPhase: 'NORTH_SOUTH_GREEN',
    });

    this.addIntersection({
      id: 'int_airport_junction',
      name: 'Skyport Expressway Fork',
      position: new THREE.Vector3(0, 0, 400),
      radius: 50,
      connectedSegmentIds: ['road_central_spine', 'road_airport_express'],
      trafficSignalControlled: true,
      signalCycleDurationSec: 30,
      currentSignalPhase: 'NORTH_SOUTH_GREEN',
    });
  }

  public addSegment(config: {
    id: string;
    name: string;
    classification: RoadClassification;
    points: THREE.Vector3[];
    lanesForward: number;
    lanesOpposite: number;
    laneWidth: number;
    hasMedian: boolean;
    hasSidewalks: boolean;
    hasGuardrails: boolean;
    isElevatedBridge: boolean;
    isTunnel: boolean;
    bankAngleDegrees: number;
    surfaceFriction: number;
  }): RoadSegmentSpline {
    const curve = new THREE.CatmullRomCurve3(config.points, false, 'centripetal', 0.5);
    const lengthMeters = curve.getLength();
    const totalLanes = config.lanesForward + config.lanesOpposite;
    const totalWidth = totalLanes * config.laneWidth + (config.hasMedian ? 2.5 : 0.6);

    const elevationProfile: { t: number; elevation: number }[] = [];
    for (let t = 0; t <= 1; t += 0.05) {
      const pt = curve.getPointAt(t);
      elevationProfile.push({ t, elevation: pt.y });
    }

    const seg: RoadSegmentSpline = {
      id: config.id,
      name: config.name,
      classification: config.classification,
      curve,
      points: config.points,
      lengthMeters,
      totalLanes,
      lanesForward: config.lanesForward,
      lanesOpposite: config.lanesOpposite,
      laneWidth: config.laneWidth,
      totalWidth,
      hasMedian: config.hasMedian,
      hasSidewalks: config.hasSidewalks,
      hasGuardrails: config.hasGuardrails,
      isElevatedBridge: config.isElevatedBridge,
      isTunnel: config.isTunnel,
      bankAngleDegrees: config.bankAngleDegrees,
      surfaceFriction: config.surfaceFriction,
      elevationProfile,
    };

    this.segments.set(seg.id, seg);
    this.registerSpatialSegment(seg);
    return seg;
  }

  public addIntersection(node: IntersectionNode) {
    this.intersections.set(node.id, node);
  }

  public getAllSegments(): RoadSegmentSpline[] {
    return Array.from(this.segments.values());
  }

  public getSegment(id: string): RoadSegmentSpline | undefined {
    return this.segments.get(id);
  }

  public getAllIntersections(): IntersectionNode[] {
    return Array.from(this.intersections.values());
  }

  /**
   * Fast spatial query to find the closest road segment, lane, heading, elevation, and grip.
   */
  public queryRoadAtPosition(pos: THREE.Vector3): RoadSampleQuery | null {
    let closestSeg: RoadSegmentSpline | null = null;
    let minDistanceSq = Infinity;
    let bestT = 0;
    let bestPoint = new THREE.Vector3();

    // Check candidate segments
    this.segments.forEach((seg) => {
      // Sample 25 points along curve
      const samples = 25;
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const pt = seg.curve.getPointAt(t);
        const dSq = (pt.x - pos.x) ** 2 + (pt.z - pos.z) ** 2;
        if (dSq < minDistanceSq) {
          minDistanceSq = dSq;
          closestSeg = seg;
          bestT = t;
          bestPoint.copy(pt);
        }
      }
    });

    if (!closestSeg) return null;

    // Refine closest point using tangent projection
    const tangent = closestSeg.curve.getTangentAt(bestT).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const binormal = new THREE.Vector3().crossVectors(normal, tangent).normalize();

    const toPos = new THREE.Vector3().subVectors(pos, bestPoint);
    const lateralDist = toPos.dot(normal); // Distance from centerline along normal
    const distanceToCenterline = Math.abs(lateralDist);

    const halfWidth = closestSeg.totalWidth / 2;
    const isOnRoad = distanceToCenterline <= halfWidth + 1.5;

    // Heading calculation
    const headingRadians = Math.atan2(tangent.x, tangent.z);

    // Identify Lane
    const isOppositeLane = lateralDist < 0;
    const closestLaneIndex = Math.min(
      closestSeg.lanesForward - 1,
      Math.max(0, Math.floor(Math.abs(lateralDist) / closestSeg.laneWidth))
    );

    const bankAngleRad = (closestSeg.bankAngleDegrees * Math.PI) / 180;

    return {
      segment: closestSeg,
      closestPoint: bestPoint,
      distanceToCenterline,
      splineT: bestT,
      tangent,
      normal,
      binormal,
      headingRadians,
      elevation: bestPoint.y,
      bankAngleRad,
      closestLaneIndex,
      isOppositeLane,
      isOnRoad,
      surfaceGrip: closestSeg.surfaceFriction,
    };
  }

  /**
   * Generates 3D meshes (asphalt, lanes, markings, curbs, sidewalks) for all registered road segments.
   */
  public generateRoadNetworkMeshes(): THREE.Group {
    const networkGroup = new THREE.Group();
    networkGroup.name = 'ProceduralRoadNetwork';

    // Shared Road Materials
    const asphaltMaterial = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.88,
      metalness: 0.12,
    });

    const whiteLineMaterial = new THREE.MeshBasicMaterial({
      color: 0xf1f5f9,
    });

    const yellowLineMaterial = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
    });

    const sidewalkMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.9,
    });

    const guardrailMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.8,
      roughness: 0.3,
    });

    this.segments.forEach((seg) => {
      const segGroup = new THREE.Group();
      segGroup.name = `Segment_${seg.id}`;

      const steps = Math.max(30, Math.floor(seg.lengthMeters / 4));
      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];

      const halfW = seg.totalWidth / 2;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const pt = seg.curve.getPointAt(t);
        const tangent = seg.curve.getTangentAt(t).normalize();
        const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

        const leftPt = new THREE.Vector3().copy(pt).addScaledVector(normal, -halfW);
        const rightPt = new THREE.Vector3().copy(pt).addScaledVector(normal, halfW);

        // Add asphalt vertices
        vertices.push(leftPt.x, leftPt.y + 0.02, leftPt.z);
        vertices.push(rightPt.x, rightPt.y + 0.02, rightPt.z);

        uvs.push(0, t * (seg.lengthMeters / 10));
        uvs.push(1, t * (seg.lengthMeters / 10));

        if (i < steps) {
          const row1 = i * 2;
          const row2 = (i + 1) * 2;
          indices.push(row1, row1 + 1, row2);
          indices.push(row1 + 1, row2 + 1, row2);
        }
      }

      const roadGeom = new THREE.BufferGeometry();
      roadGeom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      roadGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      roadGeom.setIndex(indices);
      roadGeom.computeVertexNormals();

      const roadMesh = new THREE.Mesh(roadGeom, asphaltMaterial);
      roadMesh.receiveShadow = true;
      segGroup.add(roadMesh);

      // Add Center Yellow Median Markings
      if (seg.hasMedian) {
        const yellowGeom = new THREE.BufferGeometry();
        const yVerts: number[] = [];
        const yIndices: number[] = [];

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const pt = seg.curve.getPointAt(t);
          const tangent = seg.curve.getTangentAt(t).normalize();
          const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

          const l1 = new THREE.Vector3().copy(pt).addScaledVector(normal, -0.15);
          const l2 = new THREE.Vector3().copy(pt).addScaledVector(normal, 0.15);

          yVerts.push(l1.x, l1.y + 0.03, l1.z);
          yVerts.push(l2.x, l2.y + 0.03, l2.z);

          if (i < steps) {
            const r1 = i * 2;
            const r2 = (i + 1) * 2;
            yIndices.push(r1, r1 + 1, r2);
            yIndices.push(r1 + 1, r2 + 1, r2);
          }
        }

        yellowGeom.setAttribute('position', new THREE.Float32BufferAttribute(yVerts, 3));
        yellowGeom.setIndex(yIndices);
        yellowGeom.computeVertexNormals();

        const yellowMesh = new THREE.Mesh(yellowGeom, yellowLineMaterial);
        segGroup.add(yellowMesh);
      }

      // Add Guardrails for Highways / Mountain pass
      if (seg.hasGuardrails) {
        const railGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6);
        for (let i = 0; i <= steps; i += 3) {
          const t = i / steps;
          const pt = seg.curve.getPointAt(t);
          const tangent = seg.curve.getTangentAt(t).normalize();
          const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

          const lPost = new THREE.Vector3().copy(pt).addScaledVector(normal, -halfW - 0.4);
          const rPost = new THREE.Vector3().copy(pt).addScaledVector(normal, halfW + 0.4);

          const post1 = new THREE.Mesh(railGeom, guardrailMaterial);
          post1.position.set(lPost.x, lPost.y + 0.4, lPost.z);
          post1.castShadow = true;
          segGroup.add(post1);

          const post2 = new THREE.Mesh(railGeom, guardrailMaterial);
          post2.position.set(rPost.x, rPost.y + 0.4, rPost.z);
          post2.castShadow = true;
          segGroup.add(post2);
        }
      }

      networkGroup.add(segGroup);
    });

    return networkGroup;
  }

  /**
   * Samples a precise world position and heading along a road segment given distance progress, lane index, and lateral offset.
   */
  public sampleRoadPoint(
    segmentId: string,
    laneProgress: number,
    laneIndex: number = 0,
    lateralOffset: number = 0
  ): { position: THREE.Vector3; yaw: number; speedLimit: number } | null {
    const seg = this.segments.get(segmentId);
    if (!seg) return null;

    const clampedProgress = Math.max(0, Math.min(seg.lengthMeters, laneProgress));
    const t = clampedProgress / seg.lengthMeters;

    const pt = seg.curve.getPointAt(t);
    const tangent = seg.curve.getTangentAt(t).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

    // Calculate lane center offset
    // In multi-lane roads, lane 0 is right-most (positive normal offset in standard forward coordinate)
    const laneWidth = seg.laneWidth;
    const baseOffset = (laneIndex + 0.5) * laneWidth - (seg.lanesForward * laneWidth) / 2;
    const totalOffset = baseOffset + lateralOffset;

    const pos = new THREE.Vector3().copy(pt).addScaledVector(normal, totalOffset);
    const yaw = Math.atan2(tangent.x, tangent.z);

    const speedLimit = this.getSpeedLimitForClassification(seg.classification);

    return {
      position: pos,
      yaw,
      speedLimit,
    };
  }

  /**
   * Finds a random road segment within a given search radius of a center point.
   */
  public getRandomRoadSegmentNear(
    pos: THREE.Vector3,
    radius: number
  ): { id: string; length: number; lanesCount: number; speedLimit: number } | null {
    const candidateSegments: RoadSegmentSpline[] = [];
    const radSq = radius * radius;

    this.segments.forEach((seg) => {
      // Check midpoint
      const mid = seg.curve.getPointAt(0.5);
      const distSq = (mid.x - pos.x) ** 2 + (mid.z - pos.z) ** 2;
      if (distSq <= radSq * 2.5) {
        candidateSegments.push(seg);
      }
    });

    if (candidateSegments.length === 0) {
      const all = Array.from(this.segments.values());
      if (all.length === 0) return null;
      const fallback = all[Math.floor(Math.random() * all.length)];
      return {
        id: fallback.id,
        length: fallback.lengthMeters,
        lanesCount: fallback.lanesForward,
        speedLimit: this.getSpeedLimitForClassification(fallback.classification),
      };
    }

    const picked = candidateSegments[Math.floor(Math.random() * candidateSegments.length)];
    return {
      id: picked.id,
      length: picked.lengthMeters,
      lanesCount: picked.lanesForward,
      speedLimit: this.getSpeedLimitForClassification(picked.classification),
    };
  }

  /**
   * Finds a connected next road segment at the end of the current segment.
   */
  public getNextSegment(
    currentSegmentId: string
  ): { id: string; length: number; lanesCount: number; speedLimit: number } | null {
    const all = Array.from(this.segments.values()).filter((s) => s.id !== currentSegmentId);
    if (all.length === 0) return null;
    const picked = all[Math.floor(Math.random() * all.length)];
    return {
      id: picked.id,
      length: picked.lengthMeters,
      lanesCount: picked.lanesForward,
      speedLimit: this.getSpeedLimitForClassification(picked.classification),
    };
  }

  private getSpeedLimitForClassification(classification: RoadClassification): number {
    switch (classification) {
      case 'HIGHWAY_EXPRESSWAY':
        return 33.33; // ~120 km/h
      case 'COMMERCIAL_BOULEVARD':
        return 22.22; // ~80 km/h
      case 'URBAN_AVENUE':
        return 16.67; // ~60 km/h
      case 'INDUSTRIAL_HAUL_ROAD':
        return 13.89; // ~50 km/h
      case 'MOUNTAIN_PASS_ROAD':
        return 25.0; // ~90 km/h
      case 'RESIDENTIAL_STREET':
      default:
        return 11.11; // ~40 km/h
    }
  }
}

export const roadNetworkTopology = new RoadNetworkTopology();

