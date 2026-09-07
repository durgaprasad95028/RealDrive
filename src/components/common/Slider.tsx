import React from 'react';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = '',
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {(label || unit) && (
        <div className="flex justify-between items-center text-xs mb-2">
          {label && <span className="font-semibold uppercase tracking-wider text-secondary-text">{label}</span>}
          <span className="font-mono text-primary-text font-bold">
            {value} {unit}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-primary-blue focus:outline-none disabled:opacity-50"
      />
      <div className="flex justify-between text-[10px] font-mono text-muted-text mt-1">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
