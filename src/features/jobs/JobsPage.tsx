import React, { useState } from 'react';
import { 
  Briefcase, 
  Car, 
  Clock, 
  MapPin, 
  DollarSign, 
  Award, 
  Check, 
  Play, 
  Flame, 
  ShieldAlert, 
  Users, 
  Package, 
  Bus, 
  Zap,
  ChevronRight,
  XCircle
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { Job, JobCategory } from '../../types';

interface JobsPageProps {
  onNavigate: (path: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ onNavigate }) => {
  const { jobs, activeJob, acceptJob, cancelJob, driver, selectedVehicle } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Jobs', count: jobs.length },
    { id: 'TAXI', label: 'Taxi & VIP Rides', count: jobs.filter(j => j.category === 'TAXI').length },
    { id: 'DELIVERY', label: 'Express Delivery', count: jobs.filter(j => j.category === 'DELIVERY').length },
    { id: 'BUS', label: 'Transit Bus Lines', count: jobs.filter(j => j.category === 'BUS').length },
    { id: 'EMERGENCY', label: 'Emergency Response', count: jobs.filter(j => j.category === 'EMERGENCY').length },
  ];

  const filteredJobs = jobs.filter(job => {
    if (selectedCategory === 'ALL') return true;
    return job.category === selectedCategory;
  });

  const getDifficultyColor = (diff: Job['difficulty']) => {
    switch (diff) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'danger';
      case 'Extreme': return 'purple';
    }
  };

  const getCategoryIcon = (cat: JobCategory) => {
    switch (cat) {
      case 'TAXI': return <Users className="w-5 h-5 text-sky-400" />;
      case 'DELIVERY': return <Package className="w-5 h-5 text-amber-400" />;
      case 'BUS': return <Bus className="w-5 h-5 text-emerald-400" />;
      case 'EMERGENCY': return <ShieldAlert className="w-5 h-5 text-danger animate-pulse" />;
      default: return <Briefcase className="w-5 h-5 text-primary-blue" />;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Metropolitan Dispatch & Job Board"
        subtitle="Accept commercial passenger transit, express courier manifests, and high-priority emergency transport runs"
        actions={
          activeJob && (
            <Button
              variant="primary"
              size="sm"
              glow
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => onNavigate('/drive/game')}
            >
              Resume Active Run
            </Button>
          )
        }
      />

      {/* Active Contract Alert Banner */}
      {activeJob && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-blue-950/70 border border-blue-600/50 shadow-glow-blue animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white animate-pulse">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-sky-400">ACTIVE CONTRACT</span>
                <Badge variant="accent" size="sm" dot>DISPATCHED</Badge>
              </div>
              <h4 className="font-bold text-primary-text text-base">{activeJob.title}</h4>
              <p className="text-xs text-secondary-text font-mono">
                {activeJob.pickup} ➔ {activeJob.destination} ({activeJob.distanceKm} km)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<XCircle className="w-4 h-4" />}
              onClick={() => cancelJob(activeJob.id)}
            >
              Abandon Contract
            </Button>
            <Button
              variant="primary"
              size="sm"
              glow
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => onNavigate('/drive/game')}
            >
              Drive Session
            </Button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs
        tabs={categories}
        activeTab={selectedCategory}
        onChange={setSelectedCategory}
      />

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => {
          const isCurrentActive = activeJob?.id === job.id;

          return (
            <Card
              key={job.id}
              variant={isCurrentActive ? 'glow-blue' : 'default'}
              className="flex flex-col justify-between group hover:border-blue-500/50 transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-surface-elevated border border-app-border">
                      {getCategoryIcon(job.category)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-muted-text uppercase">{job.category} CONTRACT</span>
                      <h4 className="font-bold text-base text-primary-text group-hover:text-sky-300 transition-colors">
                        {job.title}
                      </h4>
                    </div>
                  </div>

                  <Badge variant={getDifficultyColor(job.difficulty)} size="sm">
                    {job.difficulty}
                  </Badge>
                </div>

                <p className="text-xs text-secondary-text leading-relaxed mb-4">
                  {job.description}
                </p>

                {/* Pickup and Destination Route */}
                <div className="p-3 rounded-xl bg-background-secondary/80 border border-app-border space-y-2 mb-4 text-xs font-mono">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-muted-text block uppercase">Pickup</span>
                      <span className="text-primary-text font-bold truncate block">{job.pickup}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1 border-t border-app-border/60">
                    <MapPin className="w-3.5 h-3.5 text-danger flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-muted-text block uppercase">Destination</span>
                      <span className="text-primary-text font-bold truncate block">{job.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Bus Stops if Bus route */}
                {job.busStops && job.busStops.length > 0 && (
                  <div className="p-3 rounded-xl bg-surface-elevated/60 border border-app-border mb-4">
                    <p className="text-[10px] font-mono uppercase font-bold text-muted-text mb-1">
                      Scheduled Stops ({job.busStops.length})
                    </p>
                    <div className="space-y-1 text-[11px] font-mono text-secondary-text">
                      {job.busStops.map((stop, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5 truncate">
                          <span className="text-sky-400 font-bold">{sIdx + 1}.</span>
                          <span className="truncate">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4">
                  <div className="p-2 rounded-lg bg-surface-elevated border border-app-border">
                    <span className="text-[10px] text-muted-text block">DISTANCE</span>
                    <span className="font-bold text-primary-text">{job.distanceKm} km</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-elevated border border-app-border">
                    <span className="text-[10px] text-muted-text block">TIME LIMIT</span>
                    <span className="font-bold text-amber-400">{job.timeLimitMin} min</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-elevated border border-app-border">
                    <span className="text-[10px] text-muted-text block">REWARD</span>
                    <span className="font-bold text-emerald-400">₹{job.reward}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isCurrentActive ? (
                  <Button
                    variant="accent"
                    size="md"
                    glow
                    className="w-full"
                    leftIcon={<Play className="w-4 h-4 fill-current" />}
                    onClick={() => onNavigate('/drive/game')}
                  >
                    Drive to Destination
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      acceptJob(job.id);
                      onNavigate('/drive/game');
                    }}
                  >
                    Accept Contract (₹{job.reward})
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
