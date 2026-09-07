import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtext?: string;
  highlight?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  subtext,
  highlight = false,
  className = '',
}) => {
  return (
    <Card
      variant={highlight ? 'glow-blue' : 'default'}
      padding="md"
      className={`relative overflow-hidden group ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-secondary-text mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-primary-text">
              {value}
            </span>
            {unit && <span className="text-xs font-mono text-muted-text">{unit}</span>}
          </div>
          {subtext && <p className="text-xs text-muted-text mt-1.5">{subtext}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
              <span className={trend.isPositive ? 'text-success' : 'text-danger'}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-muted-text text-[11px]">vs last period</span>
            </div>
          )}
        </div>

        {icon && (
          <div className="p-2.5 rounded-lg bg-surface-elevated/80 border border-app-border text-accent group-hover:border-blue-500/40 group-hover:text-primary-blue transition-all">
            {icon}
          </div>
        )}
      </div>

      {/* Subtle indicator bar */}
      {highlight && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-sky-400 to-transparent" />
      )}
    </Card>
  );
};
