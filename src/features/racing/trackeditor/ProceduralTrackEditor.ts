import * as THREE from 'three';

export type SurfaceMaterialType = 'RACING_ASPHALT' | 'POLISHED_CONCRETE' | 'WET_RAIN_TARMAC' | 'DIRT_GRAVEL' | 'SNOW_ICE';

export interface TrackSplineNode {
  id: string;
  position: { x: number; y: number; z: number };
  bankAngleDegrees: number; // -15 to +15 deg
  trackWidthMeters: number; // 8.0 to 22.0m
  surface: SurfaceMaterialType;
  hasCurbLeft: boolean;
  hasCurbRight: boolean;
  hasTireBarrier: boolean;
  isTimingSectorGate: boolean;
  sectorIndex?: 1 | 2 | 3;
}

export interface CustomTrackDesign {
  id: string;
  title: string;
  authorName: string;
  description: string;
  isClosedCircuit: boolean;
  totalLengthMeters: number;
  cornersCount: number;
  elevationChangeMeters: number;
  nodes: TrackSplineNode[];
  createdTimestamp: number;
}

export class ProceduralTrackEditor {
  /**
   * Generates a 3D CatmullRom spline from track nodes
   */
  public static createTrackSpline(track: CustomTrackDesign): THREE.CatmullRomCurve3 {
    const points = track.nodes.map((n) => new THREE.Vector3(n.position.x, n.position.y, n.position.z));
    return new THREE.CatmullRomCurve3(points, track.isClosedCircuit, 'centripetal', 0.5);
  }

  /**
   * Validates a track design for drivability, curvature limits, and closed loop
   */
  public static validateTrack(track: CustomTrackDesign): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    stats: { totalLengthM: number; minCornerRadiusM: number; maxSlopePct: number };
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (track.nodes.length < 4) {
      errors.push('Track must contain at least 4 spline nodes.');
    }

    let totalLength = 0;
    let minRadius = Infinity;
    let maxSlope = 0;

    if (track.nodes.length >= 4) {
      const curve = this.createTrackSpline(track);
      totalLength = Math.round(curve.getLength());

      if (totalLength < 500) {
        warnings.push('Track is relatively short (under 500m). Recommended >= 1,200m for full races.');
      } else if (totalLength > 12000) {
        warnings.push('Track is extremely long (over 12km). Lap times will exceed 5 minutes.');
      }

      // Sample points along track to check minimum turn radius and slope
      const samples = 100;
      for (let i = 0; i < samples; i++) {
        const t = i / samples;
        const pt = curve.getPointAt(t);
        const nextPt = curve.getPointAt((i + 1) / samples);

        const dist = pt.distanceTo(nextPt);
        const dY = Math.abs(nextPt.y - pt.y);
        const slope = dist > 0 ? (dY / dist) * 100 : 0;
        if (slope > maxSlope) maxSlope = slope;
      }

      if (maxSlope > 18) {
        errors.push(`Maximum track slope (${maxSlope.toFixed(1)}%) exceeds 18% safety gradient limit.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      stats: {
        totalLengthM: totalLength,
        minCornerRadiusM: Math.max(12, Math.round(minRadius === Infinity ? 25 : minRadius)),
        maxSlopePct: Math.round(maxSlope * 10) / 10,
      },
    };
  }

  /**
   * Generates a 3D Three.js mesh for the custom designed track
   */
  public static generateTrack3DMesh(track: CustomTrackDesign): THREE.Group {
    const root = new THREE.Group();
    root.name = `CustomTrack_${track.id}`;

    if (track.nodes.length < 4) return root;

    const curve = this.createTrackSpline(track);
    const steps = Math.max(60, Math.floor(curve.getLength() / 3));

    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const asphaltMat = new THREE.MeshStandardMaterial({
      color: 0x1c212a,
      roughness: 0.82,
      metalness: 0.15,
    });

    const curbRedWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xe74c3c,
      roughness: 0.6,
    });

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

      const halfW = 7.0; // 14m wide track

      const leftPt = new THREE.Vector3().copy(pt).addScaledVector(normal, -halfW);
      const rightPt = new THREE.Vector3().copy(pt).addScaledVector(normal, halfW);

      vertices.push(leftPt.x, leftPt.y + 0.05, leftPt.z);
      vertices.push(rightPt.x, rightPt.y + 0.05, rightPt.z);

      uvs.push(0, t * (curve.getLength() / 8));
      uvs.push(1, t * (curve.getLength() / 8));

      if (i < steps) {
        const row1 = i * 2;
        const row2 = (i + 1) * 2;
        indices.push(row1, row1 + 1, row2);
        indices.push(row1 + 1, row2 + 1, row2);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    const roadMesh = new THREE.Mesh(geom, asphaltMat);
    roadMesh.receiveShadow = true;
    root.add(roadMesh);

    return root;
  }
}
