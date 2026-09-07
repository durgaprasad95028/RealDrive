import React from 'react';
import { AlertTriangle, Gauge, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col justify-center items-center p-6 text-center selection:bg-blue-600 selection:text-white">
      <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-800 text-danger flex items-center justify-center mb-4 shadow-glow-danger">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-400 mb-1">
        TELEMETRY ROUTE 404
      </span>

      <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-primary-text mb-3">
        SECTOR OUT OF BOUNDS
      </h1>

      <p className="text-sm text-secondary-text max-w-md mb-8 leading-relaxed">
        The road or simulation coordinate you are attempting to navigate to does not exist in the RealDrive metropolitan registry.
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => onNavigate('/dashboard')}
        >
          Return to Dashboard
        </Button>

        <Button
          variant="primary"
          size="md"
          glow
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => onNavigate('/')}
        >
          Landing Page
        </Button>
      </div>
    </div>
  );
};
