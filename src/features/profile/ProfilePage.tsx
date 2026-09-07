import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Award, 
  Gauge, 
  AlertTriangle, 
  Calendar, 
  Flame, 
  Clock, 
  Car, 
  CheckCircle2,
  FileText,
  TrendingUp,
  Fuel,
  Edit2
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

interface ProfilePageProps {
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { driver, user, updateDriverProfile, achievements, violations } = useGame();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedName, setEditedName] = useState(driver?.name || '');
  const [editedAvatar, setEditedAvatar] = useState(driver?.avatar || '🏎️');

  if (!driver) return null;

  const license = driver.license;
  const isSuspended = license.status === 'SUSPENDED';
  const isWarning = license.status === 'WARNING';

  const avatarOptions = ['🏎️', '⚡', '🌌', '🚗', '🔥', '🦅', '🎯', '🕶️', '🚀', '👑'];

  const handleSaveProfile = () => {
    updateDriverProfile({ name: editedName, avatar: editedAvatar });
    setIsEditModalOpen(false);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Driver Profile & License"
        subtitle="Simulated driver credentials, license endorsements, penalty points, and performance records"
        actions={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => {
              setEditedName(driver.name);
              setEditedAvatar(driver.avatar);
              setIsEditModalOpen(true);
            }}
          >
            Edit Profile
          </Button>
        }
      />

      {/* Top Grid: Visual Digital Driver License Card + Reputation Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Driver License Card (2 Cols) */}
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#131A26] via-[#111827] to-[#0A0E17] border border-[#2A374A] shadow-2xl overflow-hidden">
            {/* Background Hologram pattern */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-sky-400/5 rounded-full blur-2xl pointer-events-none" />

            {/* License Header */}
            <div className="flex items-center justify-between border-b border-app-border/80 pb-4 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold font-display text-lg shadow-glow-blue">
                  RD
                </div>
                <div>
                  <h3 className="font-display font-black tracking-wider text-base sm:text-lg text-primary-text">
                    METROPOLITAN DRIVER LICENSE
                  </h3>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-sky-400">
                    Department of Motor Vehicles & Simulation Bureau
                  </p>
                </div>
              </div>

              <Badge
                variant={isSuspended ? 'danger' : isWarning ? 'warning' : 'success'}
                dot
                size="md"
              >
                {license.status}
              </Badge>
            </div>

            {/* License Body Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center relative z-10">
              {/* Photo Avatar Box */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface-elevated/80 border border-app-border text-center">
                <div className="text-5xl sm:text-6xl mb-2">{driver.avatar}</div>
                <span className="text-xs font-mono font-bold text-primary-text">{driver.name}</span>
                <span className="text-[10px] font-mono text-muted-text mt-0.5">{driver.experienceLevel} Tier</span>
              </div>

              {/* License Details Key-Values */}
              <div className="sm:col-span-2 space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-background-secondary/60 border border-app-border">
                  <div>
                    <span className="text-[10px] text-muted-text uppercase block">License Number</span>
                    <span className="font-bold text-sky-400 text-sm">{license.licenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-text uppercase block">License Class</span>
                    <span className="font-bold text-primary-text">{license.licenseClass}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-text uppercase block">Issued Date</span>
                    <span className="text-secondary-text">{license.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-text uppercase block">Expires</span>
                    <span className="text-secondary-text">{license.expiryDate}</span>
                  </div>
                </div>

                {/* Penalty Points Meter */}
                <div className="p-3 rounded-xl bg-background-secondary/60 border border-app-border">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-text">Penalty Points (Max 12)</span>
                    <span className={`font-bold ${license.penaltyPoints > 6 ? 'text-danger' : 'text-primary-text'}`}>
                      {license.penaltyPoints} / 12 Points
                    </span>
                  </div>
                  <ProgressBar
                    value={license.penaltyPoints}
                    max={12}
                    color={license.penaltyPoints > 6 ? 'danger' : 'warning'}
                    showPercent={false}
                    size="sm"
                    segmented
                    segmentsCount={12}
                  />
                  <p className="text-[10px] text-muted-text mt-1.5">
                    {license.penaltyPoints === 0
                      ? '✓ Clean driving record. No active citations on record.'
                      : `⚠ ${license.penaltyPoints} points assessed. 12 points will trigger license suspension.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Career & Reputation Breakdown (1 Col) */}
        <Card variant="elevated" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-app-border mb-4">
              <h4 className="text-sm font-bold text-primary-text flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Career Progression</span>
              </h4>
              <Badge variant="blue" size="sm">{driver.careerLevel}</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-secondary-text">Level Experience</span>
                  <span className="text-sky-400 font-bold">{driver.xp} / {driver.nextLevelXp} XP</span>
                </div>
                <ProgressBar value={driver.xp} max={driver.nextLevelXp} color="accent" size="md" />
              </div>

              <div className="p-3.5 rounded-xl bg-surface-elevated border border-app-border text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-text">Driver Reputation:</span>
                  <span className="font-mono font-bold text-emerald-400">{driver.reputation}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Transmission Pref:</span>
                  <span className="font-mono font-bold text-primary-text">{driver.preferences.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Measurement:</span>
                  <span className="font-mono font-bold text-primary-text">{driver.preferences.units.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => onNavigate('/career')}
          >
            View Career Ladder →
          </Button>
        </Card>
      </div>

      {/* Driver Lifetime Telemetry Statistics Matrix */}
      <div>
        <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-sky-400" />
          <span>Lifetime Driving Telemetry & Safe Scorecard</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Safe Driving Score"
            value={driver.stats.safeDrivingScore}
            unit="/ 100"
            subtext="Calculated from traffic compliance"
            icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          />

          <StatCard
            title="Total Distance Driven"
            value={driver.stats.totalDistanceKm}
            unit="km"
            subtext="Accumulated on all routes"
            icon={<Gauge className="w-5 h-5 text-sky-400" />}
          />

          <StatCard
            title="Jobs Completed"
            value={driver.stats.jobsCompleted}
            subtext="Taxi, Delivery & Freight"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          />

          <StatCard
            title="Driving Hours"
            value={driver.stats.drivingHours}
            unit="hrs"
            subtext="Time logged behind wheel"
            icon={<Clock className="w-5 h-5 text-purple-400" />}
          />

          <StatCard
            title="Traffic Violations"
            value={driver.stats.trafficViolationsCount}
            subtext={`${violations.length} total citations recorded`}
            icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          />

          <StatCard
            title="Accidents Recorded"
            value={driver.stats.accidentsCount}
            subtext="Zero collisions maintained"
            icon={<Car className="w-5 h-5 text-amber-400" />}
          />

          <StatCard
            title="Top Speed Achieved"
            value={driver.stats.topSpeedAchievedKmH}
            unit="km/h"
            subtext="Recorded telemetry peak"
            icon={<Flame className="w-5 h-5 text-red-400" />}
          />

          <StatCard
            title="Avg Fuel Efficiency"
            value={driver.stats.fuelEfficiencyKmPerL}
            unit="km/L"
            subtext="Economy driving metric"
            icon={<Fuel className="w-5 h-5 text-teal-400" />}
          />
        </div>
      </div>

      {/* Driver Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Driver Profile"
        subtitle="Update your in-simulation driver identity and avatar"
      >
        <div className="space-y-5">
          <Input
            label="Driver Name"
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
              Select Avatar
            </label>
            <div className="grid grid-cols-5 gap-2">
              {avatarOptions.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setEditedAvatar(emoji)}
                  className={`h-12 rounded-xl text-2xl flex items-center justify-center border transition-all ${
                    editedAvatar === emoji
                      ? 'bg-blue-950 border-sky-400 shadow-glow-blue'
                      : 'bg-surface border-app-border'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-app-border">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" glow onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
