import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  subLabel?: string;
  color?: 'blue' | 'accent' | 'success' | 'warning' | 'danger' | 'gradient';
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  segmented?: boolean;
  segmentsCount?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  subLabel,
  color = 'blue',
  showPercent = true,
  size = 'md',
  segmented = false,
  segmentsCount = 10,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getColorClass = () => {
    if (color === 'gradient') {
      if (percentage < 30) return 'bg-danger';
      if (percentage < 70) return 'bg-warning';
      return 'bg-success';
    }
    const map = {
      blue: 'bg-primary-blue shadow-[0_0_10px_rgba(37,99,235,0.6)]',
      accent: 'bg-accent shadow-[0_0_10px_rgba(56,189,248,0.6)]',
      success: 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.6)]',
      warning: 'bg-warning shadow-[0_0_10px_rgba(245,158,11,0.6)]',
      danger: 'bg-danger shadow-[0_0_10px_rgba(239,68,68,0.6)]',
    };
    return map[color];
  };

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent || subLabel) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
          <span className="text-secondary-text flex items-center gap-1.5">
            {label}
            {subLabel && <span className="text-[10px] text-muted-text">({subLabel})</span>}
          </span>
          {showPercent && (
            <span className="font-mono text-primary-text font-semibold">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {segmented ? (
        <div className="flex gap-1">
          {Array.from({ length: segmentsCount }).map((_, i) => {
            const active = ((i + 1) / segmentsCount) * 100 <= percentage;
            return (
              <div
                key={i}
                className={`flex-1 ${heightMap[size]} rounded-sm transition-all duration-300 ${
                  active ? getColorClass() : 'bg-surface-elevated border border-app-border/60'
                }`}
              />
            );
          })}
        </div>
      ) : (
        <div className={`w-full bg-surface-elevated rounded-full overflow-hidden border border-app-border/80 ${heightMap[size]}`}>
          <div
            className={`h-full transition-all duration-500 rounded-full ${getColorClass()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
