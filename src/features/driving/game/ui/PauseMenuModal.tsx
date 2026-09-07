import React from 'react';
import { Play, RotateCcw, Map, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import { Card } from '../../../../components/common/Card';

interface PauseMenuModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onNavigate: (path: string) => void;
}

export const PauseMenuModal: React.FC<PauseMenuModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0F172A] border border-white/15 shadow-2xl space-y-6 text-center">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400">
            SIMULATION PAUSED
          </span>
          <h2 className="text-2xl font-black font-display text-white mt-1">
            REAL<span className="text-blue-500">DRIVE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Press ESC or Resume to continue driving
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            glow
            className="w-full"
            leftIcon={<Play className="w-5 h-5 fill-current" />}
            onClick={onResume}
          >
            Resume Drive
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="w-full"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onRestart}
          >
            Restart Route
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full"
            leftIcon={<Map className="w-4 h-4" />}
            onClick={() => onNavigate('/map')}
          >
            World Map
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full"
            leftIcon={<Settings className="w-4 h-4" />}
            onClick={() => onNavigate('/settings')}
          >
            Settings & Assists
          </Button>

          <Button
            variant="danger"
            size="md"
            className="w-full"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={() => onNavigate('/dashboard')}
          >
            Exit to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
