import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Car, 
  Briefcase, 
  Wallet, 
  Activity, 
  Server, 
  Database, 
  FileText,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { Input } from '../../components/common/Input';
import { INITIAL_LEADERBOARD } from '../../data/mockData';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { vehicles, jobs, transactions, violations, wallet, user } = useGame();
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'vehicles' | 'violations' | 'economy'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PageContainer>
      <PageHeader
        title="Administrative Simulation Console"
        subtitle="Centralized management portal for demo players, fleet database, economic circulation, and violation oversight"
        actions={
          <Badge variant="purple" size="md" dot>
            SUPER-ADMIN ACTIVE
          </Badge>
        }
      />

      {/* Admin System Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Demo Players"
          value={INITIAL_LEADERBOARD.length}
          subtext="Simulated accounts registered"
          icon={<Users className="w-5 h-5 text-purple-400" />}
          highlight
        />

        <StatCard
          title="Registered Vehicle Fleet"
          value={vehicles.length}
          subtext={`${vehicles.filter(v => v.isOwned).length} user-owned in garages`}
          icon={<Car className="w-5 h-5 text-sky-400" />}
        />

        <StatCard
          title="Total Currency in Circulation"
          value={`₹${(wallet.totalEarnings + 45000).toLocaleString()}`}
          subtext="Simulated economy ledger balance"
          icon={<Wallet className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          title="Total Traffic Citations"
          value={violations.length + 12}
          subtext="Automated radar captures"
          icon={<ShieldAlert className="w-5 h-5 text-danger" />}
        />
      </div>

      <Tabs
        tabs={[
          { id: 'overview', label: 'System Overview' },
          { id: 'players', label: 'Registered Players' },
          { id: 'vehicles', label: 'Vehicle Fleet' },
          { id: 'violations', label: 'Violations & Fines' },
          { id: 'economy', label: 'Financial Audit' },
        ]}
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as any)}
      />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="default">
            <h4 className="text-sm font-bold text-primary-text mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              <span>Simulation Server Node Health</span>
            </h4>
            <div className="space-y-3 font-mono text-xs text-secondary-text">
              <div className="flex justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span>Core Engine:</span>
                <strong className="text-emerald-400">REACT 18 / VITE SIMULATOR 1.0 (ONLINE)</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span>Web Audio Synthesizer:</span>
                <strong className="text-emerald-400">POLYPHONIC ENGINE READY</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span>Persistence Service:</span>
                <strong className="text-sky-400">LOCALSTORAGE PERSISTENT STORE</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span>Client Memory Footprint:</span>
                <strong className="text-primary-text">&lt; 35 MB</strong>
              </div>
            </div>
          </Card>

          <Card variant="default">
            <h4 className="text-sm font-bold text-primary-text mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>Mock Data Architecture Status</span>
            </h4>
            <div className="space-y-3 font-mono text-xs text-secondary-text">
              <div className="flex justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span>Vehicles In Memory:</span>
                <strong className="text-primary-text">{vehicles.length} Models</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span>Dispatched Contracts:</span>
                <strong className="text-primary-text">{jobs.length} Active</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span>Backend Interface Readiness:</span>
                <strong className="text-emerald-400">100% MODULAR SERVICE MAPPED</strong>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-surface-elevated">
                <span>Simulated Latency:</span>
                <strong className="text-primary-text">0 ms (Client Synchronous)</strong>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: PLAYERS */}
      {activeTab === 'players' && (
        <Card variant="default">
          <h4 className="text-sm font-bold text-primary-text mb-4">Simulated Registered Players</h4>
          <div className="divide-y divide-app-border/60 font-mono text-xs">
            {INITIAL_LEADERBOARD.map(p => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.avatar}</span>
                  <div>
                    <span className="font-bold text-primary-text">{p.playerName}</span>
                    <p className="text-[11px] text-muted-text">{p.careerLevel} • Rep: {p.reputation}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sky-400">{p.totalDistanceKm} km driven</span>
                  <p className="text-[11px] text-emerald-400">{p.safeDrivingScore}% Safe Index</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: VEHICLES */}
      {activeTab === 'vehicles' && (
        <Card variant="default">
          <h4 className="text-sm font-bold text-primary-text mb-4">Global Fleet Database</h4>
          <div className="divide-y divide-app-border/60 font-mono text-xs">
            {vehicles.map(v => (
              <div key={v.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-primary-text">{v.brand} {v.name}</span>
                  <p className="text-[11px] text-muted-text">{v.category} • {v.powerHp} HP • {v.topSpeedKmH} km/h</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400">₹{v.price.toLocaleString()}</span>
                  <p className="text-[11px] text-muted-text">{v.isOwned ? 'OWNED' : 'IN SHOWROOM'}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: VIOLATIONS */}
      {activeTab === 'violations' && (
        <Card variant="default">
          <h4 className="text-sm font-bold text-primary-text mb-4">Radar & Traffic Enforcement Log</h4>
          <div className="divide-y divide-app-border/60 font-mono text-xs">
            {violations.map(v => (
              <div key={v.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-danger">{v.violationType} Infraction</span>
                  <p className="text-[11px] text-muted-text">Ticket #{v.ticketNumber} • {v.date} • {v.location}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary-text">₹{v.fineAmount} (+{v.penaltyPoints} Pts)</span>
                  <p className="text-[11px] text-muted-text">{v.isPaid ? 'PAID' : 'PENDING'}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 5: ECONOMY */}
      {activeTab === 'economy' && (
        <Card variant="default">
          <h4 className="text-sm font-bold text-primary-text mb-4">Global Ledger Audit Log</h4>
          <div className="divide-y divide-app-border/60 font-mono text-xs">
            {transactions.map(t => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-primary-text">{t.description}</span>
                  <p className="text-[11px] text-muted-text">{t.receiptId} • {t.date}</p>
                </div>
                <span className={`font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-danger'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageContainer>
  );
};
