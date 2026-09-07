import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  Award, 
  DollarSign, 
  Star, 
  ShieldCheck, 
  Clock, 
  Gauge, 
  Fuel, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';

interface MissionCompleteModalProps {
  isOpen: boolean;
  jobTitle: string;
  distanceKm: number;
  elapsedSeconds: number;
  safeScore: number;
  violationsCount: number;
  fuelUsedL: number;
  bodyDamagePct: number;
  passengerRating: number;
  cashReward: number;
  xpReward: number;
  onContinue: () => void;
  onNextJob: () => void;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  isOpen,
  jobTitle,
  distanceKm,
  elapsedSeconds,
  safeScore,
  violationsCount,
  fuelUsedL,
  bodyDamagePct,
  passengerRating,
  cashReward,
  xpReward,
  onContinue,
  onNextJob,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = Math.floor(elapsedSeconds % 60);
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0F172A] border border-blue-500/40 shadow-2xl space-y-6 text-center">
        {/* Victory Header */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-emerald-950 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.5)] animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-700 text-sky-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DESTINATION REACHED</span>
          </div>

          <h2 className="text-3xl font-black font-display text-white">
            MISSION COMPLETE
          </h2>
          <p className="text-sm font-bold text-sky-300 font-mono">{jobTitle}</p>
        </div>

        {/* Payout & XP Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-surface to-emerald-950/60 border border-emerald-800/80 flex items-center justify-around font-mono">
          <div>
            <span className="text-[10px] text-muted-text uppercase block">Cash Earned</span>
            <span className="text-2xl font-black text-emerald-400">
              +₹{cashReward.toLocaleString()}
            </span>
          </div>

          <div className="w-px h-8 bg-app-border" />

          <div>
            <span className="text-[10px] text-muted-text uppercase block">Driver XP</span>
            <span className="text-2xl font-black text-sky-400">
              +{xpReward} XP
            </span>
          </div>

          <div className="w-px h-8 bg-app-border" />

          <div>
            <span className="text-[10px] text-muted-text uppercase block">Rating</span>
            <span className="text-lg font-bold text-amber-400 flex items-center gap-1 justify-center">
              <Star className="w-4 h-4 fill-current" />
              <span>{passengerRating.toFixed(1)}</span>
            </span>
          </div>
        </div>

        {/* Telemetry Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono text-left">
          <div className="p-3 rounded-xl bg-background-secondary border border-app-border">
            <span className="text-muted-text text-[10px] block uppercase">Distance Driven</span>
            <span className="font-bold text-white text-sm">{distanceKm.toFixed(1)} km</span>
          </div>

          <div className="p-3 rounded-xl bg-background-secondary border border-app-border">
            <span className="text-muted-text text-[10px] block uppercase">Driving Time</span>
            <span className="font-bold text-white text-sm">{formattedTime}</span>
          </div>

          <div className="p-3 rounded-xl bg-background-secondary border border-app-border">
            <span className="text-muted-text text-[10px] block uppercase">Safe Compliance</span>
            <span className="font-bold text-emerald-400 text-sm">{safeScore}%</span>
          </div>

          <div className="p-3 rounded-xl bg-background-secondary border border-app-border">
            <span className="text-muted-text text-[10px] block uppercase">Traffic Violations</span>
            <span className={`font-bold text-sm ${violationsCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {violationsCount} infractions
            </span>
          </div>

          <div className="p-3 rounded-xl bg-background-secondary border border-app-border">
            <span className="text-muted-text text-[10px] block uppercase">Fuel Consumed</span>
            <span className="font-bold text-amber-400 text-sm">{fuelUsedL.toFixed(1)} L</span>
          </div>

          <div className="p-3 rounded-xl bg-background-secondary border border-app-border">
            <span className="text-muted-text text-[10px] block uppercase">Vehicle Wear</span>
            <span className="font-bold text-sky-400 text-sm">{bodyDamagePct}% wear</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={onContinue}
          >
            Dashboard
          </Button>

          <Button
            variant="primary"
            size="lg"
            glow
            className="flex-1"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={onNextJob}
          >
            Next Contract
          </Button>
        </div>
      </div>
    </div>
  );
};
