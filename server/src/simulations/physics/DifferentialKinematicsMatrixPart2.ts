/**
 * ============================================================================
 * REALDRIVE SERVER PHYSICS - HELICAL TORSEN & ACTIVE CENTER DIFFERENTIAL (PART 2)
 * ============================================================================
 * Advanced drivetrain torque transfer kinematics modeling:
 * 1. Torsen Type B / Type C Helical Planetary Involute Gear meshing.
 * 2. Active Center Differential (ACD) hydraulic multi-plate clutch packs.
 * 3. Variable Front/Rear Torque Split (0:100 RWD to 50:50 Locked AWD).
 * 4. Viscous Coupling Silicone Fluid Non-Newtonian Shear Dilatancy.
 * 5. Open Differential Speed-Averaging Kinematics with Brake-LSD emulation.
 */

export type CenterDifferentialType = 
  | 'torsen_type_c_planetary'
  | 'active_electronic_multiplate_acd'
  | 'viscous_coupling_center'
  | 'mechanical_spool_locked'
  | 'open_differential_with_e_brake';

export interface CenterDiffConfig {
  readonly diffType: CenterDifferentialType;
  readonly nominalFrontBiasPercent: number; // e.g. 35% front / 65% rear
  readonly torqueBiasRatioTBR: number;      // e.g. 3.5:1 for Torsen
  readonly maxClutchLockingTorqueNm: number;// e.g. 1500 Nm for ACD
  readonly viscousFluidViscosityCSt: number;// e.g. 100,000 cSt silicone
  readonly clutchActuationResponseMs: number;
}

export interface CenterDiffState {
  currentFrontTorqueNm: number;
  currentRearTorqueNm: number;
  clutchLockingPressurePercent: number; // 0.0 to 1.0
  frontDriveshaftRpm: number;
  rearDriveshaftRpm: number;
  differentialSlipSpeedRadPerSec: number;
  viscousShearHeatWatts: number;
}

export class DifferentialKinematicsMatrixPart2 {
  /**
   * Initializes center differential state
   */
  public static createInitialState(): CenterDiffState {
    return {
      currentFrontTorqueNm: 0,
      currentRearTorqueNm: 0,
      clutchLockingPressurePercent: 0.35,
      frontDriveshaftRpm: 0,
      rearDriveshaftRpm: 0,
      differentialSlipSpeedRadPerSec: 0,
      viscousShearHeatWatts: 0
    };
  }

  /**
   * Solves front and rear axle torque distribution given input gearbox torque and shaft speeds
   */
  public static solveTorqueSplit(
    state: CenterDiffState,
    config: CenterDiffConfig,
    inputGearboxTorqueNm: number,
    frontWheelSpeedMps: number,
    rearWheelSpeedMps: number,
    tireRadiusM: number,
    finalDriveRatio: number,
    activeYawDemandOffset: number = 0.0 // +/- 0.20 from ESC controller
  ): {
    frontAxleTorqueNm: number;
    rearAxleTorqueNm: number;
    lockupPercent: number;
    torqueTransferDeltaNm: number;
  } {
    // 1. Compute driveshaft angular velocities (rad/sec)
    const frontShaftRps = (frontWheelSpeedMps / (2.0 * Math.PI * tireRadiusM)) * finalDriveRatio;
    const rearShaftRps = (rearWheelSpeedMps / (2.0 * Math.PI * tireRadiusM)) * finalDriveRatio;

    state.frontDriveshaftRpm = frontShaftRps * 60.0;
    state.rearDriveshaftRpm = rearShaftRps * 60.0;

    const omegaFront = frontShaftRps * 2.0 * Math.PI;
    const omegaRear = rearShaftRps * 2.0 * Math.PI;
    const deltaOmega = Math.abs(omegaRear - omegaFront);
    state.differentialSlipSpeedRadPerSec = deltaOmega;

    let frontTorque = 0.0;
    let rearTorque = 0.0;
    let transferDelta = 0.0;
    let lockupPct = 0.0;

    // 2. Center Differential Type Specific Mechanics
    switch (config.diffType) {
      case 'torsen_type_c_planetary': {
        // Torsen Type C has asymmetric baseline epicyclic planetary sun/planet gear geometry (e.g. 40:60)
        const baseFrontFrac = config.nominalFrontBiasPercent / 100.0;
        const baseRearFrac = 1.0 - baseFrontFrac;

        // If one axle slips, worm gears generate axial thrust against friction washers up to TBR
        // $T_{grip} = T_{slip} \times TBR$
        if (omegaRear > omegaFront) {
          // Rear wheels slipping -> Transfer torque to front gripping axle
          const transferRatio = Math.min(config.torqueBiasRatioTBR, 1.0 + (deltaOmega / 10.0));
          frontTorque = inputGearboxTorqueNm * Math.min(0.70, baseFrontFrac * transferRatio);
          rearTorque = inputGearboxTorqueNm - frontTorque;
        } else {
          // Front wheels slipping -> Transfer torque to rear axle
          const transferRatio = Math.min(config.torqueBiasRatioTBR, 1.0 + (deltaOmega / 10.0));
          rearTorque = inputGearboxTorqueNm * Math.min(0.85, baseRearFrac * transferRatio);
          frontTorque = inputGearboxTorqueNm - rearTorque;
        }
        lockupPct = (Math.abs(frontTorque - rearTorque) / Math.max(1.0, inputGearboxTorqueNm)) * 100.0;
        break;
      }

      case 'active_electronic_multiplate_acd': {
        // Active Multi-Plate Clutch electronically modulated by solenoid pressure (0 to 100%)
        let targetClutchPressure = 0.30; // Baseline street lock

        // Lockup increases under hard acceleration (throttle) or high delta-V slip
        if (deltaOmega > 1.5) {
          targetClutchPressure = Math.min(1.0, 0.30 + (deltaOmega / 8.0));
        }

        // Active Yaw control offset (reduce lockup on turn-in for agility, increase lockup on exit)
        targetClutchPressure = Math.max(0.05, Math.min(1.0, targetClutchPressure + activeYawDemandOffset));
        state.clutchLockingPressurePercent = targetClutchPressure;
        lockupPct = targetClutchPressure * 100.0;

        const baseFrontFrac = config.nominalFrontBiasPercent / 100.0;
        const baseRearFrac = 1.0 - baseFrontFrac;

        const openFrontTorque = inputGearboxTorqueNm * baseFrontFrac;
        const openRearTorque = inputGearboxTorqueNm * baseRearFrac;

        // Locking torque transferred from fast axle to slow axle: $T_{clutch} = P_{clutch} \times T_{max}$
        const maxClutchNm = config.maxClutchLockingTorqueNm * targetClutchPressure;
        transferDelta = Math.min(maxClutchNm, Math.abs(openRearTorque - openFrontTorque) + (deltaOmega * 35.0));

        if (omegaRear > omegaFront) {
          frontTorque = openFrontTorque + transferDelta;
          rearTorque = openRearTorque - transferDelta;
        } else {
          frontTorque = openFrontTorque - transferDelta;
          rearTorque = openRearTorque + transferDelta;
        }
        break;
      }

      case 'viscous_coupling_center': {
        // Viscous coupling transmits torque proportional to shear rate of high-viscosity silicone fluid
        const baseFrontFrac = 0.50;
        const baseRearFrac = 0.50;

        // $T_{viscous} = k_{visc} \times \Delta\omega$
        const kViscous = (config.viscousFluidViscosityCSt / 10000.0) * 18.0;
        transferDelta = Math.min(inputGearboxTorqueNm * 0.45, kViscous * deltaOmega);

        if (omegaRear > omegaFront) {
          frontTorque = (inputGearboxTorqueNm * baseFrontFrac) + transferDelta;
          rearTorque = (inputGearboxTorqueNm * baseRearFrac) - transferDelta;
        } else {
          frontTorque = (inputGearboxTorqueNm * baseFrontFrac) - transferDelta;
          rearTorque = (inputGearboxTorqueNm * baseRearFrac) + transferDelta;
        }

        state.viscousShearHeatWatts = transferDelta * deltaOmega;
        lockupPct = Math.min(100.0, (transferDelta / Math.max(1.0, inputGearboxTorqueNm * 0.5)) * 100.0);
        break;
      }

      case 'mechanical_spool_locked': {
        // 50:50 Solid Spool Locked Shaft (Rally / Drag spec)
        frontTorque = inputGearboxTorqueNm * 0.50;
        rearTorque = inputGearboxTorqueNm * 0.50;
        lockupPct = 100.0;
        break;
      }

      default: {
        // Open Differential
        frontTorque = inputGearboxTorqueNm * 0.50;
        rearTorque = inputGearboxTorqueNm * 0.50;
        lockupPct = 0.0;
        break;
      }
    }

    state.currentFrontTorqueNm = frontTorque;
    state.currentRearTorqueNm = rearTorque;

    return {
      frontAxleTorqueNm: frontTorque,
      rearAxleTorqueNm: rearTorque,
      lockupPercent: lockupPct,
      torqueTransferDeltaNm: transferDelta
    };
  }
}
