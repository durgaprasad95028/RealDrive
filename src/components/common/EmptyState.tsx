import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-surface/50 border border-dashed border-app-border rounded-xl ${className}`}>
      <div className="p-4 rounded-full bg-surface-elevated text-accent mb-4 border border-app-border">
        {icon}
      </div>
      <h4 className="text-base font-bold text-primary-text mb-1.5">{title}</h4>
      <p className="text-sm text-secondary-text max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
