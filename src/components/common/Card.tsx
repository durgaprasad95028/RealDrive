import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glow-blue' | 'glow-accent' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  header,
  footer,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface/80 border border-app-border backdrop-blur-md',
    elevated: 'bg-surface-elevated/90 border border-app-border-light shadow-card-elevated backdrop-blur-md',
    'glow-blue': 'bg-surface/90 border border-blue-500/40 shadow-glow-blue backdrop-blur-md',
    'glow-accent': 'bg-surface/90 border border-sky-400/40 shadow-glow-cyan backdrop-blur-md',
    bordered: 'bg-transparent border border-app-border-light',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {header && <div className="border-b border-app-border/80 px-5 py-3.5 bg-background-secondary/40">{header}</div>}
      <div className={paddingStyles[padding]}>{children}</div>
      {footer && <div className="border-t border-app-border/80 px-5 py-3 bg-background-secondary/30">{footer}</div>}
    </div>
  );
};
