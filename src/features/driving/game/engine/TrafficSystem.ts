import { TrafficCar, RoadSegment } from './types';
import { RoadRenderer } from './RoadRenderer';

export class TrafficSystem {
  public cars: TrafficCar[] = [];
  public maxCars = 18;

  public init(totalRoadLength: number) {
    this.cars = [];
    const types: Array<TrafficCar['type']> = ['sedan', 'suv', 'taxi', 'bus', 'truck', 'sports'];
    const colors = ['#EF4444', '#38BDF8', '#F59E0B', '#F8FAFC', '#475569', '#10B981', '#6366F1'];
    const lanes = [-0.6, -0.2, 0.2, 0.6];

    for (let i = 0; i < this.maxCars; i++) {
      const type = types[i % types.length];
      const lane = lanes[i % lanes.length];
      const z = (i * 2400 + Math.random() * 800) % totalRoadLength;
      const baseSpeed = type === 'sports' ? 110 : type === 'bus' || type === 'truck' ? 65 : 85;

      this.cars.push({
        id: `traffic-${i}`,
        z,
        x: lane,
        speed: baseSpeed + (Math.random() * 20 - 10),
        maxSpeed: baseSpeed + 15,
        type,
        color: colors[i % colors.length],
        width: type === 'bus' || type === 'truck' ? 260 : 200,
        length: type === 'bus' ? 600 : type === 'truck' ? 500 : 380,
        targetLane: lane,
        isBraking: false,
      });
    }
  }

  public update(
    dt: number,
    totalRoadLength: number,
    playerZ: number,
    currentSignalState?: 'GREEN' | 'YELLOW' | 'RED'
  ) {
    this.cars.forEach((car) => {
      // If red traffic signal nearby ahead, traffic slows/stops
      if (currentSignalState === 'RED') {
        car.isBraking = true;
        car.speed = Math.max(0, car.speed - 40 * dt);
      } else {
        car.isBraking = false;
        if (car.speed < car.maxSpeed) {
          car.speed = Math.min(car.maxSpeed, car.speed + 15 * dt);
        }
      }

      // Move car along road Z
      car.z = (car.z + (car.speed * 1000) / 3600 * dt * 25) % totalRoadLength;

      // Occasional AI lane changes
      if (Math.random() < 0.005) {
        const lanes = [-0.6, -0.2, 0.2, 0.6];
        car.targetLane = lanes[Math.floor(Math.random() * lanes.length)];
      }

      if (Math.abs(car.x - car.targetLane) > 0.02) {
        car.x += (car.targetLane - car.x) * 0.05;
      }
    });
  }

  public checkCollision(
    playerZ: number,
    playerX: number, // Normalized -1 to +1
    playerSpeed: number
  ): { collided: boolean; hitCar: TrafficCar | null; damagePct: number } {
    const playerLength = 350;
    const playerWidth = 0.35; // Normalized width span

    for (const car of this.cars) {
      const zDiff = Math.abs(car.z - playerZ);
      const xDiff = Math.abs(car.x - playerX);

      if (zDiff < playerLength && xDiff < playerWidth) {
        const speedDelta = Math.abs(playerSpeed - car.speed);
        const damage = Math.min(25, Math.max(4, Math.round(speedDelta * 0.35)));
        return { collided: true, hitCar: car, damagePct: damage };
      }
    }

    return { collided: false, hitCar: null, damagePct: 0 };
  }

  public renderCar(
    ctx: CanvasRenderingContext2D,
    car: TrafficCar,
    screenX: number,
    screenY: number,
    scale: number,
    isNight: boolean
  ) {
    ctx.save();
    ctx.translate(screenX, screenY);

    const w = car.width * scale;
    const h = (car.type === 'bus' ? 140 : car.type === 'truck' ? 160 : 110) * scale;
    const halfW = w / 2;

    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 10 * scale, halfW * 1.1, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#0F172A';
    const tyreW = 20 * scale;
    const tyreH = 38 * scale;
    ctx.fillRect(-halfW - 4 * scale, -tyreH / 2, tyreW, tyreH);
    ctx.fillRect(halfW + 4 * scale - tyreW, -tyreH / 2, tyreW, tyreH);

    // Vehicle Body
    ctx.fillStyle = car.color;
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = Math.max(1, 2 * scale);
    ctx.beginPath();
    ctx.roundRect(-halfW, -h * 0.65, w, h * 0.8, 8 * scale);
    ctx.fill();
    ctx.stroke();

    // Cabin / Windows
    ctx.fillStyle = '#1E293B';
    const cabinW = w * 0.75;
    const cabinH = h * 0.45;
    ctx.beginPath();
    ctx.roundRect(-cabinW / 2, -h * 0.9, cabinW, cabinH, 6 * scale);
    ctx.fill();

    // Taillights
    const lightW = 22 * scale;
    const lightH = 10 * scale;
    ctx.fillStyle = car.isBraking ? '#EF4444' : '#991B1B';
    if (car.isBraking) {
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 10;
    }
    ctx.fillRect(-halfW * 0.88, -h * 0.35, lightW, lightH);
    ctx.fillRect(halfW * 0.88 - lightW, -h * 0.35, lightW, lightH);
    ctx.shadowBlur = 0;

    // Taxi Roof Light or Bus text
    if (car.type === 'taxi') {
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-18 * scale, -h * 1.05, 36 * scale, 12 * scale);
    } else if (car.type === 'bus') {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(9 * scale)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('METRO TRANSIT', 0, -h * 0.75);
    }

    ctx.restore();
  }
}
