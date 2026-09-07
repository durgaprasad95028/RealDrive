import * as THREE from 'three';
import { CameraMode, PlayerVehicleState, AITrafficVehicle } from '../types';
import { VehicleModelBundle } from './VehicleModelBuilder';

export class PhysicsVehicle {
  public state: PlayerVehicleState;
  private bundle: VehicleModelBundle;

  // Physics constants
  private readonly WHEELBASE = 2.7; // meters
  private readonly MAX_STEER_ANGLE = 0.52; // ~30 degrees
  private readonly STEER_SPEED = 2.8; // radians / sec
  private readonly STEER_RETURN_SPEED = 3.5;
  private readonly MAX_FORWARD_SPEED = 64; // ~230 km/h (m/s)
  private readonly MAX_REVERSE_SPEED = 10; // ~36 km/h (m/s)
  private readonly ACCELERATION = 9.5; // m/s^2 in 1st gear
  private readonly BRAKE_DECEL = 18.0; // m/s^2
  private readonly HANDBRAKE_DECEL = 28.0; // m/s^2
  private readonly ROLLING_RESISTANCE = 0.8;
  private readonly AIR_DRAG = 0.0022;

  // Visual tilt
  private currentRoll = 0;
  private currentPitch = 0;
  private wheelSpinAngle = 0;

  // Collision cooldown
  private collisionCooldown = 0;
  public onCollisionCallback?: (severity: number) => void;

  constructor(bundle: VehicleModelBundle, initialPos = new THREE.Vector3(2.2, 0, 0)) {
    this.bundle = bundle;
    this.bundle.root.position.copy(initialPos);

    this.state = {
      position: this.bundle.root.position,
      rotation: this.bundle.root.rotation,
      speed: 0,
      speedKmh: 0,
      rpm: 900,
      gear: 'D',
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

  public update(
    dt: number,
    input: { throttle: number; brake: number; steer: number; handbrake: boolean },
    aiVehicles: AITrafficVehicle[],
    worldCollidables: THREE.Box3[]
  ) {
    if (dt > 0.1) dt = 0.1; // clamp delta time for stability

    // 1. Steering Dynamics
    if (Math.abs(input.steer) > 0.01) {
      // Speed-sensitive steering damping (less twitchy at 120+ km/h)
      const speedFactor = Math.max(0.35, 1.0 - (Math.abs(this.state.speed) / 50) * 0.65);
      const targetSteer = input.steer * this.MAX_STEER_ANGLE * speedFactor;
      this.state.steeringAngle = THREE.MathUtils.lerp(this.state.steeringAngle, targetSteer, dt * this.STEER_SPEED);
    } else {
      // Return to center
      this.state.steeringAngle = THREE.MathUtils.lerp(this.state.steeringAngle, 0, dt * this.STEER_RETURN_SPEED);
    }

    // 2. Acceleration / Braking Forces
    let netAcc = 0;
    const isReversing = input.brake > 0 && this.state.speed <= 0.2;

    if (isReversing) {
      this.state.gear = 'R';
      netAcc = -this.ACCELERATION * 0.45 * input.brake;
    } else {
      if (input.throttle > 0) {
        // Dynamic torque curve by speed
        const powerFactor = Math.max(0.2, 1.0 - (this.state.speed / this.MAX_FORWARD_SPEED) * 0.85);
        netAcc += this.ACCELERATION * input.throttle * powerFactor;
      }
      if (input.brake > 0 && this.state.speed > 0) {
        netAcc -= this.BRAKE_DECEL * input.brake;
      }
      if (input.handbrake) {
        netAcc -= this.HANDBRAKE_DECEL;
      }

      // Drag and rolling resistance
      const drag = this.AIR_DRAG * this.state.speed * this.state.speed;
      const rolling = Math.sign(this.state.speed) * this.ROLLING_RESISTANCE;
      netAcc -= (drag + rolling);
    }

    // 3. Integrate Velocity
    this.state.speed += netAcc * dt;

    // Clamp speed
    if (this.state.speed > this.MAX_FORWARD_SPEED) this.state.speed = this.MAX_FORWARD_SPEED;
    if (this.state.speed < -this.MAX_REVERSE_SPEED) this.state.speed = -this.MAX_REVERSE_SPEED;

    // Small friction stop to prevent infinite drift
    if (input.throttle === 0 && input.brake === 0 && Math.abs(this.state.speed) < 0.25) {
      this.state.speed = 0;
    }

    this.state.speedKmh = Math.round(this.state.speed * 3.6);

    // 4. Calculate Simulated RPM and Gear
    this.calculateRPMAndGear(input.throttle);

    // 5. Kinematic Heading Turn (Bicycle model)
    if (Math.abs(this.state.speed) > 0.05) {
      const turnRate = (this.state.speed / this.WHEELBASE) * Math.sin(this.state.steeringAngle);
      this.bundle.root.rotation.y += turnRate * dt;
    }

    // 6. Integrate 3D World Position
    const heading = this.bundle.root.rotation.y;
    const forwardX = Math.sin(heading);
    const forwardZ = Math.cos(heading);

    this.bundle.root.position.x += forwardX * this.state.speed * dt;
    this.bundle.root.position.z += forwardZ * this.state.speed * dt;

    // 7. Visual Suspensions & Wheels
    this.updateVisualComponents(dt, input);

    // 8. Collision Detection
    this.checkCollisions(aiVehicles, worldCollidables, dt);

    // 9. Fuel Consumption
    if (this.state.speedKmh > 0 || input.throttle > 0) {
      const burnRate = 0.0008 * (this.state.rpm / 2000) * dt;
      this.state.fuelPercent = Math.max(0, this.state.fuelPercent - burnRate);
    }
  }

  private calculateRPMAndGear(throttle: number) {
    const kmh = Math.abs(this.state.speedKmh);
    if (this.state.gear === 'R') {
      this.state.rpm = 900 + (kmh / 30) * 4000;
      return;
    }

    let gearNum = 1;
    let gearRatio = 1;
    if (kmh < 25) {
      gearNum = 1;
      gearRatio = kmh / 25;
    } else if (kmh < 50) {
      gearNum = 2;
      gearRatio = (kmh - 25) / 25;
    } else if (kmh < 80) {
      gearNum = 3;
      gearRatio = (kmh - 50) / 30;
    } else if (kmh < 115) {
      gearNum = 4;
      gearRatio = (kmh - 80) / 35;
    } else if (kmh < 155) {
      gearNum = 5;
      gearRatio = (kmh - 115) / 40;
    } else {
      gearNum = 6;
      gearRatio = Math.min(1, (kmh - 155) / 60);
    }

    this.state.gear = `D${gearNum}`;
    const baseRpm = 1200 + gearRatio * 4800;
    this.state.rpm = Math.min(7500, Math.round(baseRpm + throttle * 400));
  }

  private updateVisualComponents(dt: number, input: { throttle: number; brake: number; steer?: number; handbrake?: boolean }) {
    // 1. Pivot front wheels for steering
    if (this.bundle.frontLeftWheelGroup && this.bundle.frontRightWheelGroup) {
      this.bundle.frontLeftWheelGroup.rotation.y = this.state.steeringAngle;
      this.bundle.frontRightWheelGroup.rotation.y = this.state.steeringAngle;
    }

    // 2. Spin all 4 wheels around X axis
    this.wheelSpinAngle += (this.state.speed / 0.34) * dt;
    this.bundle.wheels.forEach((wheel) => {
      wheel.rotation.x = this.wheelSpinAngle;
    });

    // 3. Interior Steering Wheel Rotation (Reacts directly to A/D steer)
    if (this.bundle.steeringWheel) {
      this.bundle.steeringWheel.rotation.z = -this.state.steeringAngle * 2.8;
    }

    // 4. Body roll (tilting into corners) and pitch (braking dive / accel squat)
    const targetRoll = -this.state.steeringAngle * (this.state.speed / 30) * 0.12;
    const targetPitch = (input.brake * 0.04) - (input.throttle * 0.025);
    this.currentRoll = THREE.MathUtils.lerp(this.currentRoll, targetRoll, dt * 6.0);
    this.currentPitch = THREE.MathUtils.lerp(this.currentPitch, targetPitch, dt * 6.0);

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
    // Expand player box slightly for safety
    playerBox.expandByScalar(-0.2);

    // 1. Check AI Traffic collisions
    for (const ai of aiVehicles) {
      const aiBox = new THREE.Box3().setFromObject(ai.mesh);
      if (playerBox.intersectsBox(aiBox)) {
        this.handleCollisionImpact(1.0);
        return;
      }
    }

    // 2. Check world collidables (building walls)
    for (const box of worldCollidables) {
      if (playerBox.intersectsBox(box)) {
        this.handleCollisionImpact(1.2);
        return;
      }
    }

    // 3. Road Bounds check (Metro Parkway width ~16m, sidewalks at |X| > 10.5m)
    // On main straight road away from intersections, prevent driving through buildings
    const z = this.bundle.root.position.z;
    const isIntersection = (z >= 270 && z <= 330) || (z >= 770 && z <= 830);
    if (!isIntersection && Math.abs(this.bundle.root.position.x) > 11.5) {
      // Hit curb/barrier
      this.bundle.root.position.x = Math.sign(this.bundle.root.position.x) * 11.2;
      this.handleCollisionImpact(0.6);
    }
  }

  private handleCollisionImpact(severity: number) {
    this.collisionCooldown = 0.8; // 800ms cooldown
    const damage = Math.round(6 * severity);
    this.state.healthPercent = Math.max(0, this.state.healthPercent - damage);

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
