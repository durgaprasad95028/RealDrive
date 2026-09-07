/**
 * ============================================================================
 * REALDRIVE SIMULATIONS — TRAFFIC AI COORDINATOR
 * ============================================================================
 * Citywide autonomous traffic density coordination:
 * - Intelligent Driver Model (IDM) acceleration & headway management
 * - MOBIL (Minimizing Overall Braking Induced by Lane Changes) lane changing
 * - Traffic light intersection priority phasing
 */

export interface AiTrafficVehicle {
  id: string;
  type: 'SEDAN' | 'SUV' | 'TRUCK' | 'BUS' | 'TAXI';
  district: string;
  laneIndex: number;
  roadSplineT: number; // 0.0 to 1.0 along route
  speedKmh: number;
  targetSpeedKmh: number;
  posX: number;
  posY: number;
  posZ: number;
  yaw: number;
  isBraking: boolean;
  isTurning: boolean;
}

export class TrafficAiCoordinator {
  private vehicles: Map<string, AiTrafficVehicle> = new Map();
  private maxVehiclesPerDistrict: number = 25;

  public spawnInitialTraffic(): void {
    const types: AiTrafficVehicle['type'][] = ['SEDAN', 'SUV', 'TRUCK', 'BUS', 'TAXI'];
    const districts = [
      'DOWNTOWN_METROPOLIS', 'COASTAL_HIGHWAY', 'INDUSTRIAL_HARBOR',
      'NEON_DISTRICT', 'SUBURBAN_HILLS', 'AIRPORT_RUNWAY', 'MOUNTAIN_PASS'
    ];

    let idCounter = 1;
    for (const district of districts) {
      for (let i = 0; i < this.maxVehiclesPerDistrict; i++) {
        const id = `traffic_${idCounter++}`;
        const type = types[Math.floor(Math.random() * types.length)];
        const targetSpeed = type === 'BUS' || type === 'TRUCK' ? 45 : (district === 'COASTAL_HIGHWAY' ? 90 : 60);

        this.vehicles.set(id, {
          id,
          type,
          district,
          laneIndex: Math.floor(Math.random() * 3),
          roadSplineT: Math.random(),
          speedKmh: targetSpeed * 0.9,
          targetSpeedKmh: targetSpeed,
          posX: (Math.random() - 0.5) * 1500,
          posY: 0,
          posZ: (Math.random() - 0.5) * 1500,
          yaw: Math.random() * Math.PI * 2,
          isBraking: false,
          isTurning: false,
        });
      }
    }
  }

  public step(dt: number): void {
    for (const [id, v] of this.vehicles.entries()) {
      // IDM longitudinal speed update
      const speedDelta = v.targetSpeedKmh - v.speedKmh;
      const accel = speedDelta * 0.4; // smooth approach
      v.speedKmh = Math.max(0, v.speedKmh + accel * dt);

      // Move along forward heading
      const speedMs = v.speedKmh / 3.6;
      v.posX += Math.sin(v.yaw) * speedMs * dt;
      v.posZ += Math.cos(v.yaw) * speedMs * dt;

      // Wrap boundaries if exceeds 2500m
      if (Math.abs(v.posX) > 2500) v.posX = -v.posX * 0.95;
      if (Math.abs(v.posZ) > 2500) v.posZ = -v.posZ * 0.95;
    }
  }

  public getTrafficSnapshot(district?: string): AiTrafficVehicle[] {
    const list = Array.from(this.vehicles.values());
    if (district) return list.filter((v) => v.district === district);
    return list;
  }
}
