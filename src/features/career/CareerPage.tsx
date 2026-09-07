import React from 'react';
import { 
  Flame, 
  Award, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Briefcase, 
  Car, 
  DollarSign, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { CareerLevel } from '../../types';

interface CareerPageProps {
  onNavigate: (path: string) => void;
}

export const CareerPage: React.FC<CareerPageProps> = ({ onNavigate }) => {
  const { driver } = useGame();

  if (!driver) return null;

  const careerRanks: Array<{
    level: CareerLevel;
    title: string;
    xpRequired: number;
    description: string;
    unlocks: string[];
  }> = [
    {
      level: 'LEARNER',
      title: 'Learner Driver',
      xpRequired: 0,
      description: 'Initial certification. Standard city commuting, low-risk local taxi runs.',
      unlocks: ['Standard City Taxi Runs', 'Class L License', 'Starter Garage Bay'],
    },
    {
      level: 'NEW DRIVER',
      title: 'New Commercial Operator',
      xpRequired: 500,
      description: 'Proven basic compliance. Unlocks regional parcel and express medical courier routes.',
      unlocks: ['Express Parcel Delivery', 'Class C License', 'Stage 2 Performance Tuning'],
    },
    {
      level: 'PROFESSIONAL',
      title: 'Professional Chauffeur & Transit',
      xpRequired: 1500,
      description: 'Experienced pilot. Certified to operate high-capacity passenger transit buses and VIP executive transfers.',
      unlocks: ['Scheduled Bus Lines', 'Airport VIP Escorts', 'Class PRO Commercial License', 'Stage 3 Tuning'],
    },
    {
      level: 'EXPERT',
      title: 'Emergency First-Responder Specialist',
      xpRequired: 3500,
      description: 'High-speed precision under extreme rush-hour traffic. Urgent trauma hospital escort runs.',
      unlocks: ['Hospital Emergency Dispatch', 'Sirens Privilege', 'Stage 4 Tuning', 'Track Time Attacks'],
    },
    {
      level: 'MASTER DRIVER',
      title: 'Master Grand Prix & Fleet Commander',
      xpRequired: 8000,
      description: 'Peak automotive mastery. Access to legendary hypercars, highest payout contracts, and championship racing.',
      unlocks: ['Class R Master License', 'Championship Circuits', 'Stage 5 Master Engine Overhauls', 'All VIP Contracts'],
    },
  ];

  const currentRankIndex = careerRanks.findIndex(r => r.level === driver.careerLevel);

  return (
    <PageContainer>
      <PageHeader
        title="Driver Career Ladder & Endorsements"
        subtitle="Progress through official simulation tiers to unlock commercial transit lines, emergency response dispatch, and stage performance tuning"
      />

      {/* Current Rank Spotlight */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-surface to-surface border border-blue-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{driver.avatar}</span>
            <Badge variant="accent" size="sm" dot>CURRENT CAREER TIER</Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-primary-text">
            {driver.careerLevel}
          </h2>
          <p className="text-xs sm:text-sm text-secondary-text max-w-xl leading-relaxed">
            {careerRanks[currentRankIndex]?.description}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-elevated border border-app-border min-w-[240px] space-y-2 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-muted-text">XP to Next Rank:</span>
            <span className="font-bold text-sky-400">{driver.xp} / {driver.nextLevelXp} XP</span>
          </div>
          <ProgressBar value={driver.xp} max={driver.nextLevelXp} color="accent" size="md" />
          <p className="text-[10px] text-muted-text pt-1">
            Complete jobs, safe driving bonuses, and missions to gain Driver XP.
          </p>
        </div>
      </div>

      {/* Career Tiers Progression Roadmap */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-primary-text flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <span>Simulation Progression Ladder</span>
        </h3>

        <div className="space-y-4">
          {careerRanks.map((rank, idx) => {
            const isCompleted = idx < currentRankIndex;
            const isCurrent = idx === currentRankIndex;
            const isLocked = idx > currentRankIndex;

            return (
              <Card
                key={rank.level}
                variant={isCurrent ? 'glow-blue' : 'default'}
                className="p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl border flex items-center justify-center ${
                      isCurrent 
                        ? 'bg-blue-600 text-white border-blue-400 shadow-glow-blue'
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-surface-elevated text-slate-500 border-app-border'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isLocked ? <Lock className="w-6 h-6" /> : <Flame className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-primary-text">{rank.title}</h4>
                        <Badge
                          variant={isCurrent ? 'accent' : isCompleted ? 'success' : 'neutral'}
                          size="sm"
                        >
                          {isCurrent ? 'ACTIVE TIER' : isCompleted ? 'ACHIEVED' : `REQUIRES ${rank.xpRequired} XP`}
                        </Badge>
                      </div>
                      <p className="text-xs text-secondary-text mt-1 leading-relaxed max-w-2xl">
                        {rank.description}
                      </p>

                      {/* Unlocks List */}
                      <div className="flex items-center gap-2 flex-wrap mt-3 pt-2 border-t border-app-border/60">
                        <span className="text-[10px] font-mono uppercase text-muted-text font-bold">Unlocks:</span>
                        {rank.unlocks.map((u, uIdx) => (
                          <span
                            key={uIdx}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                              isLocked 
                                ? 'bg-surface text-muted-text border-app-border' 
                                : 'bg-blue-950/60 text-sky-300 border-blue-800/60'
                            }`}
                          >
                            ✓ {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <Button variant="primary" size="sm" glow onClick={() => onNavigate('/jobs')}>
                      Earn XP in Jobs
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};
