import { Vehicle, VehicleCustomization } from '../../../../types';

export class CarRenderer {
  public static renderPlayerCarThirdPerson(
    ctx: CanvasRenderingContext2D,
    screenX: number,
    screenY: number,
    scale: number,
    steerAngle: number, // -1 to +1
    isBraking: boolean,
    isAccelerating: boolean,
    turnSignal: 'left' | 'right' | 'hazard' | 'off',
    isNight: boolean,
    customization?: VehicleCustomization,
    vehicleColor: string = '#2563EB'
  ) {
    ctx.save();
    ctx.translate(screenX, screenY);

    // Dynamic roll tilt when steering
    const rollAngle = steerAngle * 0.08;
    ctx.rotate(rollAngle);

    const carW = 220 * scale;
    const carH = 130 * scale;
    const halfW = carW / 2;

    const paint = customization?.exterior?.paintColor || vehicleColor;

    // 1. Soft Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(0, 15 * scale, halfW * 1.15, carH * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Headlight Beams (illuminating road ahead at night/evening)
    if (isNight) {
      const beamL = 380 * scale;
      const beamGrad = ctx.createLinearGradient(0, 0, 0, -beamL);
      beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      beamGrad.addColorStop(0.8, 'rgba(254, 240, 138, 0.1)');
      beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

      ctx.fillStyle = beamGrad;
      // Left Beam
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.7, -carH * 0.5);
      ctx.lineTo(-halfW * 1.8, -beamL);
      ctx.lineTo(0, -beamL);
      ctx.lineTo(-halfW * 0.3, -carH * 0.5);
      ctx.closePath();
      ctx.fill();

      // Right Beam
      ctx.beginPath();
      ctx.moveTo(halfW * 0.3, -carH * 0.5);
      ctx.lineTo(0, -beamL);
      ctx.lineTo(halfW * 1.8, -beamL);
      ctx.lineTo(halfW * 0.7, -carH * 0.5);
      ctx.closePath();
      ctx.fill();
    }

    // 3. Wide Tyres (Left & Right)
    const tyreW = 28 * scale;
    const tyreH = 50 * scale;
    ctx.fillStyle = '#0F172A';

    // Left Tyre
    ctx.beginPath();
    ctx.roundRect(-halfW - 8 * scale, -tyreH / 2, tyreW, tyreH, 6 * scale);
    ctx.fill();

    // Right Tyre
    ctx.beginPath();
    ctx.roundRect(halfW + 8 * scale - tyreW, -tyreH / 2, tyreW, tyreH, 6 * scale);
    ctx.fill();

    // 4. Main Car Chassis (Lower Body)
    const bodyGrad = ctx.createLinearGradient(0, -carH, 0, carH * 0.3);
    bodyGrad.addColorStop(0, paint);
    bodyGrad.addColorStop(1, '#090D16');

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = Math.max(1, 2 * scale);

    ctx.beginPath();
    ctx.roundRect(-halfW, -carH * 0.6, carW, carH * 0.8, 14 * scale);
    ctx.fill();
    ctx.stroke();

    // 5. Rear Bumper Diffuser & Dual Exhausts
    ctx.fillStyle = '#111827';
    ctx.fillRect(-halfW * 0.8, carH * 0.05, carW * 0.8, 18 * scale);

    // Dual Exhaust tips
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.arc(-halfW * 0.55, carH * 0.18, 5 * scale, 0, Math.PI * 2);
    ctx.arc(halfW * 0.55, carH * 0.18, 5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Exhaust Fire / Nitrous particle on acceleration
    if (isAccelerating) {
      ctx.fillStyle = '#38BDF8';
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(-halfW * 0.55, carH * 0.23, 4 * scale, 0, Math.PI * 2);
      ctx.arc(halfW * 0.55, carH * 0.23, 4 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 6. Cabin Glass / Rear Windshield & Roof
    const roofW = carW * 0.72;
    const roofH = carH * 0.5;
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(-roofW / 2, -carH * 0.95, roofW, roofH, 12 * scale);
    ctx.fill();

    // Rear Windshield Glass Reflection
    const glassGrad = ctx.createLinearGradient(-roofW / 2, -carH * 0.8, roofW / 2, -carH * 0.5);
    glassGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    glassGrad.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.roundRect(-roofW * 0.44, -carH * 0.88, roofW * 0.88, roofH * 0.7, 8 * scale);
    ctx.fill();

    // 7. Aerodynamic Rear Wing / Spoiler (if configured)
    if (customization?.exterior?.spoiler && customization.exterior.spoiler !== 'none') {
      ctx.fillStyle = '#090D16';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = Math.max(1, 2 * scale);

      // Spoiler Stanchions
      ctx.fillRect(-halfW * 0.6, -carH * 0.7, 8 * scale, 22 * scale);
      ctx.fillRect(halfW * 0.6 - 8 * scale, -carH * 0.7, 8 * scale, 22 * scale);

      // Spoiler Blade
      ctx.fillStyle = paint;
      ctx.beginPath();
      ctx.roundRect(-halfW * 0.95, -carH * 0.75, carW * 0.95, 10 * scale, 4 * scale);
      ctx.fill();
      ctx.stroke();
    }

    // 8. Dynamic Red LED Taillights & Brake Lights
    const lightW = 34 * scale;
    const lightH = 14 * scale;

    const brakeColor = isBraking ? '#EF4444' : '#991B1B';
    if (isBraking) {
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 18;
    }

    ctx.fillStyle = brakeColor;
    // Left Taillight
    ctx.beginPath();
    ctx.roundRect(-halfW * 0.88, -carH * 0.35, lightW, lightH, 4 * scale);
    ctx.fill();

    // Right Taillight
    ctx.beginPath();
    ctx.roundRect(halfW * 0.88 - lightW, -carH * 0.35, lightW, lightH, 4 * scale);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 9. Turn Signal Indicators (Amber Blinker)
    const isBlinking = Date.now() % 500 < 250;
    if (isBlinking && (turnSignal === 'left' || turnSignal === 'hazard')) {
      ctx.fillStyle = '#F59E0B';
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 14;
      ctx.fillRect(-halfW * 0.92, -carH * 0.35, 8 * scale, lightH);
      ctx.shadowBlur = 0;
    }
    if (isBlinking && (turnSignal === 'right' || turnSignal === 'hazard')) {
      ctx.fillStyle = '#F59E0B';
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 14;
      ctx.fillRect(halfW * 0.92 - 8 * scale, -carH * 0.35, 8 * scale, lightH);
      ctx.shadowBlur = 0;
    }

    // 10. License Plate Box
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    const plateW = 44 * scale;
    const plateH = 16 * scale;
    ctx.fillRect(-plateW / 2, -carH * 0.15, plateW, plateH);
    ctx.strokeRect(-plateW / 2, -carH * 0.15, plateW, plateH);

    ctx.fillStyle = '#000000';
    ctx.font = `bold ${Math.round(8 * scale)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('REALDRIVE', 0, -carH * 0.07);

    ctx.restore();
  }

  public static renderCockpitView(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    steerAngle: number, // -1 to +1
    speedKmh: number,
    rpm: number,
    gear: string
  ) {
    ctx.save();

    // 1. Windshield Pillar Frames (A-Pillars)
    ctx.fillStyle = '#090D16';
    // Left Pillar
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width * 0.15, 0);
    ctx.lineTo(width * 0.28, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Right Pillar
    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(width * 0.85, 0);
    ctx.lineTo(width * 0.72, height);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // 2. Dashboard Horizon Base
    const dashY = height * 0.65;
    const dashGrad = ctx.createLinearGradient(0, dashY, 0, height);
    dashGrad.addColorStop(0, '#111827');
    dashGrad.addColorStop(1, '#07090D');

    ctx.fillStyle = dashGrad;
    ctx.beginPath();
    ctx.moveTo(width * 0.15, dashY);
    ctx.quadraticCurveTo(width / 2, dashY - 30, width * 0.85, dashY);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // 3. Digital Cockpit Display Cluster
    const clusterW = 280;
    const clusterH = 110;
    const clusterX = width / 2 - clusterW / 2;
    const clusterY = dashY + 15;

    ctx.fillStyle = '#030712';
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(clusterX, clusterY, clusterW, clusterH, 14);
    ctx.fill();
    ctx.stroke();

    // Digital Speed text in cluster
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(speedKmh)}`, width / 2, clusterY + 50);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('KM/H', width / 2, clusterY + 70);

    ctx.fillStyle = '#22C55E';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`GEAR ${gear} • ${Math.round(rpm)} RPM`, width / 2, clusterY + 95);

    // 4. Rotating Sport Steering Wheel
    const wheelRadius = 140;
    const wheelCenterX = width / 2;
    const wheelCenterY = height + 30;

    ctx.translate(wheelCenterX, wheelCenterY);
    ctx.rotate(steerAngle * 0.9);

    // Outer Rim
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.arc(0, 0, wheelRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Grip accents
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, wheelRadius + 6, Math.PI * 0.8, Math.PI * 1.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, wheelRadius + 6, -Math.PI * 0.2, Math.PI * 0.2);
    ctx.stroke();

    // Center Hub
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();

    // REALDRIVE Emblem
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('REALDRIVE', 0, 0);

    ctx.restore();
  }
}
