import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    blue: 'bg-blue-950/60 text-blue-400 border-blue-800/50',
    accent: 'bg-sky-950/60 text-sky-400 border-sky-800/50',
    success: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
    warning: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
    danger: 'bg-red-950/60 text-red-400 border-red-800/50',
    neutral: 'bg-slate-900/60 text-slate-400 border-slate-700/50',
    purple: 'bg-purple-950/60 text-purple-400 border-purple-800/50',
  };

  const dotColors = {
    blue: 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]',
    accent: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]',
    success: 'bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]',
    warning: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    danger: 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]',
    neutral: 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.8)]',
    purple: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide font-mono ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />}
      <span>{children}</span>
    </span>
  );
};
