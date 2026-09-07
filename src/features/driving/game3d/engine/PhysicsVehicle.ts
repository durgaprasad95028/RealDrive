import * as THREE from 'three';
import { CameraMode, PlayerVehicleState, AITrafficVehicle } from '../types';
import { VehicleModelBundle } from './VehicleModelBuilder';
import { PacejkaTireModel, WheelSlipState } from '../physics/PacejkaTireModel';
import { EngineCombustionModel } from '../physics/EngineCombustionModel';
import { TransmissionDrivetrain } from '../physics/TransmissionDrivetrain';
import { SuspensionChassisKinematics } from '../physics/SuspensionChassisKinematics';
import { AerodynamicsEngine } from '../physics/AerodynamicsEngine';
import { VehicleDamageModel, ImpactZone } from '../physics/VehicleDamageModel';

export class PhysicsVehicle {
  public state: PlayerVehicleState;
  private bundle: VehicleModelBundle;

  // Integrated Physics Subsystems
  public tireFL: PacejkaTireModel;
  public tireFR: PacejkaTireModel;
  public tireRL: PacejkaTireModel;
  public tireRR: PacejkaTireModel;
  public engine: EngineCombustionModel;
  public drivetrain: TransmissionDrivetrain;
  public suspension: SuspensionChassisKinematics;
  public aerodynamics: AerodynamicsEngine;
  public damage: VehicleDamageModel;

  // Physics constants
  private readonly WHEELBASE = 2.75; // meters
  private readonly TRACK_WIDTH = 1.65; // meters
  private readonly VEHICLE_MASS_KG = 1450;
  private readonly MAX_STEER_ANGLE = 0.54; // ~31 degrees
  private readonly STEER_SPEED = 3.2; // rad / sec
  private readonly STEER_RETURN_SPEED = 3.8;

  // Visual tilt & animation
  private currentRoll = 0;
  private currentPitch = 0;
  private wheelSpinAngle = 0;

  // Collision cooldown
  private collisionCooldown = 0;
  public onCollisionCallback?: (severity: number) => void;

  constructor(bundle: VehicleModelBundle, initialPos = new THREE.Vector3(2.2, 0, 0), category = 'sports') {
    this.bundle = bundle;
    this.bundle.root.position.copy(initialPos);

    // 1. Initialize Subsystems based on vehicle class
    this.tireFL = new PacejkaTireModel('SPORT_TOURING', 32.0);
    this.tireFR = new PacejkaTireModel('SPORT_TOURING', 32.0);
    this.tireRL = new PacejkaTireModel('SPORT_TOURING', 32.0);
    this.tireRR = new PacejkaTireModel('SPORT_TOURING', 32.0);

    const aspiration = category === 'bus' || category === 'truck' ? 'TURBO_DIESEL' : category === 'sports' ? 'TURBOCHARGED' : 'NATURALLY_ASPIRATED';
    const maxHp = category === 'sports' ? 450 : category === 'truck' ? 520 : category === 'bus' ? 360 : 280;
    const maxTorque = category === 'truck' ? 1800 : category === 'bus' ? 1200 : category === 'sports' ? 580 : 350;

    this.engine = new EngineCombustionModel(aspiration, maxHp, maxTorque);
    this.drivetrain = new TransmissionDrivetrain(category === 'truck' || category === 'sports' ? 'RWD' : 'FWD', 'DUAL_CLUTCH_7SPEED');
    this.suspension = new SuspensionChassisKinematics(this.VEHICLE_MASS_KG, 0.52, this.WHEELBASE, this.TRACK_WIDTH, 0.48);
    this.aerodynamics = new AerodynamicsEngine(0.29, 2.15, -0.12, -0.32);
    this.damage = new VehicleDamageModel();

    this.state = {
      position: this.bundle.root.position,
      rotation: this.bundle.root.rotation,
      speed: 0,
      speedKmh: 0,
      rpm: 800,
      gear: 'D1',
      steeringAngle: 0,
      throttle: 0,
      brake: 0,
      handbrake: false,
      fuelPercent: 88,
      healthPercent: 100,
      headlights: true,
      blinkerLeft: false,
      blinkerRight: false,
      inCollision: false,
      cameraMode: 'first_person',
    };
  }

  public get velocity(): THREE.Vector3 {
    return new THREE.Vector3(
      Math.sin(this.state.rotation.y) * this.state.speed,
      0,
      Math.cos(this.state.rotation.y) * this.state.speed
    );
  }

  public update(
    dt: number,
    input: { throttle: number; brake: number; steer: number; handbrake: boolean },
    aiVehicles: AITrafficVehicle[],
    worldCollidables: THREE.Box3[]
  ) {
    if (dt > 0.1) dt = 0.1; // clamp delta time for numerical stability

    // 1. Steering Dynamics with speed-sensitive damping
    const speedMS = Math.abs(this.state.speed);
    const speedFactor = Math.max(0.32, 1.0 - (speedMS / 55) * 0.68);
    
    // Steering pull due to mechanical damage/alignment
    const damageOffset = this.damage.getState().steeringDriftOffsetRad;

    if (Math.abs(input.steer) > 0.01) {
      const targetSteer = input.steer * this.MAX_STEER_ANGLE * speedFactor + damageOffset;
      this.state.steeringAngle = THREE.MathUtils.lerp(this.state.steeringAngle, targetSteer, dt * this.STEER_SPEED);
    } else {
      this.state.steeringAngle = THREE.MathUtils.lerp(this.state.steeringAngle, damageOffset, dt * this.STEER_RETURN_SPEED);
    }

    // 2. Aerodynamic Drag & Downforce
    const aeroState = this.aerodynamics.update(this.state.speed);

    // 3. Engine & Drivetrain Powertrain Updates
    const wheelAngularSpeed = this.state.speed / 0.33;
    const wheelSpeeds: [number, number, number, number] = [
      wheelAngularSpeed, wheelAngularSpeed, wheelAngularSpeed, wheelAngularSpeed
    ];

    const engineTel = this.engine.update(input.throttle, 80, this.state.speedKmh, dt);
    const dtState = this.drivetrain.update(engineTel.currentTorqueNm, engineTel.currentRpm, wheelSpeeds, dt);

    this.state.rpm = Math.round(engineTel.currentRpm);
    this.state.gear = dtState.currentGear === -1 ? 'R' : `D${dtState.currentGear}`;

    // 4. Suspension Load Transfer & 4-Corner Normal Forces (Fz)
    const longAccel = (this.state.speed - (this.state.speed - 2 * dt)) / dt;
    const latAccel = (this.state.speed ** 2 / Math.max(5, this.WHEELBASE / Math.max(0.01, Math.sin(Math.abs(this.state.steeringAngle)))));
    const chassisState = this.suspension.update(longAccel, latAccel, dt);

    // 5. Pacejka Tire Force Calculations across all 4 wheels
    const makeSlipState = (idx: number, isFront: boolean, loadN: number): WheelSlipState => ({
      wheelIndex: idx,
      angularVelocityRadS: wheelAngularSpeed,
      longitudinalSpeedMS: this.state.speed,
      lateralSpeedMS: this.state.speed * Math.sin(this.state.steeringAngle) * (isFront ? 1 : 0.2),
      steerAngleRad: isFront ? this.state.steeringAngle : 0,
      camberAngleRad: chassisState.suspensionCorners[idx].dynamicCamberRad,
      normalLoadN: loadN + (isFront ? aeroState.frontDownforceN / 2 : aeroState.rearDownforceN / 2),
      roadSurfaceGrip: 1.0,
      isHydroplaning: false,
    });

    const forceFL = this.tireFL.calculateForces(makeSlipState(0, true, chassisState.cornerLoadsN[0]), dt);
    const forceFR = this.tireFR.calculateForces(makeSlipState(1, true, chassisState.cornerLoadsN[1]), dt);
    const forceRL = this.tireRL.calculateForces(makeSlipState(2, false, chassisState.cornerLoadsN[2]), dt);
    const forceRR = this.tireRR.calculateForces(makeSlipState(3, false, chassisState.cornerLoadsN[3]), dt);

    // Total Longitudinal Traction Force (N)
    const totalTractionN = (forceFL.longitudinalForceN + forceFR.longitudinalForceN + forceRL.longitudinalForceN + forceRR.longitudinalForceN);

    // 6. Net Acceleration & Speed Integration
    let netForceN = totalTractionN - aeroState.dragForceN;
    
    // Braking force
    if (input.brake > 0 && this.state.speed > 0) {
      netForceN -= input.brake * 14000;
    }
    if (input.handbrake) {
      netForceN -= 22000;
    }
    if (input.brake > 0 && this.state.speed <= 0.2) {
      // Reverse
      netForceN -= input.brake * 6500;
      this.state.gear = 'R';
    }

    const netAccMS2 = netForceN / this.VEHICLE_MASS_KG;
    this.state.speed += netAccMS2 * dt;

    // Small friction stop
    if (input.throttle === 0 && input.brake === 0 && Math.abs(this.state.speed) < 0.2) {
      this.state.speed = 0;
    }

    this.state.speedKmh = Math.round(this.state.speed * 3.6);

    // 7. Kinematic Heading Turn (Ackermann Bicycle model)
    if (Math.abs(this.state.speed) > 0.05) {
      const turnRate = (this.state.speed / this.WHEELBASE) * Math.sin(this.state.steeringAngle);
      this.bundle.root.rotation.y += turnRate * dt;
    }

    // 8. Integrate 3D World Position
    const heading = this.bundle.root.rotation.y;
    const forwardX = Math.sin(heading);
    const forwardZ = Math.cos(heading);

    this.bundle.root.position.x += forwardX * this.state.speed * dt;
    this.bundle.root.position.z += forwardZ * this.state.speed * dt;

    // 9. Visual Suspensions & Interior Cockpit Animations
    this.updateVisualComponents(dt, input, chassisState.rollAngleRad, chassisState.pitchAngleRad);

    // 10. Collision Detection & Damage Propagation
    this.checkCollisions(aiVehicles, worldCollidables, dt);

    // 11. Fuel Consumption
    if (this.state.speedKmh > 0 || input.throttle > 0) {
      const burnRate = 0.00075 * (this.state.rpm / 2200) * dt;
      this.state.fuelPercent = Math.max(0, this.state.fuelPercent - burnRate);
    }

    // Health from damage model
    this.state.healthPercent = this.damage.getState().overallHealthPct;
  }

  private updateVisualComponents(
    dt: number,
    input: { throttle: number; brake: number; steer?: number; handbrake?: boolean },
    rollRad: number,
    pitchRad: number
  ) {
    // 1. Pivot front wheels for steering
    if (this.bundle.frontLeftWheelGroup && this.bundle.frontRightWheelGroup) {
      this.bundle.frontLeftWheelGroup.rotation.y = this.state.steeringAngle;
      this.bundle.frontRightWheelGroup.rotation.y = this.state.steeringAngle;
    }

    // 2. Spin all 4 wheels around X axis
    this.wheelSpinAngle += (this.state.speed / 0.33) * dt;
    this.bundle.wheels.forEach((wheel) => {
      wheel.rotation.x = this.wheelSpinAngle;
    });

    // 3. Interior Steering Wheel Rotation (Reacts directly to A/D steer)
    if (this.bundle.steeringWheel) {
      this.bundle.steeringWheel.rotation.z = -this.state.steeringAngle * 2.8;
    }

    // 4. Smooth Body roll and pitch
    this.currentRoll = THREE.MathUtils.lerp(this.currentRoll, rollRad, dt * 10.0);
    this.currentPitch = THREE.MathUtils.lerp(this.currentPitch, pitchRad, dt * 10.0);

    this.bundle.bodyMesh.rotation.z = this.currentRoll;
    this.bundle.bodyMesh.rotation.x = this.currentPitch;

    // 5. Brake Lights Visual
    const isBraking = input.brake > 0 || input.handbrake;
    this.bundle.brakeLights.forEach((bl) => {
      (bl.material as THREE.MeshBasicMaterial).color.setHex(isBraking ? 0xff0000 : 0x550000);
    });
  }

  private checkCollisions(aiVehicles: AITrafficVehicle[], worldCollidables: THREE.Box3[], dt: number) {
    if (this.collisionCooldown > 0) {
      this.collisionCooldown -= dt;
      return;
    }

    const playerBox = new THREE.Box3().setFromObject(this.bundle.root);
    playerBox.expandByScalar(-0.2);

    // 1. Check AI Traffic collisions
    for (const ai of aiVehicles) {
      const aiBox = new THREE.Box3().setFromObject(ai.mesh);
      if (playerBox.intersectsBox(aiBox)) {
        this.handleCollisionImpact(1.0, 'FRONT_BUMPER');
        return;
      }
    }

    // 2. Check world collidables (building walls)
    for (const box of worldCollidables) {
      if (playerBox.intersectsBox(box)) {
        this.handleCollisionImpact(1.3, 'FRONT_BUMPER');
        return;
      }
    }
  }

  private handleCollisionImpact(severity: number, zone: ImpactZone = 'FRONT_BUMPER') {
    this.collisionCooldown = 0.8; // 800ms cooldown
    const impactSpeed = Math.abs(this.state.speedKmh);
    this.damage.applyCollisionImpact(Math.max(25, impactSpeed), zone);

    // Deflect speed
    this.state.speed = -this.state.speed * 0.35;
    this.state.inCollision = true;

    if (this.onCollisionCallback) {
      this.onCollisionCallback(severity);
    }

    setTimeout(() => {
      this.state.inCollision = false;
    }, 400);
  }

  public setCameraMode(mode: CameraMode) {
    this.state.cameraMode = mode;
  }
}

