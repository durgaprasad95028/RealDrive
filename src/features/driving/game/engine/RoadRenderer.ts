import { RoadSegment, TrafficCar, WeatherType, TimePeriod } from './types';

export class RoadRenderer {
  public static SEGMENT_LENGTH = 200;
  public static ROAD_WIDTH = 2000;
  public static CAMERA_DEPTH = 0.84;
  public static DRAW_DISTANCE = 300;

  public static project(
    p: { x: number; y: number; z: number },
    cameraX: number,
    cameraY: number,
    cameraZ: number,
    cameraDepth: number,
    width: number,
    height: number,
    roadWidth: number
  ) {
    const worldX = p.x - cameraX;
    const worldY = p.y - cameraY;
    const worldZ = p.z - cameraZ;

    const scale = cameraDepth / Math.max(1, worldZ);
    const screenX = Math.round(width / 2 + (scale * worldX * width) / 2);
    const screenY = Math.round(height / 2 - (scale * worldY * height) / 2);
    const screenW = Math.round((scale * roadWidth * width) / 2);

    return {
      x: screenX,
      y: screenY,
      w: screenW,
      scale: scale,
    };
  }

  public static renderSky(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    timeOfDay: TimePeriod,
    weather: WeatherType,
    skyOffset: number
  ) {
    // Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height / 2);
    if (timeOfDay === 'NIGHT') {
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(1, '#0F172A');
    } else if (timeOfDay === 'EVENING') {
      skyGrad.addColorStop(0, '#31103F');
      skyGrad.addColorStop(0.6, '#9A3412');
      skyGrad.addColorStop(1, '#D97706');
    } else if (weather === 'RAIN' || weather === 'HEAVY_RAIN' || weather === 'FOG') {
      skyGrad.addColorStop(0, '#1E293B');
      skyGrad.addColorStop(1, '#334155');
    } else {
      // Clear Daytime / Morning
      skyGrad.addColorStop(0, '#0284C7');
      skyGrad.addColorStop(0.7, '#38BDF8');
      skyGrad.addColorStop(1, '#93C5FD');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height / 2);

    // Distant Mountain Ranges & City Skyline
    ctx.save();
    const isNight = timeOfDay === 'NIGHT';

    // Mountain silhouettes
    ctx.fillStyle = isNight ? '#090D16' : '#1E293B';
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    for (let x = 0; x <= width; x += 60) {
      const hillH = 40 + Math.sin((x + skyOffset) * 0.005) * 25 + Math.cos((x + skyOffset) * 0.01) * 15;
      ctx.lineTo(x, height / 2 - hillH);
    }
    ctx.lineTo(width, height / 2);
    ctx.closePath();
    ctx.fill();

    // Distant City Skyline Buildings
    ctx.fillStyle = isNight ? '#050811' : '#0F172A';
    for (let i = 0; i < 20; i++) {
      const bx = ((i * 110 + skyOffset * 0.5) % (width + 200)) - 100;
      const bw = 50 + (i % 4) * 15;
      const bh = 60 + ((i * 37) % 70);
      const by = height / 2 - bh;
      ctx.fillRect(bx, by, bw, bh);

      // Building Windows (lit at night/evening)
      if (isNight || timeOfDay === 'EVENING') {
        ctx.fillStyle = (i % 2 === 0) ? '#FEF08A' : '#38BDF8';
        for (let wy = by + 8; wy < height / 2 - 10; wy += 12) {
          for (let wx = bx + 6; wx < bx + bw - 6; wx += 10) {
            if ((wx + wy) % 3 !== 0) {
              ctx.fillRect(wx, wy, 4, 6);
            }
          }
        }
        ctx.fillStyle = '#050811';
      }
    }

    ctx.restore();
  }

  public static renderPolygon(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  }

  public static renderSegment(
    ctx: CanvasRenderingContext2D,
    width: number,
    lanes: number,
    x1: number,
    y1: number,
    w1: number,
    x2: number,
    y2: number,
    w2: number,
    color: { road: string; grass: string; rumble: string; lane: string }
  ) {
    const r1 = w1 / Math.max(6, lanes * 2);
    const r2 = w2 / Math.max(6, lanes * 2);
    const l1 = w1 / 40;
    const l2 = w2 / 40;

    // Grass / Ground
    ctx.fillStyle = color.grass;
    ctx.fillRect(0, y2, width, y1 - y2);

    // Rumble Strips / Curb edges
    this.renderPolygon(ctx, x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble);
    this.renderPolygon(ctx, x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.rumble);

    // Asphalt Road Surface
    this.renderPolygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

    // Lane Dividers
    if (color.lane) {
      const laneW1 = (w1 * 2) / lanes;
      const laneW2 = (w2 * 2) / lanes;
      for (let lane = 1; lane < lanes; lane++) {
        const laneX1 = x1 - w1 + laneW1 * lane;
        const laneX2 = x2 - w2 + laneW2 * lane;
        this.renderPolygon(
          ctx,
          laneX1 - l1 / 2,
          y1,
          laneX1 + l1 / 2,
          y1,
          laneX2 + l2 / 2,
          y2,
          laneX2 - l2 / 2,
          y2,
          color.lane
        );
      }
    }
  }

  public static renderStreetLight(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    side: 'left' | 'right',
    isNight: boolean
  ) {
    const poleH = 140 * scale;
    const armW = 40 * scale;
    const signX = side === 'left' ? x - armW : x + armW;

    ctx.save();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = Math.max(2, 4 * scale);

    // Vertical Pole
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - poleH);
    ctx.lineTo(signX, y - poleH);
    ctx.stroke();

    // Lamp Fixture
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(signX - 6 * scale, y - poleH - 2 * scale, 12 * scale, 6 * scale);

    // Night Illuminating Cone
    if (isNight) {
      const lightGrad = ctx.createRadialGradient(
        signX,
        y - poleH + 4 * scale,
        2,
        signX,
        y - poleH / 2,
        80 * scale
      );
      lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
      lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(signX, y - poleH);
      ctx.lineTo(signX - 60 * scale, y);
      ctx.lineTo(signX + 60 * scale, y);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  public static renderTrafficSignalGantry(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    scale: number,
    state: 'GREEN' | 'YELLOW' | 'RED'
  ) {
    const gantryH = 150 * scale;

    ctx.save();
    // Metal Overhead Truss
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = Math.max(3, 6 * scale);
    ctx.strokeRect(x - w - 20 * scale, y - gantryH, (w + 20 * scale) * 2, 24 * scale);

    // Signal Housing Box
    const boxW = 28 * scale;
    const boxH = 65 * scale;
    const boxX = x - boxW / 2;
    const boxY = y - gantryH + 20 * scale;

    ctx.fillStyle = '#090D16';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = Math.max(1, 2 * scale);
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    const radius = 6 * scale;
    const lightX = x;

    // Red Light
    ctx.fillStyle = state === 'RED' ? '#EF4444' : '#450A0A';
    if (state === 'RED') {
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 12;
    }
    ctx.beginPath();
    ctx.arc(lightX, boxY + 14 * scale, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Yellow Light
    ctx.fillStyle = state === 'YELLOW' ? '#F59E0B' : '#451A03';
    if (state === 'YELLOW') {
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 12;
    }
    ctx.beginPath();
    ctx.arc(lightX, boxY + 32 * scale, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Green Light
    ctx.fillStyle = state === 'GREEN' ? '#22C55E' : '#052E16';
    if (state === 'GREEN') {
      ctx.shadowColor = '#22C55E';
      ctx.shadowBlur = 12;
    }
    ctx.beginPath();
    ctx.arc(lightX, boxY + 50 * scale, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  public static renderSpeedLimitSign(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    limit: number
  ) {
    const signH = 100 * scale;
    const radius = 22 * scale;

    ctx.save();
    // Pole
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = Math.max(2, 3 * scale);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - signH);
    ctx.stroke();

    // Circular Sign
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = Math.max(2, 5 * scale);
    ctx.beginPath();
    ctx.arc(x, y - signH, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Limit Text
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${Math.round(16 * scale)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${limit}`, x, y - signH);

    ctx.restore();
  }

  public static renderWeatherOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    weather: WeatherType,
    rainDrops: Array<{ x: number; y: number; speed: number; l: number }>
  ) {
    if (weather === 'RAIN' || weather === 'HEAVY_RAIN') {
      ctx.save();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
      ctx.lineWidth = weather === 'HEAVY_RAIN' ? 2 : 1.2;

      ctx.beginPath();
      rainDrops.forEach((d) => {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.l);
      });
      ctx.stroke();
      ctx.restore();
    } else if (weather === 'FOG') {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.28)';
      ctx.fillRect(0, 0, width, height);
    }
  }
}
