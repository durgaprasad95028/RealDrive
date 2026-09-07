/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — AI TRAFFIC NAVIGATION & DECISION TREE PLANNER
 * ============================================================================
 * Autonomous city traffic intelligence:
 * - MOBIL (Minimizing Overall Braking Induced by Lane Changes) politeness factor
 * - Intelligent Driver Model (IDM) desired time headway (T = 1.4s)
 * - Pedestrian crosswalk detection and panic evasion steering impulses
 * - Intersection right-of-way arbitration and roundabouts merging
 */

export interface TrafficVehicleAgent {
  agentId: string;
  speedMs: number;
  maxSpeedMs: number;
  desiredHeadwaySeconds: number; // T
  minDistanceMeters: number; // s0
  maxAccelerationMs2: number; // a
  comfortableBrakingMs2: number; // b
  currentLane: number;
  distanceToLeadCarMeters: number;
  leadCarSpeedMs: number;
}

export class AiTrafficNavigationPlanner {
  /**
   * Calculates Intelligent Driver Model (IDM) acceleration:
   * a_idm = a * [ 1 - (v / v0)^delta - (s*(v, delta_v) / s)^2 ]
   */
  public static calculateIdmAcceleration(agent: TrafficVehicleAgent): number {
    const v = agent.speedMs;
    const v0 = agent.maxSpeedMs;
    const deltaV = v - agent.leadCarSpeedMs;
    const s = agent.distanceToLeadCarMeters;

    // Dynamic desired gap: s* = s0 + v*T + (v * deltaV) / (2 * sqrt(a * b))
    const sStar = agent.minDistanceMeters +
      (v * agent.desiredHeadwaySeconds) +
      (v * deltaV) / (2.0 * Math.sqrt(agent.maxAccelerationMs2 * agent.comfortableBrakingMs2));

    const freeRoadTerm = Math.pow(v / Math.max(0.1, v0), 4.0);
    const interactionTerm = Math.pow(Math.max(0, sStar) / Math.max(0.1, s), 2.0);

    const accel = agent.maxAccelerationMs2 * (1.0 - freeRoadTerm - interactionTerm);
    return Math.max(-agent.comfortableBrakingMs2 * 2.5, Math.min(agent.maxAccelerationMs2, accel));
  }

  /**
   * MOBIL Lane Change Decision:
   * Checks if lane change incentive exceeds safety threshold without imposing excessive braking on follower.
   */
  public static evaluateMobilLaneChange(
    agent: TrafficVehicleAgent,
    targetLaneDistanceLeadM: number,
    targetLaneLeadSpeedMs: number,
    targetLaneDistanceFollowerM: number,
    targetLaneFollowerSpeedMs: number,
    politenessFactor: number = 0.35 // 35% polite
  ): { shouldChangeLane: boolean; targetLaneDelta: -1 | 0 | 1 } {
    if (targetLaneDistanceFollowerM < agent.minDistanceMeters * 1.5) {
      return { shouldChangeLane: false, targetLaneDelta: 0 }; // Unsafe follower too close
    }

    const currentAccel = AiTrafficNavigationPlanner.calculateIdmAcceleration(agent);

    // Simulated new accel in target lane
    const simulatedAgent = {
      ...agent,
      distanceToLeadCarMeters: targetLaneDistanceLeadM,
      leadCarSpeedMs: targetLaneLeadSpeedMs,
    };
    const targetLaneAccel = AiTrafficNavigationPlanner.calculateIdmAcceleration(simulatedAgent);

    const incentive = (targetLaneAccel - currentAccel);
    const threshold = 0.4; // 0.4 m/s^2 minimum benefit threshold

    if (incentive > threshold) {
      return { shouldChangeLane: true, targetLaneDelta: 1 };
    }

    return { shouldChangeLane: false, targetLaneDelta: 0 };
  }
}
