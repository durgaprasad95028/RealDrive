import React from 'react';
import { audioService } from '../../services/audioService';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  const toggle = () => {
    if (!disabled) {
      audioService.playClick();
      onChange(!checked);
    }
  };

  return (
    <div className="flex items-center justify-between cursor-pointer py-1" onClick={toggle}>
      {(label || description) && (
        <div className="pr-4 select-none">
          {label && <p className="text-sm font-medium text-primary-text">{label}</p>}
          {description && <p className="text-xs text-muted-text mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-blue/50 disabled:opacity-50 ${
          checked ? 'bg-primary-blue shadow-glow-blue' : 'bg-surface-elevated border-app-border'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

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
