import React from 'react';
import { audioService } from '../../services/audioService';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className = '',
}) => {
  const handleTabClick = (id: string) => {
    if (id !== activeTab) {
      audioService.playClick();
      onChange(id);
    }
  };

  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-app-border space-x-6 overflow-x-auto ${className}`}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`pb-3 px-1 flex items-center gap-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-primary-blue text-primary-blue font-semibold'
                  : 'border-transparent text-secondary-text hover:text-primary-text hover:border-slate-700'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-blue-900/60 text-blue-300' : 'bg-surface-elevated text-secondary-text'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex p-1 bg-surface-elevated/70 border border-app-border rounded-xl space-x-1 overflow-x-auto ${className}`}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 min-w-max px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 select-none ${
              isActive
                ? 'bg-primary-blue text-white shadow-md font-semibold'
                : 'text-secondary-text hover:text-primary-text hover:bg-surface/50'
            }`}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface text-secondary-text'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
