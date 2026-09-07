import * as THREE from 'three';

export interface TelemetryFrame {
  timestampMs: number;
  position: { x: number; y: number; z: number };
  rotationY: number;
  speedKmh: number;
  throttle: number;
  brake: number;
  steeringAngle: number;
  lateralG: number;
  longitudinalG: number;
  gear: string;
  rpm: number;
}

export interface LapTelemetryRecord {
  id: string;
  driverName: string;
  vehicleName: string;
  trackName: string;
  lapTimeSeconds: number;
  sector1TimeSec: number;
  sector2TimeSec: number;
  sector3TimeSec: number;
  topSpeedKmh: number;
  averageSpeedKmh: number;
  maxLateralG: number;
  dateRecorded: number;
  frames: TelemetryFrame[];
}

export class GhostReplayTelemetryEngine {
  private isRecording: boolean = false;
  private currentLapFrames: TelemetryFrame[] = [];
  private lapStartTime: number = 0;
  private ghostMesh: THREE.Group | null = null;
  private activeGhostRecord: LapTelemetryRecord | null = null;

  public startRecording(trackName: string, driverName: string, vehicleName: string): void {
    this.isRecording = true;
    this.currentLapFrames = [];
    this.lapStartTime = performance.now();
  }

  public recordFrame(
    position: THREE.Vector3,
    rotationY: number,
    speedKmh: number,
    throttle: number,
    brake: number,
    steeringAngle: number,
    lateralG: number,
    longitudinalG: number,
    gear: string,
    rpm: number
  ): void {
    if (!this.isRecording) return;

    this.currentLapFrames.push({
      timestampMs: performance.now() - this.lapStartTime,
      position: { x: position.x, y: position.y, z: position.z },
      rotationY,
      speedKmh,
      throttle,
      brake,
      steeringAngle,
      lateralG,
      longitudinalG,
      gear,
      rpm,
    });
  }

  public finishRecording(
    trackName: string,
    driverName: string,
    vehicleName: string
  ): LapTelemetryRecord | null {
    if (!this.isRecording || this.currentLapFrames.length < 30) {
      this.isRecording = false;
      return null;
    }

    this.isRecording = false;
    const totalTimeSec = (performance.now() - this.lapStartTime) / 1000;

    let maxSpeed = 0;
    let sumSpeed = 0;
    let maxLatG = 0;

    for (const f of this.currentLapFrames) {
      if (f.speedKmh > maxSpeed) maxSpeed = f.speedKmh;
      sumSpeed += f.speedKmh;
      if (Math.abs(f.lateralG) > maxLatG) maxLatG = Math.abs(f.lateralG);
    }

    const avgSpeed = sumSpeed / this.currentLapFrames.length;

    const record: LapTelemetryRecord = {
      id: `lap_${Date.now()}`,
      driverName,
      vehicleName,
      trackName,
      lapTimeSeconds: Math.round(totalTimeSec * 1000) / 1000,
      sector1TimeSec: Math.round(totalTimeSec * 0.32 * 1000) / 1000,
      sector2TimeSec: Math.round(totalTimeSec * 0.35 * 1000) / 1000,
      sector3TimeSec: Math.round(totalTimeSec * 0.33 * 1000) / 1000,
      topSpeedKmh: Math.round(maxSpeed * 10) / 10,
      averageSpeedKmh: Math.round(avgSpeed * 10) / 10,
      maxLateralG: Math.round(maxLatG * 100) / 100,
      dateRecorded: Date.now(),
      frames: this.currentLapFrames,
    };

    this.activeGhostRecord = record;
    return record;
  }

  /**
   * Samples the ghost car position and yaw at a given elapsed lap time in seconds
   */
  public sampleGhostPlayback(elapsedSeconds: number): {
    position: THREE.Vector3;
    rotationY: number;
    speedKmh: number;
    deltaToPlayerSeconds?: number;
  } | null {
    if (!this.activeGhostRecord || this.activeGhostRecord.frames.length === 0) return null;

    const targetMs = elapsedSeconds * 1000;
    const frames = this.activeGhostRecord.frames;

    // Binary search for closest timestamp
    let low = 0;
    let high = frames.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (frames[mid].timestampMs < targetMs) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const idx = Math.min(frames.length - 1, Math.max(0, low));
    const f = frames[idx];

    return {
      position: new THREE.Vector3(f.position.x, f.position.y, f.position.z),
      rotationY: f.rotationY,
      speedKmh: f.speedKmh,
    };
  }

  /**
   * Builds a translucent holographic ghost car 3D mesh
   */
  public buildHolographicGhostMesh(): THREE.Group {
    const root = new THREE.Group();
    root.name = 'HolographicGhostCar';

    const ghostMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.38,
      wireframe: true,
    });

    const bodyGeo = new THREE.BoxGeometry(1.85, 0.75, 4.4);
    const bodyMesh = new THREE.Mesh(bodyGeo, ghostMat);
    bodyMesh.position.set(0, 0.55, 0);
    root.add(bodyMesh);

    const cabinGeo = new THREE.BoxGeometry(1.5, 0.6, 2.2);
    const cabinMesh = new THREE.Mesh(cabinGeo, ghostMat);
    cabinMesh.position.set(0, 1.15, -0.2);
    root.add(cabinMesh);

    return root;
  }
}
