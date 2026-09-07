import * as THREE from 'three';
import { DriverPersonality, IDMParameters, IntelligentDriverModel } from './IntelligentDriverModel';

export type TrafficVehicleType =
  | 'compact_hatchback'
  | 'executive_sedan'
  | 'suv_crossover'
  | 'semi_truck'
  | 'city_bus'
  | 'delivery_van'
  | 'supercar'
  | 'police_cruiser'
  | 'ambulance'
  | 'muscle_car'
  | 'electric_ev';

export interface TrafficVehicleSpec {
  type: TrafficVehicleType;
  name: string;
  length: number;
  width: number;
  height: number;
  wheelbase: number;
  weightKg: number;
  maxSpeedKmh: number;
  maxPowerHp: number;
  personality: DriverPersonality;
  bodyColorOptions: number[];
  hasSiren: boolean;
  hasTrailer: boolean;
  trailerLength?: number;
}

export const TRAFFIC_VEHICLE_SPECS: Record<TrafficVehicleType, TrafficVehicleSpec> = {
  compact_hatchback: {
    type: 'compact_hatchback',
    name: 'Volt Hatch 1.4',
    length: 3.9,
    width: 1.75,
    height: 1.45,
    wheelbase: 2.5,
    weightKg: 1150,
    maxSpeedKmh: 160,
    maxPowerHp: 120,
    personality: 'commuter',
    bodyColorOptions: [0x3498db, 0xe74c3c, 0x2ecc71, 0xf1c40f, 0x95a5a6, 0xffffff, 0x111111],
    hasSiren: false,
    hasTrailer: false,
  },
  executive_sedan: {
    type: 'executive_sedan',
    name: 'Avara Executive 3.0T',
    length: 4.85,
    width: 1.88,
    height: 1.46,
    wheelbase: 2.92,
    weightKg: 1720,
    maxSpeedKmh: 240,
    maxPowerHp: 340,
    personality: 'commuter',
    bodyColorOptions: [0x1c2833, 0x2c3e50, 0x7f8c8d, 0xbdc3c7, 0x1b2631, 0x0e1111, 0x4a235a],
    hasSiren: false,
    hasTrailer: false,
  },
  suv_crossover: {
    type: 'suv_crossover',
    name: 'Apex Horizon AWD',
    length: 4.75,
    width: 1.95,
    height: 1.72,
    wheelbase: 2.85,
    weightKg: 2050,
    maxSpeedKmh: 200,
    maxPowerHp: 280,
    personality: 'cautious',
    bodyColorOptions: [0xd35400, 0x16a085, 0x2c3e50, 0x7f8c8d, 0x27ae60, 0xffffff, 0x1a1a1a],
    hasSiren: false,
    hasTrailer: false,
  },
  semi_truck: {
    type: 'semi_truck',
    name: 'Titan LongHaul 500',
    length: 6.8,
    width: 2.5,
    height: 3.8,
    wheelbase: 4.4,
    weightKg: 8500,
    maxSpeedKmh: 110,
    maxPowerHp: 560,
    personality: 'commercial_truck',
    bodyColorOptions: [0xc0392b, 0x2980b9, 0xf39c12, 0x27ae60, 0x7f8c8d, 0xffffff],
    hasSiren: false,
    hasTrailer: true,
    trailerLength: 12.0,
  },
  city_bus: {
    type: 'city_bus',
    name: 'Metrolink Transit 40',
    length: 12.2,
    width: 2.55,
    height: 3.2,
    wheelbase: 6.1,
    weightKg: 12500,
    maxSpeedKmh: 90,
    maxPowerHp: 380,
    personality: 'cautious',
    bodyColorOptions: [0x2980b9, 0x27ae60, 0xd35400, 0x8e44ad],
    hasSiren: false,
    hasTrailer: false,
  },
  delivery_van: {
    type: 'delivery_van',
    name: 'TransMax Cargo XL',
    length: 5.9,
    width: 2.05,
    height: 2.45,
    wheelbase: 3.75,
    weightKg: 2400,
    maxSpeedKmh: 150,
    maxPowerHp: 190,
    personality: 'speeding_courier',
    bodyColorOptions: [0xffffff, 0xf1c40f, 0x34495e, 0x2980b9, 0xe67e22],
    hasSiren: false,
    hasTrailer: false,
  },
  supercar: {
    type: 'supercar',
    name: 'Vortex GT V10',
    length: 4.55,
    width: 2.02,
    height: 1.18,
    wheelbase: 2.65,
    weightKg: 1420,
    maxSpeedKmh: 330,
    maxPowerHp: 640,
    personality: 'aggressive',
    bodyColorOptions: [0xe74c3c, 0xf1c40f, 0x9b59b6, 0x1abc9c, 0xe67e22, 0x111111, 0x2ecc71],
    hasSiren: false,
    hasTrailer: false,
  },
  police_cruiser: {
    type: 'police_cruiser',
    name: 'Interceptor Pursuit Unit',
    length: 5.0,
    width: 1.92,
    height: 1.5,
    wheelbase: 2.95,
    weightKg: 1950,
    maxSpeedKmh: 260,
    maxPowerHp: 400,
    personality: 'aggressive',
    bodyColorOptions: [0x0a0a0a],
    hasSiren: true,
    hasTrailer: false,
  },
  ambulance: {
    type: 'ambulance',
    name: 'Metro Paramedic EMS',
    length: 6.2,
    width: 2.2,
    height: 2.6,
    wheelbase: 3.8,
    weightKg: 3800,
    maxSpeedKmh: 160,
    maxPowerHp: 320,
    personality: 'aggressive',
    bodyColorOptions: [0xffffff],
    hasSiren: true,
    hasTrailer: false,
  },
  muscle_car: {
    type: 'muscle_car',
    name: 'Thunderbolt 6.2 V8',
    length: 4.9,
    width: 1.94,
    height: 1.38,
    wheelbase: 2.82,
    weightKg: 1820,
    maxSpeedKmh: 280,
    maxPowerHp: 485,
    personality: 'aggressive',
    bodyColorOptions: [0x111111, 0xc0392b, 0x2471a3, 0xf39c12, 0x512e5f],
    hasSiren: false,
    hasTrailer: false,
  },
  electric_ev: {
    type: 'electric_ev',
    name: 'Cybersurge Dual-Motor',
    length: 4.7,
    width: 1.9,
    height: 1.48,
    wheelbase: 2.88,
    weightKg: 1980,
    maxSpeedKmh: 250,
    maxPowerHp: 450,
    personality: 'autonomous_robotaxi',
    bodyColorOptions: [0xecf0f1, 0x34495e, 0x1b4f72, 0x78281f, 0x145a32],
    hasSiren: false,
    hasTrailer: false,
  },
};

export class TrafficVehicleInstance {
  public id: string;
  public spec: TrafficVehicleSpec;
  public idmParams: IDMParameters;
  public group: THREE.Group;

  // Kinematic state
  public position: THREE.Vector3 = new THREE.Vector3();
  public velocity: number = 0; // m/s
  public acceleration: number = 0; // m/s^2
  public yaw: number = 0; // radians
  public pitch: number = 0; // radians (squat/dive)
  public roll: number = 0; // radians (cornering lean)
  public steerAngle: number = 0; // front wheel steering angle

  // Road navigation state
  public roadSegmentId: string = '';
  public laneIndex: number = 0;
  public targetLaneIndex: number = 0;
  public laneProgress: number = 0; // m along spline
  public lateralOffset: number = 0; // m from lane center
  public targetLateralOffset: number = 0;
  public speedLimit: number = 22.22; // m/s

  // Signal & light states
  public isBraking: boolean = false;
  public isIndicatingLeft: boolean = false;
  public isIndicatingRight: boolean = false;
  public isSirenActive: boolean = false;
  public headlightMesh?: THREE.Mesh;
  public brakeLightMesh?: THREE.Mesh;
  public leftIndicatorMesh?: THREE.Mesh;
  public rightIndicatorMesh?: THREE.Mesh;
  public sirenRedLight?: THREE.PointLight;
  public sirenBlueLight?: THREE.PointLight;
  public sirenMesh?: THREE.Mesh;

  // Wheels for rotation
  public wheels: THREE.Mesh[] = [];
  public frontWheelPivots: THREE.Group[] = [];

  // Trailer if articulated
  public trailerGroup?: THREE.Group;
  public trailerYaw: number = 0;

  // Timers
  private blinkTimer: number = 0;
  private sirenTimer: number = 0;

  constructor(id: string, type: TrafficVehicleType, color?: number) {
    this.id = id;
    this.spec = TRAFFIC_VEHICLE_SPECS[type] || TRAFFIC_VEHICLE_SPECS.compact_hatchback;
    this.idmParams = { ...IntelligentDriverModel.PERSONALITY_PRESETS[this.spec.personality] };

    const selectedColor =
      color !== undefined
        ? color
        : this.spec.bodyColorOptions[Math.floor(Math.random() * this.spec.bodyColorOptions.length)];

    this.group = this.buildVehicleMesh(this.spec, selectedColor);
  }

  private buildVehicleMesh(spec: TrafficVehicleSpec, color: number): THREE.Group {
    const root = new THREE.Group();
    root.name = `Traffic_${this.id}_${spec.type}`;

    const bodyMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.25,
      metalness: 0.75,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111622,
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.8,
      metalness: 0.2,
    });

    const wheelRubberMat = new THREE.MeshStandardMaterial({
      color: 0x181818,
      roughness: 0.9,
      metalness: 0.1,
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.3,
      metalness: 0.85,
    });

    const halfL = spec.length / 2;
    const halfW = spec.width / 2;
    const h = spec.height;

    // Main Chassis Body
    let bodyGeo: THREE.BufferGeometry;
    let cabinGeo: THREE.BufferGeometry;

    if (spec.type === 'semi_truck') {
      // Truck Cab
      bodyGeo = new THREE.BoxGeometry(spec.width, h * 0.9, spec.length * 0.45);
      const cabMesh = new THREE.Mesh(bodyGeo, bodyMat);
      cabMesh.position.set(0, h * 0.55, halfL * 0.5);
      cabMesh.castShadow = true;
      root.add(cabMesh);

      // Cab Windshield
      const windGeo = new THREE.BoxGeometry(spec.width * 0.92, h * 0.35, 0.15);
      const windMesh = new THREE.Mesh(windGeo, glassMat);
      windMesh.position.set(0, h * 0.75, halfL * 0.72);
      root.add(windMesh);

      // Chassis rails behind
      const railGeo = new THREE.BoxGeometry(spec.width * 0.6, 0.3, spec.length * 0.55);
      const railMesh = new THREE.Mesh(railGeo, trimMat);
      railMesh.position.set(0, 0.45, -halfL * 0.35);
      root.add(railMesh);
    } else if (spec.type === 'city_bus') {
      // Monocoque Bus Box
      bodyGeo = new THREE.BoxGeometry(spec.width, h * 0.8, spec.length);
      const busMesh = new THREE.Mesh(bodyGeo, bodyMat);
      busMesh.position.set(0, h * 0.5, 0);
      busMesh.castShadow = true;
      root.add(busMesh);

      // Panoramic Windows band
      const windowBandGeo = new THREE.BoxGeometry(spec.width * 1.01, h * 0.32, spec.length * 0.92);
      const windowMesh = new THREE.Mesh(windowBandGeo, glassMat);
      windowMesh.position.set(0, h * 0.62, 0);
      root.add(windowMesh);
    } else {
      // Standard Cars & SUVs
      const lowerH = h * 0.45;
      bodyGeo = new THREE.BoxGeometry(spec.width, lowerH, spec.length);
      const lowerMesh = new THREE.Mesh(bodyGeo, bodyMat);
      lowerMesh.position.set(0, lowerH * 0.5 + 0.25, 0);
      lowerMesh.castShadow = true;
      root.add(lowerMesh);

      // Cabin / Greenhouse
      const cabinL = spec.length * (spec.type === 'supercar' ? 0.45 : 0.55);
      const cabinW = spec.width * 0.86;
      const cabinH = h * 0.48;
      cabinGeo = new THREE.BoxGeometry(cabinW, cabinH, cabinL);
      const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
      cabinMesh.position.set(0, lowerH + cabinH * 0.5 + 0.2, -spec.length * 0.04);
      cabinMesh.castShadow = true;
      root.add(cabinMesh);

      // Roof panel
      const roofGeo = new THREE.BoxGeometry(cabinW * 0.95, 0.05, cabinL * 0.85);
      const roofMesh = new THREE.Mesh(roofGeo, bodyMat);
      roofMesh.position.set(0, lowerH + cabinH + 0.22, -spec.length * 0.04);
      root.add(roofMesh);
    }

    // Headlights (LED white emissive)
    const headLightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.5,
      roughness: 0.1,
    });
    const headGeo = new THREE.BoxGeometry(spec.width * 0.22, 0.12, 0.08);
    const leftHead = new THREE.Mesh(headGeo, headLightMat);
    leftHead.position.set(-halfW * 0.72, 0.5, halfL);
    const rightHead = new THREE.Mesh(headGeo, headLightMat);
    rightHead.position.set(halfW * 0.72, 0.5, halfL);
    root.add(leftHead, rightHead);
    this.headlightMesh = leftHead;

    // Brake Lights (Red emissive)
    const brakeMat = new THREE.MeshStandardMaterial({
      color: 0xff1111,
      emissive: 0x660000,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });
    const brakeGeo = new THREE.BoxGeometry(spec.width * 0.24, 0.14, 0.08);
    const leftBrake = new THREE.Mesh(brakeGeo, brakeMat);
    leftBrake.position.set(-halfW * 0.72, 0.55, -halfL);
    const rightBrake = new THREE.Mesh(brakeGeo, brakeMat.clone());
    rightBrake.position.set(halfW * 0.72, 0.55, -halfL);
    root.add(leftBrake, rightBrake);
    this.brakeLightMesh = leftBrake;

    // Indicators
    const indicatorMat = new THREE.MeshStandardMaterial({
      color: 0xff8800,
      emissive: 0x000000,
      emissiveIntensity: 0.0,
      roughness: 0.3,
    });
    const indGeo = new THREE.BoxGeometry(0.12, 0.08, 0.06);
    this.leftIndicatorMesh = new THREE.Mesh(indGeo, indicatorMat);
    this.leftIndicatorMesh.position.set(-halfW * 0.88, 0.52, -halfL);
    this.rightIndicatorMesh = new THREE.Mesh(indGeo, indicatorMat.clone());
    this.rightIndicatorMesh.position.set(halfW * 0.88, 0.52, -halfL);
    root.add(this.leftIndicatorMesh, this.rightIndicatorMesh);

    // Siren Bar (Police & Ambulance)
    if (spec.hasSiren) {
      const sirenBarGeo = new THREE.BoxGeometry(spec.width * 0.6, 0.12, 0.25);
      const sirenBarMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
      const sirenBar = new THREE.Mesh(sirenBarGeo, sirenBarMat);
      sirenBar.position.set(0, spec.height + 0.06, 0);
      root.add(sirenBar);

      this.sirenRedLight = new THREE.PointLight(0xff0000, 0, 15);
      this.sirenRedLight.position.set(-spec.width * 0.2, spec.height + 0.2, 0);
      this.sirenBlueLight = new THREE.PointLight(0x0044ff, 0, 15);
      this.sirenBlueLight.position.set(spec.width * 0.2, spec.height + 0.2, 0);
      root.add(this.sirenRedLight, this.sirenBlueLight);
    }

    // Wheels
    const wheelRadius = spec.type === 'semi_truck' || spec.type === 'city_bus' ? 0.52 : 0.34;
    const wheelWidth = 0.24;
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 14);
    wheelGeo.rotateZ(Math.PI / 2);

    const rimGeo = new THREE.CylinderGeometry(wheelRadius * 0.65, wheelRadius * 0.65, wheelWidth + 0.01, 10);
    rimGeo.rotateZ(Math.PI / 2);

    const wheelX = halfW * 0.92;
    const frontZ = spec.wheelbase * 0.5;
    const rearZ = -spec.wheelbase * 0.5;

    // Front Left Pivot
    const flPivot = new THREE.Group();
    flPivot.position.set(-wheelX, wheelRadius, frontZ);
    const flWheel = new THREE.Mesh(wheelGeo, wheelRubberMat);
    flWheel.add(new THREE.Mesh(rimGeo, rimMat));
    flPivot.add(flWheel);
    root.add(flPivot);
    this.frontWheelPivots.push(flPivot);
    this.wheels.push(flWheel);

    // Front Right Pivot
    const frPivot = new THREE.Group();
    frPivot.position.set(wheelX, wheelRadius, frontZ);
    const frWheel = new THREE.Mesh(wheelGeo, wheelRubberMat);
    frWheel.add(new THREE.Mesh(rimGeo, rimMat));
    frPivot.add(frWheel);
    root.add(frPivot);
    this.frontWheelPivots.push(frPivot);
    this.wheels.push(frWheel);

    // Rear Left Wheel
    const rlWheel = new THREE.Mesh(wheelGeo, wheelRubberMat);
    rlWheel.add(new THREE.Mesh(rimGeo, rimMat));
    rlWheel.position.set(-wheelX, wheelRadius, rearZ);
    root.add(rlWheel);
    this.wheels.push(rlWheel);

    // Rear Right Wheel
    const rrWheel = new THREE.Mesh(wheelGeo, wheelRubberMat);
    rrWheel.add(new THREE.Mesh(rimGeo, rimMat));
    rrWheel.position.set(wheelX, wheelRadius, rearZ);
    root.add(rrWheel);
    this.wheels.push(rrWheel);

    // Semi Trailer
    if (spec.hasTrailer && spec.trailerLength) {
      this.trailerGroup = this.buildTrailerMesh(spec.trailerLength, spec.width, spec.height, bodyMat);
      this.trailerGroup.position.set(0, 0, -halfL - 0.5);
      root.add(this.trailerGroup);
    }

    return root;
  }

  private buildTrailerMesh(
    length: number,
    width: number,
    height: number,
    bodyMat: THREE.Material
  ): THREE.Group {
    const trailer = new THREE.Group();
    trailer.name = `Trailer_${this.id}`;

    // Cargo Box
    const boxGeo = new THREE.BoxGeometry(width * 1.05, height * 0.95, length);
    const boxMesh = new THREE.Mesh(boxGeo, bodyMat);
    boxMesh.position.set(0, height * 0.55, -length * 0.5);
    boxMesh.castShadow = true;
    trailer.add(boxMesh);

    // Trailer Wheels (tandem axles at back)
    const wheelRadius = 0.52;
    const wheelWidth = 0.26;
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.9 });

    for (let zOffset of [-length * 0.75, -length * 0.88]) {
      const wL = new THREE.Mesh(wheelGeo, wheelMat);
      wL.position.set(-width * 0.52, wheelRadius, zOffset);
      const wR = new THREE.Mesh(wheelGeo, wheelMat);
      wR.position.set(width * 0.52, wheelRadius, zOffset);
      trailer.add(wL, wR);
    }

    return trailer;
  }

  /**
   * Updates 3D mesh transform, animations, wheels, brake lights, and sirens
   */
  public update(dt: number): void {
    // Sync main group position and orientation
    this.group.position.copy(this.position);
    this.group.rotation.set(this.pitch, this.yaw, this.roll, 'YXZ');

    // Rotate wheels based on vehicle velocity
    const wheelRadius = this.spec.type === 'semi_truck' || this.spec.type === 'city_bus' ? 0.52 : 0.34;
    const angularSpeed = this.velocity / wheelRadius;
    for (const w of this.wheels) {
      w.rotation.x += angularSpeed * dt;
    }

    // Steer front wheel pivots
    for (const p of this.frontWheelPivots) {
      p.rotation.y = this.steerAngle;
    }

    // Brake light glow
    if (this.brakeLightMesh && (this.brakeLightMesh.material as THREE.MeshStandardMaterial)) {
      const mat = this.brakeLightMesh.material as THREE.MeshStandardMaterial;
      if (this.isBraking || this.acceleration < -0.3) {
        mat.emissive.setHex(0xff0000);
        mat.emissiveIntensity = 2.0;
      } else {
        mat.emissive.setHex(0x550000);
        mat.emissiveIntensity = 0.4;
      }
    }

    // Blinkers
    this.blinkTimer += dt * 3.5;
    const blinkOn = Math.sin(this.blinkTimer * Math.PI * 2) > 0;
    if (this.leftIndicatorMesh) {
      const mat = this.leftIndicatorMesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = this.isIndicatingLeft && blinkOn ? 2.5 : 0.0;
    }
    if (this.rightIndicatorMesh) {
      const mat = this.rightIndicatorMesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = this.isIndicatingRight && blinkOn ? 2.5 : 0.0;
    }

    // Emergency Siren Flasher
    if (this.spec.hasSiren && this.isSirenActive && this.sirenRedLight && this.sirenBlueLight) {
      this.sirenTimer += dt * 8.0;
      const sirenPhase = Math.sin(this.sirenTimer);
      if (sirenPhase > 0) {
        this.sirenRedLight.intensity = 2.5;
        this.sirenBlueLight.intensity = 0.0;
      } else {
        this.sirenRedLight.intensity = 0.0;
        this.sirenBlueLight.intensity = 2.5;
      }
    } else if (this.sirenRedLight && this.sirenBlueLight) {
      this.sirenRedLight.intensity = 0;
      this.sirenBlueLight.intensity = 0;
    }

    // Articulated trailer follow physics
    if (this.trailerGroup) {
      const angleDiff = this.yaw - this.trailerYaw;
      this.trailerYaw += angleDiff * Math.min(1.0, dt * 5.0);
      this.trailerGroup.rotation.y = this.trailerYaw - this.yaw;
    }
  }

  public dispose(): void {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }
}
