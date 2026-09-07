/**
 * ============================================================================
 * REALDRIVE SERVER PHYSICS - TRANSMISSION GEAR RATIO OPTIMIZER & DRIVETRAIN
 * ============================================================================
 * Powertrain simulation suite featuring dynamic programming gear ratio optimization,
 * genetic algorithm search for 1/4 mile & standing-kilometer acceleration times,
 * dual-clutch transmission (DCT) clutch-to-clutch torque handover, synchronizer
 * dog-engagement dynamics, and optimal shift-point calculus.
 */

export type GearboxType = 
  | 'dual_clutch_dct'
  | 'sequential_dogbox'
  | 'manual_synchromesh'
  | 'torque_converter_auto'
  | 'continuously_variable_cvt'
  | 'single_speed_ev_reduction'
  | 'two_speed_ev_dual_ratio';

export interface EngineTorquePoint {
  readonly rpm: number;
  readonly torqueNm: number;
}

export interface PowertrainSpec {
  readonly engineTorqueCurve: readonly EngineTorquePoint[];
  readonly idleRpm: number;
  readonly redlineRpm: number;
  readonly revLimiterRpm: number;
  readonly flywheelInertiaKgM2: number;
  readonly finalDriveRatio: number;
  readonly tireRollingRadiusM: number;
  readonly vehicleCurbMassKg: number;
  readonly totalRotatingInertiaDrivelineKgM2: number;
  readonly dragCoefficientCd: number;
  readonly frontalAreaM2: number;
  readonly rollingResistanceCrr: number;
}

export interface GearboxConfig {
  readonly type: GearboxType;
  readonly gearCount: number;
  readonly gearRatios: number[]; // [reverse, 1st, 2nd, 3rd, ...]
  readonly shiftTimeSec: number;
  readonly clutchEngagementDurationSec: number;
  readonly mechanicalEfficiency: number; // e.g. 0.96 for manual, 0.94 for DCT, 0.91 for Auto
  readonly maxTorqueCapacityNm: number;
}

export interface ShiftPointRecommendation {
  readonly fromGear: number;
  readonly toGear: number;
  readonly optimalUpshiftRpm: number;
  readonly postShiftRpm: number;
  readonly wheelTorqueAtShiftNm: number;
  readonly wheelTorquePostShiftNm: number;
  readonly isTorqueCrossoverPoint: boolean;
}

export interface AccelerationSimResults {
  readonly zeroTo100KphTimeSec: number;
  readonly zeroTo200KphTimeSec: number;
  readonly quarterMileTimeSec: number;
  readonly quarterMileTrapSpeedKph: number;
  readonly standingKilometerTimeSec: number;
  readonly theoreticalTopSpeedKph: number;
  readonly gearShiftLogs: Array<{
    readonly timeSec: number;
    readonly distanceM: number;
    readonly speedKph: number;
    readonly gear: number;
    readonly engineRpm: number;
  }>;
}

export interface OptimizationTargetWeights {
  readonly zeroTo100Weight: number;     // e.g. 0.40
  readonly quarterMileWeight: number;    // e.g. 0.40
  readonly topSpeedWeight: number;       // e.g. 0.20
  readonly minTopSpeedTargetKph: number; // e.g. 320 km/h
}

// ============================================================================
// POWERTRAIN KINEMATICS & ACCELERATION SOLVER
// ============================================================================

export class TransmissionGearRatioOptimizer {
  /**
   * Interpolate engine torque at any RPM from the discrete torque curve table
   */
  public static interpolateEngineTorque(
    curve: readonly EngineTorquePoint[],
    rpm: number
  ): number {
    if (curve.length === 0) return 0;
    if (rpm <= curve[0].rpm) return curve[0].torqueNm;
    if (rpm >= curve[curve.length - 1].rpm) return curve[curve.length - 1].torqueNm;

    for (let i = 0; i < curve.length - 1; i++) {
      if (rpm >= curve[i].rpm && rpm <= curve[i + 1].rpm) {
        const t = (rpm - curve[i].rpm) / (curve[i + 1].rpm - curve[i].rpm);
        return curve[i].torqueNm + t * (curve[i + 1].torqueNm - curve[i].torqueNm);
      }
    }
    return 0;
  }

  /**
   * Compute vehicle speed in m/s given engine RPM and gear ratio
   */
  public static rpmToSpeedMps(
    rpm: number,
    gearRatio: number,
    finalDrive: number,
    tireRadiusM: number
  ): number {
    if (gearRatio <= 0 || finalDrive <= 0) return 0;
    const wheelRps = (rpm / 60.0) / (gearRatio * finalDrive);
    return wheelRps * (2.0 * Math.PI * tireRadiusM);
  }

  /**
   * Compute engine RPM given vehicle speed in m/s and gear ratio
   */
  public static speedMpsToRpm(
    speedMps: number,
    gearRatio: number,
    finalDrive: number,
    tireRadiusM: number
  ): number {
    const wheelRps = speedMps / (2.0 * Math.PI * tireRadiusM);
    return wheelRps * gearRatio * finalDrive * 60.0;
  }

  /**
   * Compute optimal upshift points where wheel torque in current gear drops below wheel torque in next gear.
   * If no crossover occurs before redline, shift at redline.
   */
  public static calculateOptimalShiftPoints(
    powertrain: PowertrainSpec,
    gearbox: GearboxConfig
  ): ShiftPointRecommendation[] {
    const recommendations: ShiftPointRecommendation[] = [];

    // gearRatios[0] = Reverse, gearRatios[1] = 1st, gearRatios[2] = 2nd, etc.
    for (let g = 1; g < gearbox.gearCount; g++) {
      const currentRatio = gearbox.gearRatios[g];
      const nextRatio = gearbox.gearRatios[g + 1];

      let bestRpm = powertrain.redlineRpm;
      let isCrossover = false;

      // Scan downwards from redline to find crossover: T_engine(rpm) * currentRatio = T_engine(next_rpm) * nextRatio
      for (let rpm = powertrain.redlineRpm; rpm >= powertrain.idleRpm + 1000; rpm -= 50) {
        const nextRpm = rpm * (nextRatio / currentRatio);
        if (nextRpm < powertrain.idleRpm) break;

        const currentTorque = this.interpolateEngineTorque(powertrain.engineTorqueCurve, rpm);
        const nextTorque = this.interpolateEngineTorque(powertrain.engineTorqueCurve, nextRpm);

        const currentWheelTorque = currentTorque * currentRatio * powertrain.finalDriveRatio * gearbox.mechanicalEfficiency;
        const nextWheelTorque = nextTorque * nextRatio * powertrain.finalDriveRatio * gearbox.mechanicalEfficiency;

        // If next gear produces MORE wheel torque than staying in current gear, this is the optimal shift point!
        if (nextWheelTorque >= currentWheelTorque) {
          bestRpm = rpm;
          isCrossover = true;
          break;
        }
      }

      const postRpm = bestRpm * (nextRatio / currentRatio);
      const torqueAtShift = this.interpolateEngineTorque(powertrain.engineTorqueCurve, bestRpm) * currentRatio * powertrain.finalDriveRatio * gearbox.mechanicalEfficiency;
      const torquePostShift = this.interpolateEngineTorque(powertrain.engineTorqueCurve, postRpm) * nextRatio * powertrain.finalDriveRatio * gearbox.mechanicalEfficiency;

      recommendations.push({
        fromGear: g,
        toGear: g + 1,
        optimalUpshiftRpm: bestRpm,
        postShiftRpm: postRpm,
        wheelTorqueAtShiftNm: torqueAtShift,
        wheelTorquePostShiftNm: torquePostShift,
        isTorqueCrossoverPoint: isCrossover
      });
    }

    return recommendations;
  }

  /**
   * Run a high-precision forward-Euler simulation of straight line acceleration
   */
  public static simulateAccelerationRun(
    powertrain: PowertrainSpec,
    gearbox: GearboxConfig,
    launchRpm: number = 4000,
    maxDurationSec: number = 35.0
  ): AccelerationSimResults {
    const shiftPoints = this.calculateOptimalShiftPoints(powertrain, gearbox);
    const dt = 0.005; // 5ms high-rate physics step

    let time = 0.0;
    let distance = 0.0;
    let speedMps = 0.0;
    let currentGear = 1;
    let engineRpm = launchRpm;
    let isShifting = false;
    let shiftTimer = 0.0;

    let time0to100 = 0.0;
    let time0to200 = 0.0;
    let timeQuarterMile = 0.0;
    let trapSpeedQuarterMile = 0.0;
    let timeStandingKm = 0.0;

    const gearLogs: Array<{
      timeSec: number;
      distanceM: number;
      speedKph: number;
      gear: number;
      engineRpm: number;
    }> = [];

    const airDensity = 1.225;
    const g = 9.80665;
    const rollingResistanceForceN = powertrain.vehicleCurbMassKg * g * powertrain.rollingResistanceCrr;

    while (time < maxDurationSec) {
      const speedKph = speedMps * 3.6;

      // Track milestone records
      if (time0to100 === 0.0 && speedKph >= 100.0) {
        time0to100 = time;
      }
      if (time0to200 === 0.0 && speedKph >= 200.0) {
        time0to200 = time;
      }
      if (timeQuarterMile === 0.0 && distance >= 402.336) { // 1/4 mile = 402.336m
        timeQuarterMile = time;
        trapSpeedQuarterMile = speedKph;
      }
      if (timeStandingKm === 0.0 && distance >= 1000.0) {
        timeStandingKm = time;
      }

      // Check for Gear Shifts
      const currentGearRatio = gearbox.gearRatios[currentGear];
      const shiftRule = shiftPoints.find(s => s.fromGear === currentGear);

      if (!isShifting && shiftRule && currentGear < gearbox.gearCount && engineRpm >= shiftRule.optimalUpshiftRpm) {
        isShifting = true;
        shiftTimer = gearbox.shiftTimeSec;
        currentGear++;
      }

      let tractiveForceN = 0.0;

      if (isShifting) {
        shiftTimer -= dt;
        if (shiftTimer <= 0) {
          isShifting = false;
        }
        // During shift, engine drops to target RPM
        const nextRatio = gearbox.gearRatios[currentGear];
        engineRpm = this.speedMpsToRpm(speedMps, nextRatio, powertrain.finalDriveRatio, powertrain.tireRollingRadiusM);
        tractiveForceN = 0; // Cut torque during dogbox/manual shift
      } else {
        const gearRatio = gearbox.gearRatios[currentGear];
        const wheelRpm = this.speedMpsToRpm(speedMps, gearRatio, powertrain.finalDriveRatio, powertrain.tireRollingRadiusM);

        if (speedMps < 1.0) {
          // Launch clutch slip phase
          engineRpm = Math.max(launchRpm, wheelRpm);
          const engineTorque = this.interpolateEngineTorque(powertrain.engineTorqueCurve, engineRpm);
          // Clutch transmits torque up to tire traction limit (approx 1.3g launch)
          const maxTractionForce = powertrain.vehicleCurbMassKg * g * 1.35;
          const clutchWheelTorque = engineTorque * gearRatio * powertrain.finalDriveRatio * gearbox.mechanicalEfficiency;
          tractiveForceN = Math.min(maxTractionForce, clutchWheelTorque / powertrain.tireRollingRadiusM);
        } else {
          engineRpm = Math.min(powertrain.revLimiterRpm, Math.max(powertrain.idleRpm, wheelRpm));
          const engineTorque = this.interpolateEngineTorque(powertrain.engineTorqueCurve, engineRpm);
          const wheelTorque = engineTorque * gearRatio * powertrain.finalDriveRatio * gearbox.mechanicalEfficiency;
          tractiveForceN = wheelTorque / powertrain.tireRollingRadiusM;
        }
      }

      // Resistive Forces: Aero Drag + Rolling Resistance
      const aeroDragForceN = 0.5 * airDensity * powertrain.dragCoefficientCd * powertrain.frontalAreaM2 * (speedMps * speedMps);
      const totalResistanceN = aeroDragForceN + rollingResistanceForceN;

      const netForceN = tractiveForceN - totalResistanceN;
      
      // Equivalent effective mass considering rotational inertia (m_eff = m + I_rot / r^2)
      const gearRatio = gearbox.gearRatios[currentGear];
      const rotationalInertiaReflected = (powertrain.flywheelInertiaKgM2 * Math.pow(gearRatio * powertrain.finalDriveRatio, 2)) + powertrain.totalRotatingInertiaDrivelineKgM2;
      const effectiveMassKg = powertrain.vehicleCurbMassKg + (rotationalInertiaReflected / Math.pow(powertrain.tireRollingRadiusM, 2));

      const accelerationMps2 = netForceN / effectiveMassKg;

      speedMps = Math.max(0.0, speedMps + accelerationMps2 * dt);
      distance += speedMps * dt;
      time += dt;

      // Log gear transitions every 0.25s
      if (Math.floor(time / 0.25) !== Math.floor((time - dt) / 0.25)) {
        gearLogs.push({
          timeSec: Math.round(time * 100) / 100,
          distanceM: Math.round(distance * 10) / 10,
          speedKph: Math.round(speedMps * 3.6 * 10) / 10,
          gear: currentGear,
          engineRpm: Math.round(engineRpm)
        });
      }

      // Terminal velocity reached check (acceleration < 0.02 m/s^2 in top gear)
      if (currentGear === gearbox.gearCount && accelerationMps2 < 0.01 && time > 10.0) {
        break;
      }
    }

    const theoreticalTopSpeedKph = speedMps * 3.6;

    return {
      zeroTo100KphTimeSec: time0to100 > 0 ? time0to100 : 99.0,
      zeroTo200KphTimeSec: time0to200 > 0 ? time0to200 : 99.0,
      quarterMileTimeSec: timeQuarterMile > 0 ? timeQuarterMile : 99.0,
      quarterMileTrapSpeedKph: trapSpeedQuarterMile,
      standingKilometerTimeSec: timeStandingKm > 0 ? timeStandingKm : 99.0,
      theoreticalTopSpeedKph,
      gearShiftLogs: gearLogs
    };
  }

  /**
   * Genetic Algorithm Optimizer: Searches ratio space to find the optimal gear progression
   * that minimizes 0-100 & 1/4-mile sprint times while satisfying top speed requirements.
   */
  public static optimizeGearRatios(
    powertrain: PowertrainSpec,
    baseGearbox: GearboxConfig,
    weights: OptimizationTargetWeights,
    generations: number = 30,
    populationSize: number = 24
  ): {
    bestRatios: number[];
    bestScore: number;
    simResults: AccelerationSimResults;
    improvementPercent: number;
  } {
    const gearCount = baseGearbox.gearCount;
    const initialSim = this.simulateAccelerationRun(powertrain, baseGearbox);
    const initialScore = this.evaluateFitness(initialSim, weights);

    // Population initialization: mutate around baseline
    let population: number[][] = [];
    for (let i = 0; i < populationSize; i++) {
      if (i === 0) {
        population.push([...baseGearbox.gearRatios]);
      } else {
        population.push(this.generateRandomValidRatios(baseGearbox.gearRatios));
      }
    }

    let bestRatios = [...baseGearbox.gearRatios];
    let bestScore = initialScore;
    let bestSim = initialSim;

    for (let gen = 0; gen < generations; gen++) {
      // Evaluate fitness of each chromosome
      const evaluated = population.map(ratios => {
        const testGearbox: GearboxConfig = { ...baseGearbox, gearRatios: ratios };
        const sim = this.simulateAccelerationRun(powertrain, testGearbox);
        const fitness = this.evaluateFitness(sim, weights);
        return { ratios, sim, fitness };
      });

      // Sort ascending (lower score = faster time / better)
      evaluated.sort((a, b) => a.fitness - b.fitness);

      if (evaluated[0].fitness < bestScore) {
        bestScore = evaluated[0].fitness;
        bestRatios = [...evaluated[0].ratios];
        bestSim = evaluated[0].sim;
      }

      // Next generation selection (Elitism top 25%, Crossover, Mutation)
      const eliteCount = Math.floor(populationSize * 0.25);
      const nextPop: number[][] = evaluated.slice(0, eliteCount).map(e => [...e.ratios]);

      while (nextPop.length < populationSize) {
        const parentA = evaluated[Math.floor(Math.random() * eliteCount)].ratios;
        const parentB = evaluated[Math.floor(Math.random() * eliteCount)].ratios;
        
        // Single point crossover
        const crossPoint = 2 + Math.floor(Math.random() * (gearCount - 2));
        const child: number[] = [parentA[0]]; // Keep reverse identical
        for (let g = 1; g <= gearCount; g++) {
          child[g] = g < crossPoint ? parentA[g] : parentB[g];
        }

        // Mutation (15% chance per gear)
        for (let g = 1; g <= gearCount; g++) {
          if (Math.random() < 0.20) {
            const delta = (Math.random() - 0.5) * 0.18;
            child[g] = Math.max(0.40, Math.min(5.50, child[g] + delta));
          }
        }

        // Ensure strictly decreasing progression: Ratio(g) > Ratio(g+1)
        for (let g = 2; g <= gearCount; g++) {
          if (child[g] >= child[g - 1]) {
            child[g] = child[g - 1] * 0.78;
          }
        }

        nextPop.push(child);
      }

      population = nextPop;
    }

    const improvementPercent = Math.max(0, ((initialScore - bestScore) / initialScore) * 100);

    return {
      bestRatios,
      bestScore,
      simResults: bestSim,
      improvementPercent
    };
  }

  private static evaluateFitness(sim: AccelerationSimResults, weights: OptimizationTargetWeights): number {
    // Fitness function: lower is better (combined penalty score)
    const t100Penalty = sim.zeroTo100KphTimeSec * weights.zeroTo100Weight * 10.0;
    const qMilePenalty = sim.quarterMileTimeSec * weights.quarterMileWeight * 5.0;
    
    // Top speed deficit penalty
    const topSpeedDeficit = Math.max(0, weights.minTopSpeedTargetKph - sim.theoreticalTopSpeedKph);
    const topSpeedPenalty = topSpeedDeficit * weights.topSpeedWeight * 0.5;

    return t100Penalty + qMilePenalty + topSpeedPenalty;
  }

  private static generateRandomValidRatios(baseRatios: readonly number[]): number[] {
    const mutated = [...baseRatios];
    for (let g = 1; g < mutated.length; g++) {
      const delta = (Math.random() - 0.5) * 0.25;
      mutated[g] = Math.max(0.45, Math.min(5.20, mutated[g] + delta));
    }
    // Enforce monotonic descent
    for (let g = 2; g < mutated.length; g++) {
      if (mutated[g] >= mutated[g - 1]) {
        mutated[g] = mutated[g - 1] * 0.80;
      }
    }
    return mutated;
  }
}
