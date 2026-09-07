import React from 'react';

interface SpeedometerProps {
  speedKmh: number; // 0 - 320
  speedLimit?: number;
  unit?: 'km/h' | 'mph';
  className?: string;
}

export const Speedometer: React.FC<SpeedometerProps> = ({
  speedKmh,
  speedLimit = 80,
  unit = 'km/h',
  className = '',
}) => {
  const maxSpeed = 300;
  const clampedSpeed = Math.min(maxSpeed, Math.max(0, speedKmh));
  const isSpeeding = speedLimit > 0 && speedKmh > speedLimit;

  // Arc calculation for SVG: from -140deg to +140deg (280deg total)
  const startAngle = -140;
  const totalAngle = 280;
  const currentAngle = startAngle + (clampedSpeed / maxSpeed) * totalAngle;

  const radius = 80;
  const cx = 100;
  const cy = 100;

  // Convert angle to cartesian coordinates
  const polarToCartesian = (angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (start: number, end: number) => {
    const p1 = polarToCartesian(start);
    const p2 = polarToCartesian(end);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`;
  };

  const bgPath = describeArc(startAngle, startAngle + totalAngle);
  const activePath = describeArc(startAngle, Math.max(startAngle + 1, currentAngle));

  return (
    <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-surface/90 border border-app-border backdrop-blur-md ${className}`}>
      {/* Radial Speed Gauge SVG */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full transform rotate-0">
          {/* Background Arc */}
          <path
            d={bgPath}
            fill="none"
            stroke="#1F2937"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active Speed Arc */}
          <path
            d={activePath}
            fill="none"
            stroke={isSpeeding ? '#EF4444' : '#2563EB'}
            strokeWidth="10"
            strokeLinecap="round"
            className="transition-all duration-100 filter drop-shadow-[0_0_8px_rgba(37,99,235,0.7)]"
          />

          {/* Gauge Ticks */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = startAngle + (i / 15) * totalAngle;
            const pOut = polarToCartesian(angle);
            const rIn = radius - 8;
            const angleRad = ((angle - 90) * Math.PI) / 180.0;
            const pIn = { x: cx + rIn * Math.cos(angleRad), y: cy + rIn * Math.sin(angleRad) };
            const isHighlighted = (i / 15) * maxSpeed <= clampedSpeed;

            return (
              <line
                key={i}
                x1={pIn.x}
                y1={pIn.y}
                x2={pOut.x}
                y2={pOut.y}
                stroke={isHighlighted ? (isSpeeding ? '#EF4444' : '#38BDF8') : '#334155'}
                strokeWidth={i % 3 === 0 ? '2' : '1'}
              />
            );
          })}
        </svg>

        {/* Center Digital Speed Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className={`text-4xl sm:text-5xl font-extrabold font-gauge tracking-tight leading-none ${
            isSpeeding ? 'text-danger animate-pulse' : 'text-primary-text'
          }`}>
            {Math.round(clampedSpeed)}
          </span>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-secondary-text mt-1">
            {unit}
          </span>
        </div>
      </div>

      {/* Speed Limit & Status Indicator */}
      <div className="flex items-center gap-3 mt-1">
        {speedLimit > 0 && (
          <div className="w-8 h-8 rounded-full border-2 border-danger bg-white text-black flex items-center justify-center font-bold text-xs font-mono shadow-sm">
            {speedLimit}
          </div>
        )}
        {isSpeeding && (
          <span className="text-xs font-mono font-bold text-danger px-2 py-0.5 rounded bg-red-950/80 border border-red-800 animate-bounce">
            ⚠ SPEEDING
          </span>
        )}
      </div>
    </div>
  );
};

interface TachometerProps {
  rpm: number; // 0 - 8000
  gear: string; // P, R, N, D, 1, 2, 3, 4, 5, 6
  maxRpm?: number;
  redlineRpm?: number;
  className?: string;
}

export const Tachometer: React.FC<TachometerProps> = ({
  rpm,
  gear,
  maxRpm = 8000,
  redlineRpm = 6500,
  className = '',
}) => {
  const clampedRpm = Math.min(maxRpm, Math.max(0, rpm));
  const isRedline = clampedRpm >= redlineRpm;

  const startAngle = -140;
  const totalAngle = 280;
  const currentAngle = startAngle + (clampedRpm / maxRpm) * totalAngle;

  const radius = 80;
  const cx = 100;
  const cy = 100;

  const polarToCartesian = (angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (start: number, end: number) => {
    const p1 = polarToCartesian(start);
    const p2 = polarToCartesian(end);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`;
  };

  const bgPath = describeArc(startAngle, startAngle + totalAngle);
  const activePath = describeArc(startAngle, Math.max(startAngle + 1, currentAngle));

  return (
    <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-surface/90 border border-app-border backdrop-blur-md ${className}`}>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d={bgPath}
            fill="none"
            stroke="#1F2937"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <path
            d={activePath}
            fill="none"
            stroke={isRedline ? '#EF4444' : '#38BDF8'}
            strokeWidth="10"
            strokeLinecap="round"
            className="transition-all duration-100 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
          />

          {Array.from({ length: 9 }).map((_, i) => {
            const angle = startAngle + (i / 8) * totalAngle;
            const pOut = polarToCartesian(angle);
            const rIn = radius - 8;
            const angleRad = ((angle - 90) * Math.PI) / 180.0;
            const pIn = { x: cx + rIn * Math.cos(angleRad), y: cy + rIn * Math.sin(angleRad) };
            const isRed = i >= 6;

            return (
              <line
                key={i}
                x1={pIn.x}
                y1={pIn.y}
                x2={pOut.x}
                y2={pOut.y}
                stroke={isRed ? '#EF4444' : '#94A3B8'}
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Center Gear Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="text-xs font-mono font-semibold text-muted-text uppercase">GEAR</span>
          <span className="text-3xl font-extrabold font-gauge text-primary-text leading-none my-0.5">
            {gear}
          </span>
          <span className={`text-[11px] font-mono font-bold ${isRedline ? 'text-danger' : 'text-accent'}`}>
            {Math.round(clampedRpm).toLocaleString()} RPM
          </span>
        </div>
      </div>

      {/* Shift Light Indicator Bar */}
      <div className="flex items-center gap-1.5 mt-1">
        {Array.from({ length: 6 }).map((_, i) => {
          const lit = (clampedRpm / maxRpm) * 6 > i;
          const isDangerLed = i >= 4;
          return (
            <div
              key={i}
              className={`w-3.5 h-1.5 rounded-sm transition-all ${
                lit
                  ? (isDangerLed ? 'bg-danger shadow-[0_0_6px_rgba(239,68,68,0.9)]' : 'bg-accent shadow-[0_0_6px_rgba(56,189,248,0.9)]')
                  : 'bg-surface-elevated border border-app-border'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
