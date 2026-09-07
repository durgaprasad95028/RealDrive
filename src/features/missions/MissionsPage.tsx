import React, { useState } from 'react';
import { 
  Target, 
  Award, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Flame, 
  Clock, 
  Compass, 
  Car, 
  DollarSign,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Tabs } from '../../components/common/Tabs';
import { Mission, MissionType } from '../../types';

interface MissionsPageProps {
  onNavigate: (path: string) => void;
}

export const MissionsPage: React.FC<MissionsPageProps> = ({ onNavigate }) => {
  const { missions, claimMission } = useGame();
  const [selectedTab, setSelectedTab] = useState<string>('ALL');

  const tabs = [
    { id: 'ALL', label: 'All Challenges', count: missions.length },
    { id: 'ACTIVE', label: 'Active', count: missions.filter(m => m.state === 'ACTIVE').length },
    { id: 'AVAILABLE', label: 'Available', count: missions.filter(m => m.state === 'AVAILABLE').length },
    { id: 'COMPLETED', label: 'Completed', count: missions.filter(m => m.state === 'COMPLETED').length },
  ];

  const filteredMissions = missions.filter(m => {
    if (selectedTab === 'ALL') return true;
    return m.state === selectedTab;
  });

  const handleClaim = (missionId: string) => {
    claimMission(missionId);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const getTypeIcon = (type: MissionType) => {
    switch (type) {
      case 'Driving': return <Compass className="w-5 h-5 text-sky-400" />;
      case 'Career': return <Award className="w-5 h-5 text-amber-400" />;
      case 'Vehicle': return <Car className="w-5 h-5 text-emerald-400" />;
      case 'Exploration': return <Target className="w-5 h-5 text-purple-400" />;
      case 'Challenge': return <Flame className="w-5 h-5 text-danger" />;
      default: return <Target className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Missions & Career Milestones"
        subtitle="Complete tactical challenges to unlock reputation bonuses, cash rewards, and specialized career advancements"
      />

      <Tabs
        tabs={tabs}
        activeTab={selectedTab}
        onChange={setSelectedTab}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMissions.map(mission => {
          const isComplete = mission.state === 'COMPLETED';
          const isLocked = mission.state === 'LOCKED';
          const canClaim = mission.progress >= mission.maxProgress && !isComplete;

          return (
            <Card
              key={mission.id}
              variant={isComplete ? 'default' : canClaim ? 'glow-accent' : 'default'}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-surface-elevated border border-app-border">
                      {getTypeIcon(mission.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-muted-text">{mission.type} MISSION</span>
                        <Badge
                          variant={isComplete ? 'success' : isLocked ? 'neutral' : 'blue'}
                          size="sm"
                        >
                          {mission.state}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-base text-primary-text">{mission.title}</h4>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-emerald-400 block">+₹{mission.rewardMoney.toLocaleString()}</span>
                    <span className="text-[10px] text-sky-400 font-bold block">+{mission.rewardXp} XP</span>
                  </div>
                </div>

                <p className="text-xs text-secondary-text leading-relaxed mb-4">
                  {mission.description}
                </p>

                {/* Objective details */}
                <div className="p-3 rounded-xl bg-background-secondary/80 border border-app-border mb-4 text-xs font-mono">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-muted-text uppercase text-[10px]">Objective:</span>
                    <span className="text-primary-text font-bold">{mission.progress} / {mission.maxProgress} {mission.unit}</span>
                  </div>
                  <ProgressBar
                    value={mission.progress}
                    max={mission.maxProgress}
                    color={isComplete ? 'success' : 'accent'}
                    showPercent={false}
                    size="sm"
                  />
                  {mission.unlockRequirement && isLocked && (
                    <p className="text-[10px] text-amber-400 mt-2 flex items-center gap-1 font-mono">
                      <Lock className="w-3 h-3" />
                      <span>Unlock: {mission.unlockRequirement}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                {isComplete ? (
                  <div className="py-2 text-center text-xs font-mono text-emerald-400 font-bold flex items-center justify-center gap-1.5 bg-emerald-950/40 rounded-xl border border-emerald-800/40">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CHALLENGE COMPLETED</span>
                  </div>
                ) : canClaim ? (
                  <Button
                    variant="accent"
                    size="md"
                    glow
                    className="w-full"
                    onClick={() => handleClaim(mission.id)}
                  >
                    Claim Reward (+₹{mission.rewardMoney.toLocaleString()})
                  </Button>
                ) : isLocked ? (
                  <Button variant="secondary" size="md" className="w-full" disabled>
                    Locked Challenge
                  </Button>
                ) : (
                  <Button variant="primary" size="md" className="w-full" onClick={() => onNavigate('/drive')}>
                    Track in Drive Hub
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
};
