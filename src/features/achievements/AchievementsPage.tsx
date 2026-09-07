import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Key, 
  ShieldCheck, 
  Milestone, 
  Car, 
  Wrench, 
  Flame,
  Sparkles
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Tabs } from '../../components/common/Tabs';

interface AchievementsPageProps {
  onNavigate: (path: string) => void;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ onNavigate }) => {
  const { achievements } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Badges', count: achievements.length },
    { id: 'DRIVING', label: 'Driving Mastery', count: achievements.filter(a => a.category === 'DRIVING').length },
    { id: 'CAREER', label: 'Career Operations', count: achievements.filter(a => a.category === 'CAREER').length },
    { id: 'COLLECTION', label: 'Garage Collection', count: achievements.filter(a => a.category === 'COLLECTION').length },
    { id: 'CHALLENGE', label: 'Speed & Skill', count: achievements.filter(a => a.category === 'CHALLENGE').length },
  ];

  const filteredAchievements = achievements.filter(a => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Key': return <Key className="w-5 h-5 text-sky-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Milestone': return <Milestone className="w-5 h-5 text-blue-400" />;
      case 'Car': return <Car className="w-5 h-5 text-amber-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-purple-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-danger" />;
      default: return <Award className="w-5 h-5 text-sky-400" />;
    }
  };

  const unlockedCount = achievements.filter(a => a.state === 'UNLOCKED').length;

  return (
    <PageContainer>
      <PageHeader
        title="Driver Hall of Fame & Achievements"
        subtitle="Earn commemorative badges and simulation credits across driving distance, clean compliance, and speed records"
      />

      {/* Completion Metric Overview */}
      <div className="p-5 rounded-2xl bg-surface border border-app-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-950 text-sky-400 border border-blue-800">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-text">ACHIEVEMENT COMPLETION</span>
            <h3 className="text-xl font-bold text-primary-text">{unlockedCount} of {achievements.length} Badges Unlocked</h3>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <ProgressBar
            value={unlockedCount}
            max={achievements.length}
            color="accent"
            size="md"
          />
        </div>
      </div>

      <Tabs
        tabs={categories}
        activeTab={selectedCategory}
        onChange={setSelectedCategory}
      />

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map(ach => {
          const isUnlocked = ach.state === 'UNLOCKED';
          const isLocked = ach.state === 'LOCKED';

          return (
            <Card
              key={ach.id}
              variant={isUnlocked ? 'glow-blue' : 'default'}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${
                      isUnlocked 
                        ? 'bg-blue-950 border-sky-400 shadow-glow-blue' 
                        : 'bg-surface-elevated border-app-border text-slate-500'
                    }`}>
                      {getIcon(ach.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-muted-text uppercase">{ach.category}</span>
                      <h4 className="font-bold text-base text-primary-text">{ach.title}</h4>
                    </div>
                  </div>

                  <Badge variant={isUnlocked ? 'success' : isLocked ? 'neutral' : 'warning'} size="sm">
                    {ach.state}
                  </Badge>
                </div>

                <p className="text-xs text-secondary-text leading-relaxed mb-4">
                  {ach.description}
                </p>

                {/* Progress bar */}
                <div className="p-3 rounded-xl bg-background-secondary border border-app-border mb-4 text-xs font-mono">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-muted-text">Progress:</span>
                    <span className="text-primary-text font-bold">{ach.progress} / {ach.maxProgress}</span>
                  </div>
                  <ProgressBar
                    value={ach.progress}
                    max={ach.maxProgress}
                    color={isUnlocked ? 'success' : 'accent'}
                    showPercent={false}
                    size="sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-app-border text-xs font-mono">
                <span className="text-emerald-400 font-bold">+₹{ach.cashReward.toLocaleString()}</span>
                <span className="text-sky-400 font-bold">+{ach.xpReward} XP</span>
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
};
