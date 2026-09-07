import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  ShieldCheck, 
  Gauge, 
  Briefcase, 
  Flame, 
  Crown,
  Search
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { INITIAL_LEADERBOARD } from '../../data/mockData';

interface LeaderboardPageProps {
  onNavigate: (path: string) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onNavigate }) => {
  const { driver } = useGame();
  const [activeCategory, setActiveCategory] = useState<'reputation' | 'distance' | 'jobs' | 'safety'>('reputation');

  const categories = [
    { id: 'reputation', label: 'Reputation Rank' },
    { id: 'distance', label: 'Distance Driven (KM)' },
    { id: 'jobs', label: 'Completed Contracts' },
    { id: 'safety', label: 'Safe Driving Index' },
  ];

  // Dynamic ranking based on category
  const sortedPlayers = [...INITIAL_LEADERBOARD].map(p => {
    if (p.isCurrentPlayer && driver) {
      return {
        ...p,
        playerName: `${driver.name} (You)`,
        avatar: driver.avatar,
        careerLevel: driver.careerLevel,
        reputation: driver.reputation,
        totalDistanceKm: driver.stats.totalDistanceKm,
        jobsCompleted: driver.stats.jobsCompleted,
        safeDrivingScore: driver.stats.safeDrivingScore,
      };
    }
    return p;
  }).sort((a, b) => {
    if (activeCategory === 'reputation') return b.reputation - a.reputation;
    if (activeCategory === 'distance') return b.totalDistanceKm - a.totalDistanceKm;
    if (activeCategory === 'jobs') return b.jobsCompleted - a.jobsCompleted;
    return b.safeDrivingScore - a.safeDrivingScore;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return <span className="font-mono font-bold text-sm text-secondary-text">#{rank}</span>;
  };

  return (
    <PageContainer>
      <PageHeader
        title="Global Driver Leaderboards"
        subtitle="Regional driver performance rankings across reputation, safe compliance scores, and lifetime distance"
      />

      <Tabs
        tabs={categories}
        activeTab={activeCategory}
        onChange={(c) => setActiveCategory(c as any)}
      />

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {sortedPlayers.slice(0, 3).map((player, idx) => (
          <Card
            key={player.id}
            variant={idx === 0 ? 'glow-accent' : 'default'}
            className="text-center p-6 flex flex-col items-center justify-between"
          >
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-surface-elevated border-2 border-app-border flex items-center justify-center text-3xl mx-auto shadow-xl">
                {player.avatar}
              </div>
              <div className="flex items-center justify-center gap-1.5">
                {getRankBadge(idx + 1)}
                <h4 className="font-bold text-base text-primary-text">{player.playerName}</h4>
              </div>
              <Badge variant="blue" size="sm">{player.careerLevel}</Badge>
            </div>

            <div className="mt-4 pt-3 border-t border-app-border w-full font-mono text-xs space-y-1">
              <div className="flex justify-between text-secondary-text">
                <span>Reputation:</span>
                <strong className="text-sky-400">{player.reputation} / 100</strong>
              </div>
              <div className="flex justify-between text-secondary-text">
                <span>Distance:</span>
                <strong className="text-primary-text">{player.totalDistanceKm} km</strong>
              </div>
              <div className="flex justify-between text-secondary-text">
                <span>Safe Score:</span>
                <strong className="text-emerald-400">{player.safeDrivingScore}%</strong>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <Card variant="default">
        <h3 className="text-sm font-bold text-primary-text mb-4">Complete Regional Rankings</h3>

        <div className="divide-y divide-app-border/60">
          {sortedPlayers.map((player, idx) => {
            const isYou = player.isCurrentPlayer;

            return (
              <div
                key={player.id}
                className={`py-3.5 px-4 rounded-xl flex items-center justify-between gap-4 transition-all ${
                  isYou ? 'bg-blue-950/50 border border-blue-600/60 shadow-glow-blue' : 'hover:bg-surface-elevated'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 flex items-center justify-center">
                    {getRankBadge(idx + 1)}
                  </div>
                  <span className="text-2xl">{player.avatar}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm truncate ${isYou ? 'text-sky-300 font-extrabold' : 'text-primary-text'}`}>
                        {player.playerName}
                      </span>
                      {isYou && <Badge variant="accent" size="sm">YOU</Badge>}
                    </div>
                    <span className="text-xs font-mono text-muted-text">{player.careerLevel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs">
                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] text-muted-text uppercase block">Safe Score</span>
                    <span className="text-emerald-400 font-bold">{player.safeDrivingScore}%</span>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="text-[10px] text-muted-text uppercase block">Jobs</span>
                    <span className="text-primary-text font-bold">{player.jobsCompleted}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-text uppercase block">Distance</span>
                    <span className="text-sky-400 font-bold text-sm">{player.totalDistanceKm} km</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </PageContainer>
  );
};
