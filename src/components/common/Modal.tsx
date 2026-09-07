import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { audioService } from '../../services/audioService';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={() => {
          audioService.playClick();
          onClose();
        }}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl overflow-hidden z-10 animate-scaleUp`}
        onClick={e => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-app-border bg-background-secondary/40">
            <div>
              {title && <h3 className="text-lg font-bold text-primary-text">{title}</h3>}
              {subtitle && <p className="text-xs text-secondary-text mt-0.5">{subtitle}</p>}
            </div>
            {showCloseButton && (
              <button
                onClick={() => {
                  audioService.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-surface-elevated transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
