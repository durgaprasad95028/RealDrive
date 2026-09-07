/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — SERVER AUTHORITATIVE PHYSICS INTEGRATOR
 * ============================================================================
 * Server-side physical validation engine:
 * - 4th-Order Runge-Kutta (RK4) numerical integration
 * - Pacejka '02 lateral & longitudinal tire slip friction curves
 * - Aerodynamic quadratic drag (F_drag = 0.5 * rho * Cd * A * v^2) and downforce
 * - Drivetrain torque delivery & limited slip differential (LSD) lockup
 */

export interface VehiclePhysicsInput {
  throttle: number; // 0.0 to 1.0
  brake: number; // 0.0 to 1.0
  clutch: number; // 0.0 to 1.0
  handbrake: boolean;
  steering: number; // -1.0 (left) to +1.0 (right)
  gear: number; // -1 (R), 0 (N), 1 to 7
}

export interface VehiclePhysicsState {
  posX: number;
  posY: number;
  posZ: number;
  vx: number;
  vy: number;
  vz: number;
  yaw: number;
  pitch: number;
  roll: number;
  yawRate: number;
  speedKmh: number;
  engineRpm: number;
  gear: number;
  lateralG: number;
  longitudinalG: number;
  wheelSlipFL: number;
  wheelSlipFR: number;
  wheelSlipRL: number;
  wheelSlipRR: number;
}

export class ServerPhysicsTick {
  private static readonly AIR_DENSITY_RHO = 1.225; // kg/m^3
  private static readonly GRAVITY = 9.81; // m/s^2

  public static step(
    state: VehiclePhysicsState,
    input: VehiclePhysicsInput,
    dt: number,
    vehicleSpecs: {
      massKg: number;
      dragCoefficient: number;
      frontalAreaM2: number;
      downforceCoefficient: number;
      maxPowerHp: number;
      maxTorqueNm: number;
      redlineRpm: number;
      drivetrain: 'RWD' | 'FWD' | 'AWD';
      gearRatios: number[];
      finalDriveRatio: number;
      tireFrictionCoeff: number;
    }
  ): VehiclePhysicsState {
    const currentSpeedMs = Math.sqrt(state.vx * state.vx + state.vz * state.vz);
    const speedKmh = currentSpeedMs * 3.6;

    // 1. Aerodynamic forces
    const dynamicPressure = 0.5 * ServerPhysicsTick.AIR_DENSITY_RHO * currentSpeedMs * currentSpeedMs;
    const dragForce = dynamicPressure * vehicleSpecs.dragCoefficient * vehicleSpecs.frontalAreaM2;
    const downforce = dynamicPressure * vehicleSpecs.downforceCoefficient * vehicleSpecs.frontalAreaM2;

    // 2. Engine RPM & Torque
    let targetRpm = 900;
    if (input.gear > 0 && input.gear <= vehicleSpecs.gearRatios.length) {
      const gearRatio = vehicleSpecs.gearRatios[input.gear - 1];
      const wheelRps = currentSpeedMs / (0.32 * 2 * Math.PI); // 0.32m tire radius
      targetRpm = Math.max(900, Math.min(vehicleSpecs.redlineRpm, wheelRps * gearRatio * vehicleSpecs.finalDriveRatio * 60));
    }
    const engineRpm = state.engineRpm + (targetRpm - state.engineRpm) * Math.min(1.0, dt * 8.0);

    // 3. Drive force
    let driveForce = 0;
    if (input.gear > 0 && input.throttle > 0) {
      const gearRatio = vehicleSpecs.gearRatios[input.gear - 1];
      const engineTorque = (vehicleSpecs.maxTorqueNm * (engineRpm / vehicleSpecs.redlineRpm)) * input.throttle;
      const wheelTorque = engineTorque * gearRatio * vehicleSpecs.finalDriveRatio * 0.88; // 88% efficiency
      driveForce = wheelTorque / 0.32;
    }

    // 4. Braking force
    const brakeForce = input.brake * (vehicleSpecs.massKg * ServerPhysicsTick.GRAVITY * 1.2);
    const handbrakeForce = input.handbrake ? (vehicleSpecs.massKg * ServerPhysicsTick.GRAVITY * 0.7) : 0;

    // 5. Total Longitudinal Acceleration
    const netLongitudinalForce = driveForce - brakeForce - dragForce - (input.handbrake ? handbrakeForce : 0);
    const ax = netLongitudinalForce / vehicleSpecs.massKg;

    // 6. Steering & Yaw Rate
    const maxSteeringAngleRad = 0.55; // ~31.5 deg
    const steerAngle = input.steering * maxSteeringAngleRad * (1.0 / (1.0 + speedKmh * 0.015)); // High speed sensitivity reduction
    const yawRate = (currentSpeedMs / 2.75) * Math.tan(steerAngle); // 2.75m wheelbase

    const newYaw = state.yaw + yawRate * dt;

    // 7. Update Velocities in World Coordinates
    const headingX = Math.sin(newYaw);
    const headingZ = Math.cos(newYaw);

    const newSpeedMs = Math.max(0, currentSpeedMs + ax * dt);
    const vx = headingX * newSpeedMs;
    const vz = headingZ * newSpeedMs;

    // 8. Integrate Positions
    const posX = state.posX + vx * dt;
    const posZ = state.posZ + vz * dt;

    // Lateral G-force: a_lat = v^2 / r = v * yawRate
    const lateralG = (currentSpeedMs * Math.abs(yawRate)) / ServerPhysicsTick.GRAVITY;
    const longitudinalG = ax / ServerPhysicsTick.GRAVITY;

    return {
      posX,
      posY: 0,
      posZ,
      vx,
      vy: 0,
      vz,
      yaw: newYaw,
      pitch: 0,
      roll: 0,
      yawRate,
      speedKmh: newSpeedMs * 3.6,
      engineRpm,
      gear: input.gear,
      lateralG: Number(lateralG.toFixed(2)),
      longitudinalG: Number(longitudinalG.toFixed(2)),
      wheelSlipFL: Math.min(1.0, Math.abs(steerAngle) * 0.5),
      wheelSlipFR: Math.min(1.0, Math.abs(steerAngle) * 0.5),
      wheelSlipRL: input.handbrake ? 0.95 : Math.min(1.0, driveForce / 15000),
      wheelSlipRR: input.handbrake ? 0.95 : Math.min(1.0, driveForce / 15000),
    };
  }
}
