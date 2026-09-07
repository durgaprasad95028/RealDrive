import { Vehicle, WeatherCondition } from '../../../../types';

export interface PlayerControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  handbrake: boolean;
}

export class PhysicsEngine {
  public speedKmh = 0;
  public posX = 0; // -1.0 (left curb) to +1.0 (right curb)
  public playerZ = 0;
  public steerAngle = 0; // -1 to +1
  public gear = 'D';
  public rpm = 900;
  public totalDistanceDrivenKm = 0;
  public fuelUsedL = 0;
  public bodyDamagePct = 0;

  public update(
    dt: number,
    controls: PlayerControls,
    vehicle: Vehicle,
    weather: WeatherCondition,
    totalRoadLength: number
  ) {
    const maxSpeed = vehicle.topSpeedKmH;
    const accelPower = (vehicle.powerHp / 140) * 48; // km/h per sec
    const brakePower = 110; // km/h per sec
    const grip = weather.roadGripPct / 100;

    // 1. Acceleration & Braking
    if (controls.forward && !controls.backward) {
      const remainingHeadroom = Math.max(0, 1 - this.speedKmh / maxSpeed);
      this.speedKmh = Math.min(maxSpeed, this.speedKmh + accelPower * remainingHeadroom * grip * dt);
    } else if (controls.backward) {
      if (this.speedKmh > 0) {
        // Braking
        this.speedKmh = Math.max(0, this.speedKmh - brakePower * grip * dt);
      } else {
        // Reverse
        this.speedKmh = Math.max(-35, this.speedKmh - 20 * dt);
      }
    } else {
      // Natural rolling drag / Engine friction
      if (this.speedKmh > 0) {
        this.speedKmh = Math.max(0, this.speedKmh - 16 * dt);
      } else if (this.speedKmh < 0) {
        this.speedKmh = Math.min(0, this.speedKmh + 16 * dt);
      }
    }

    // Handbrake
    if (controls.handbrake && Math.abs(this.speedKmh) > 0) {
      this.speedKmh = Math.max(0, this.speedKmh - brakePower * 1.6 * dt);
    }

    // 2. Steering & Lateral Movement
    const steerSpeed = (1.8 / Math.max(1, (this.speedKmh / 160) * 0.8)) * grip;
    if (controls.left) {
      this.steerAngle = Math.max(-1, this.steerAngle - 6 * dt);
      if (Math.abs(this.speedKmh) > 2) {
        this.posX -= steerSpeed * (this.speedKmh / 120) * dt;
      }
    } else if (controls.right) {
      this.steerAngle = Math.min(1, this.steerAngle + 6 * dt);
      if (Math.abs(this.speedKmh) > 2) {
        this.posX += steerSpeed * (this.speedKmh / 120) * dt;
      }
    } else {
      // Auto-center steering wheel
      this.steerAngle *= 0.85;
    }

    // Keep car within boundary limits
    this.posX = Math.max(-1.3, Math.min(1.3, this.posX));

    // Off-road Grass Friction
    if (Math.abs(this.posX) > 0.95 && this.speedKmh > 40) {
      this.speedKmh = Math.max(35, this.speedKmh - 60 * dt);
    }

    // 3. Move along Road Z Track
    const zDelta = (this.speedKmh * 1000 / 3600) * dt * 25;
    this.playerZ = (this.playerZ + zDelta + totalRoadLength) % totalRoadLength;

    // 4. Distance & Fuel accumulation
    if (this.speedKmh > 0) {
      const kmDelta = (this.speedKmh / 3600) * dt;
      this.totalDistanceDrivenKm += kmDelta;
      this.fuelUsedL += kmDelta / vehicle.fuelEconomyKmPerL;
    }

    // 5. RPM & Dynamic Gear Calculation
    if (this.speedKmh <= 0) {
      this.gear = controls.backward ? 'R' : 'P';
      this.rpm = 900;
    } else {
      let g = 1;
      if (this.speedKmh > 180) g = 6;
      else if (this.speedKmh > 135) g = 5;
      else if (this.speedKmh > 95) g = 4;
      else if (this.speedKmh > 60) g = 3;
      else if (this.speedKmh > 28) g = 2;

      this.gear = `${g}`;
      const gearBaseSpeed = (g - 1) * 35;
      const progressInGear = (this.speedKmh - gearBaseSpeed) / 45;
      this.rpm = Math.min(7500, Math.max(1200, 1500 + progressInGear * 4800));
    }
  }

  public applyCollision(damagePct: number) {
    this.bodyDamagePct = Math.min(100, this.bodyDamagePct + damagePct);
    this.speedKmh = Math.max(10, this.speedKmh * 0.45); // Sudden impact slowdown
  }
}
