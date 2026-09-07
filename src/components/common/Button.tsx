import React from 'react';
import { audioService } from '../../services/audioService';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  glow = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      audioService.playClick();
      onClick?.(e);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-primary-blue hover:bg-primary-hover text-white focus:ring-blue-500 border border-blue-500/30' + (glow ? ' shadow-glow-blue' : ''),
    secondary: 'bg-surface hover:bg-surface-elevated text-primary-text border border-app-border focus:ring-slate-500',
    accent: 'bg-accent hover:bg-sky-400 text-slate-950 font-semibold focus:ring-sky-400' + (glow ? ' shadow-glow-cyan' : ''),
    danger: 'bg-danger/90 hover:bg-danger text-white focus:ring-red-500 border border-red-500/30' + (glow ? ' shadow-glow-danger' : ''),
    outline: 'bg-transparent hover:bg-surface border border-app-border-light text-primary-text hover:border-blue-500/50 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-surface-card text-secondary-text hover:text-primary-text focus:ring-slate-500',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
