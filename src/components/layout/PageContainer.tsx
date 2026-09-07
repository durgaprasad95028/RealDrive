import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: '5xl' | '6xl' | '7xl' | 'full';
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = '7xl',
  className = '',
}) => {
  const maxWidthStyles = {
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 ${maxWidthStyles[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; onClick?: () => void }>;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-app-border/40 ${className}`}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-xs text-muted-text mb-1.5 font-mono">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {crumb.onClick ? (
                  <button onClick={crumb.onClick} className="hover:text-primary-blue hover:underline">
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-secondary-text">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-primary-text font-sans">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="text-xs sm:text-sm text-secondary-text mt-1 leading-relaxed">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
    </div>
  );
};
