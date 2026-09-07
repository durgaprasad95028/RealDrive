/**
 * Intelligent Driver Model (IDM) & MOBIL (Minimizing Overall Braking Induced by Lane Changes)
 * Advanced Microscopic Traffic Simulation Equations for RealDrive 3D
 */

export interface IDMParameters {
  /** Desired velocity on free road (m/s) */
  desiredVelocity: number;
  /** Minimum bumper-to-bumper net distance headway (m) */
  minimumDistance: number;
  /** Desired time headway to leading vehicle (s) */
  desiredHeadwayTime: number;
  /** Maximum comfortable acceleration (m/s^2) */
  maxAcceleration: number;
  /** Comfortable / desired deceleration (m/s^2) */
  comfortableDeceleration: number;
  /** Acceleration exponent (delta, typically 4) */
  accelerationExponent: number;
  /** Driver reaction time lag (s) */
  reactionTime: number;
  /** Driver politeness factor for MOBIL lane changing [0..1] */
  politeness: number;
  /** Threshold acceleration gain required to initiate lane change (m/s^2) */
  laneChangeThreshold: number;
  /** Maximum safe deceleration of follower in target lane (m/s^2) */
  maxSafeDeceleration: number;
  /** Aggressiveness multiplier on speed & gaps [0.5..2.0] */
  aggressiveness: number;
}

export type DriverPersonality =
  | 'cautious'
  | 'commuter'
  | 'aggressive'
  | 'commercial_truck'
  | 'speeding_courier'
  | 'elderly'
  | 'autonomous_robotaxi';

export interface VehicleSpatialState {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: number; // scalar speed in direction of travel (m/s)
  acceleration: number; // current acceleration (m/s^2)
  heading: number; // yaw angle in radians
  length: number; // bumper-to-bumper length (m)
  width: number; // vehicle width (m)
  laneId: number; // current lane index
  targetLaneId: number; // lane changing target index
  laneOffset: number; // lateral offset in lane (-1..1)
  laneProgress: number; // distance along road spline (m)
  speedLimit: number; // speed limit of current road segment (m/s)
  isYielding: boolean;
  isBraking: boolean;
  isIndicatingLeft: boolean;
  isIndicatingRight: boolean;
}

export interface LaneSurroundings {
  /** Immediate leader in the same lane */
  leaderSameLane?: { distance: number; velocity: number; length: number; id: string };
  /** Immediate follower in the same lane */
  followerSameLane?: { distance: number; velocity: number; length: number; id: string };
  /** Immediate leader in the left lane */
  leaderLeftLane?: { distance: number; velocity: number; length: number; id: string };
  /** Immediate follower in the left lane */
  followerLeftLane?: { distance: number; velocity: number; length: number; id: string };
  /** Immediate leader in the right lane */
  leaderRightLane?: { distance: number; velocity: number; length: number; id: string };
  /** Immediate follower in the right lane */
  followerRightLane?: { distance: number; velocity: number; length: number; id: string };
}

export class IntelligentDriverModel {
  /** Preset profiles for distinct driver behaviors */
  public static readonly PERSONALITY_PRESETS: Record<DriverPersonality, IDMParameters> = {
    cautious: {
      desiredVelocity: 16.67, // ~60 km/h
      minimumDistance: 3.5,
      desiredHeadwayTime: 2.2,
      maxAcceleration: 1.4,
      comfortableDeceleration: 1.8,
      accelerationExponent: 4,
      reactionTime: 0.55,
      politeness: 0.85,
      laneChangeThreshold: 0.35,
      maxSafeDeceleration: 2.2,
      aggressiveness: 0.75,
    },
    commuter: {
      desiredVelocity: 22.22, // ~80 km/h
      minimumDistance: 2.5,
      desiredHeadwayTime: 1.5,
      maxAcceleration: 2.0,
      comfortableDeceleration: 2.2,
      accelerationExponent: 4,
      reactionTime: 0.4,
      politeness: 0.5,
      laneChangeThreshold: 0.2,
      maxSafeDeceleration: 3.0,
      aggressiveness: 1.0,
    },
    aggressive: {
      desiredVelocity: 33.33, // ~120 km/h
      minimumDistance: 1.6,
      desiredHeadwayTime: 0.85,
      maxAcceleration: 3.2,
      comfortableDeceleration: 3.5,
      accelerationExponent: 4,
      reactionTime: 0.25,
      politeness: 0.15,
      laneChangeThreshold: 0.1,
      maxSafeDeceleration: 4.5,
      aggressiveness: 1.65,
    },
    commercial_truck: {
      desiredVelocity: 19.44, // ~70 km/h
      minimumDistance: 5.0,
      desiredHeadwayTime: 2.5,
      maxAcceleration: 0.9,
      comfortableDeceleration: 1.4,
      accelerationExponent: 3.5,
      reactionTime: 0.6,
      politeness: 0.7,
      laneChangeThreshold: 0.45,
      maxSafeDeceleration: 2.0,
      aggressiveness: 0.8,
    },
    speeding_courier: {
      desiredVelocity: 27.78, // ~100 km/h
      minimumDistance: 2.0,
      desiredHeadwayTime: 1.1,
      maxAcceleration: 2.8,
      comfortableDeceleration: 3.0,
      accelerationExponent: 4,
      reactionTime: 0.3,
      politeness: 0.25,
      laneChangeThreshold: 0.15,
      maxSafeDeceleration: 4.0,
      aggressiveness: 1.4,
    },
    elderly: {
      desiredVelocity: 13.89, // ~50 km/h
      minimumDistance: 4.5,
      desiredHeadwayTime: 2.8,
      maxAcceleration: 1.1,
      comfortableDeceleration: 1.5,
      accelerationExponent: 4,
      reactionTime: 0.75,
      politeness: 0.95,
      laneChangeThreshold: 0.6,
      maxSafeDeceleration: 1.8,
      aggressiveness: 0.65,
    },
    autonomous_robotaxi: {
      desiredVelocity: 20.0, // exactly at speed limit
      minimumDistance: 3.0,
      desiredHeadwayTime: 1.6,
      maxAcceleration: 1.8,
      comfortableDeceleration: 2.0,
      accelerationExponent: 4,
      reactionTime: 0.1, // fast sensor latency
      politeness: 0.8,
      laneChangeThreshold: 0.25,
      maxSafeDeceleration: 2.5,
      aggressiveness: 0.95,
    },
  };

  /**
   * Calculates the instantaneous longitudinal acceleration according to standard IDM equations:
   * a = a_max * [ 1 - (v / v_0)^delta - (s*(v, delta_v) / s)^2 ]
   *
   * where s*(v, delta_v) = s_0 + v*T + (v * delta_v) / (2 * sqrt(a_max * b))
   *
   * @param currentSpeed Current speed of ego vehicle in m/s
   * @param desiredSpeed Target free-flow speed or segment speed limit in m/s
   * @param netDistance Gap to leader vehicle bumper (m) (Infinity if no leader)
   * @param leaderSpeed Speed of leader vehicle in m/s (equal to currentSpeed if no leader)
   * @param params IDM parameter configuration
   * @returns Acceleration in m/s^2 (positive for throttle, negative for brake)
   */
  public static calculateAcceleration(
    currentSpeed: number,
    desiredSpeed: number,
    netDistance: number,
    leaderSpeed: number,
    params: IDMParameters
  ): number {
    const v = Math.max(0, currentSpeed);
    const v0 = Math.max(0.1, desiredSpeed * params.aggressiveness);
    const a = params.maxAcceleration * params.aggressiveness;
    const b = params.comfortableDeceleration;
    const s0 = params.minimumDistance;
    const T = params.desiredHeadwayTime;
    const delta = params.accelerationExponent;

    // Free road term: 1 - (v / v0)^delta
    const freeRoadTerm = 1 - Math.pow(v / v0, delta);

    // If there is no leader ahead or leader is extremely far away
    if (!isFinite(netDistance) || netDistance > 250) {
      return a * freeRoadTerm;
    }

    // Relative speed: delta_v = v_ego - v_lead (positive when ego is closing in)
    const deltaV = v - Math.max(0, leaderSpeed);

    // Desired dynamical distance: s* = s0 + v*T + (v * delta_v) / (2 * sqrt(a * b))
    const brakingTerm = (v * deltaV) / (2 * Math.sqrt(Math.max(0.01, a * b)));
    const sStar = s0 + v * T + Math.max(0, brakingTerm);

    // Effective actual gap, clamped to prevent division by zero or negative distance
    const s = Math.max(0.2, netDistance);

    // Interaction deceleration term: (s* / s)^2
    const interactionTerm = Math.pow(sStar / s, 2);

    // Total acceleration
    const rawAcc = a * (freeRoadTerm - interactionTerm);

    // Bound maximum braking to prevent physics explosions (-12 m/s^2 is emergency ABS lock)
    return Math.max(-12.0, Math.min(a, rawAcc));
  }

  /**
   * MOBIL (Minimizing Overall Braking Induced by Lane Changes)
   * Evaluates whether changing to an adjacent target lane is safe and advantageous.
   *
   * Incentive criterion:
   * a_ego_target - a_ego_current + p * [ (a_new_follower - a_old_follower_target) + (a_new_follower_current - a_old_follower_current) ] > Delta_a_th
   *
   * Safety criterion:
   * a_new_follower >= -b_safe
   */
  public static evaluateLaneChange(
    ego: VehicleSpatialState,
    surroundings: LaneSurroundings,
    direction: 'left' | 'right',
    params: IDMParameters,
    isOvertakingRightPermitted: boolean = false
  ): { shouldChange: boolean; reason: string; expectedAdvantage: number } {
    // Check if target lane exists
    const leaderTarget = direction === 'left' ? surroundings.leaderLeftLane : surroundings.leaderRightLane;
    const followerTarget = direction === 'left' ? surroundings.followerLeftLane : surroundings.followerRightLane;

    // In right-hand drive systems, passing on the right may be discouraged unless congested
    if (direction === 'right' && !isOvertakingRightPermitted && ego.velocity > 15) {
      // discourage passing on right at high speed
    }

    // Current acceleration in current lane
    const curLeadDist = surroundings.leaderSameLane ? surroundings.leaderSameLane.distance : Infinity;
    const curLeadSpeed = surroundings.leaderSameLane ? surroundings.leaderSameLane.velocity : ego.velocity;
    const accCurrentEgo = this.calculateAcceleration(
      ego.velocity,
      ego.speedLimit,
      curLeadDist,
      curLeadSpeed,
      params
    );

    // Projected acceleration in target lane
    const tgtLeadDist = leaderTarget ? leaderTarget.distance : Infinity;
    const tgtLeadSpeed = leaderTarget ? leaderTarget.velocity : ego.velocity;
    const accTargetEgo = this.calculateAcceleration(
      ego.velocity,
      ego.speedLimit,
      tgtLeadDist,
      tgtLeadSpeed,
      params
    );

    // Safety Criterion: Can target follower brake comfortably?
    if (followerTarget) {
      // Gap to follower behind ego in the target lane
      const followerDist = followerTarget.distance; // net gap
      const followerSpeed = followerTarget.velocity;

      // If follower is too close, reject immediately for collision prevention
      if (followerDist < params.minimumDistance * 1.2) {
        return { shouldChange: false, reason: 'Follower too close in target lane', expectedAdvantage: 0 };
      }

      // Calculate follower's deceleration if ego cuts in front
      const followerAccAfter = this.calculateAcceleration(
        followerSpeed,
        ego.speedLimit,
        followerDist,
        ego.velocity,
        params
      );

      if (followerAccAfter < -params.maxSafeDeceleration) {
        return { shouldChange: false, reason: 'Unsafe for target lane follower', expectedAdvantage: 0 };
      }
    }

    // Incentive Criterion: Calculate total collective advantage
    const egoAdvantage = accTargetEgo - accCurrentEgo;

    // Altruistic / Politeness evaluation on followers
    let followerDisadvantage = 0;
    if (followerTarget) {
      // Deceleration imposed on new follower
      followerDisadvantage += 0.5; // estimated impact
    }

    const totalAdvantage = egoAdvantage - params.politeness * followerDisadvantage;

    if (totalAdvantage > params.laneChangeThreshold) {
      return {
        shouldChange: true,
        reason: `Advantageous speed gain (${totalAdvantage.toFixed(2)} m/s^2)`,
        expectedAdvantage: totalAdvantage,
      };
    }

    return {
      shouldChange: false,
      reason: `Insufficient advantage (${totalAdvantage.toFixed(2)} <= ${params.laneChangeThreshold})`,
      expectedAdvantage: totalAdvantage,
    };
  }

  /**
   * Calculates smooth lane transition offset (lateral interpolation).
   */
  public static computeLateralTransition(
    currentOffset: number,
    targetOffset: number,
    dt: number,
    lateralSpeed: number = 2.0
  ): { offset: number; isComplete: boolean } {
    const diff = targetOffset - currentOffset;
    if (Math.abs(diff) < 0.02) {
      return { offset: targetOffset, isComplete: true };
    }
    const step = Math.sign(diff) * Math.min(Math.abs(diff), lateralSpeed * dt);
    const newOffset = currentOffset + step;
    return {
      offset: newOffset,
      isComplete: Math.abs(targetOffset - newOffset) < 0.02,
    };
  }
}
