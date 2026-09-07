import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-muted-text pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#0D1117] border rounded-lg px-3.5 py-2.5 text-sm text-primary-text placeholder-muted-text transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue disabled:opacity-50 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${
            error ? 'border-danger focus:ring-danger/50' : 'border-app-border hover:border-slate-700'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-muted-text flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger mt-1.5 flex items-center gap-1 font-medium">⚠ {error}</p>}
      {!error && helperText && <p className="text-xs text-muted-text mt-1.5">{helperText}</p>}
    </div>
  );
};

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-[#0D1117] border rounded-lg px-3.5 py-2.5 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue ${
          error ? 'border-danger' : 'border-app-border'
        } ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-surface text-primary-text">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger mt-1.5 font-medium">⚠ {error}</p>}
    </div>
  );
};
