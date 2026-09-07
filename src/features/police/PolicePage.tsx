import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Camera, 
  ShieldCheck,
  Scale,
  ArrowRight,
  Flame
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

interface PolicePageProps {
  onNavigate: (path: string) => void;
}

export const PolicePage: React.FC<PolicePageProps> = ({ onNavigate }) => {
  const { violations, payViolation, consequences, driver, wallet } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const unpaidViolations = violations.filter(v => !v.isPaid);
  const paidViolations = violations.filter(v => v.isPaid);

  const handlePay = (id: string, ticketNum: string) => {
    payViolation(id);
    setFeedback(`Citation #${ticketNum} paid and settled in full.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Traffic Enforcement & Consequence System"
        subtitle="Review official traffic camera citations, pay outstanding fines, and observe the live consequence chain"
      />

      {feedback && (
        <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-600 text-sky-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <span>✓ {feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-white">✕</button>
        </div>
      )}

      {/* Driver License Points Warning Bar */}
      <div className="p-5 rounded-2xl bg-surface border border-app-border grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-text">DRIVER RECORD STATUS</span>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="text-lg font-bold text-primary-text">{driver?.name}</h3>
            <Badge
              variant={driver?.license.status === 'SUSPENDED' ? 'danger' : driver?.license.status === 'WARNING' ? 'warning' : 'success'}
              size="sm"
              dot
            >
              {driver?.license.status}
            </Badge>
          </div>
          <p className="text-xs text-secondary-text font-mono mt-0.5">
            License #{driver?.license.licenseNumber} • Class: {driver?.license.licenseClass}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-muted-text">Assessed Penalty Points:</span>
            <span className="font-bold text-danger">{driver?.license.penaltyPoints || 0} / 12 Points</span>
          </div>
          <ProgressBar
            value={driver?.license.penaltyPoints || 0}
            max={12}
            color={(driver?.license.penaltyPoints || 0) > 6 ? 'danger' : 'warning'}
            showPercent={false}
            size="sm"
            segmented
            segmentsCount={12}
          />
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-text font-mono">Unsettled Fines Total</p>
          <p className="text-2xl font-bold font-mono text-danger">
            ₹{unpaidViolations.reduce((acc, v) => acc + v.fineAmount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* RealDrive Consequence Engine Interactive Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Negative Consequence Chain */}
        <Card variant="default" className="border-l-4 border-l-danger">
          <h4 className="text-sm font-bold text-danger flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4" />
            <span>Traffic Violation Consequence Chain</span>
          </h4>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 flex items-center justify-between">
              <span className="text-red-300 font-bold">1. Speeding / Red Light Offense</span>
              <Badge variant="danger" size="sm">INFRACTION</Badge>
            </div>
            <div className="flex justify-center text-secondary-text text-xs font-bold">↓</div>
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 flex items-center justify-between">
              <span className="text-amber-300 font-bold">2. Fine Issued + Penalty Points</span>
              <span className="text-danger font-bold">-₹250 / +2 Points</span>
            </div>
            <div className="flex justify-center text-secondary-text text-xs font-bold">↓</div>
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-900/60 flex items-center justify-between">
              <span className="text-purple-300 font-bold">3. Reputation & VIP Contract Lock</span>
              <span className="text-purple-400 font-bold">-4 Rep Points</span>
            </div>
            <div className="flex justify-center text-secondary-text text-xs font-bold">↓</div>
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 flex items-center justify-between">
              <span className="text-sky-300 font-bold">4. Elevated Insurance Risk Multiplier</span>
              <span className="text-sky-400 font-bold">+5% Monthly</span>
            </div>
          </div>
        </Card>

        {/* Positive Safe Driver Bonus Chain */}
        <Card variant="default" className="border-l-4 border-l-emerald-500">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" />
            <span>Safe Driving Reward Chain</span>
          </h4>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between">
              <span className="text-emerald-300 font-bold">1. Clean Trips & Zero Collisions</span>
              <Badge variant="success" size="sm">COMPLIANCE</Badge>
            </div>
            <div className="flex justify-center text-secondary-text text-xs font-bold">↓</div>
            <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-900/60 flex items-center justify-between">
              <span className="text-sky-300 font-bold">2. +15% Safe Driver Contract Bonus</span>
              <span className="text-emerald-400 font-bold">+₹ Cash Payout</span>
            </div>
            <div className="flex justify-center text-secondary-text text-xs font-bold">↓</div>
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 flex items-center justify-between">
              <span className="text-amber-300 font-bold">3. Unlock Executive VIP Contracts</span>
              <span className="text-amber-400 font-bold">High Tier Jobs</span>
            </div>
            <div className="flex justify-center text-secondary-text text-xs font-bold">↓</div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-center justify-between">
              <span className="text-emerald-300 font-bold">4. Discounted Insurance & Upgrades</span>
              <span className="text-emerald-400 font-bold">-10% Premium</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Citations Log Table */}
      <Card variant="default">
        <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-sky-400" />
          <span>Automated Traffic Camera Citations Log</span>
        </h3>

        <div className="divide-y divide-app-border/60">
          {violations.map(vio => (
            <div key={vio.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl ${vio.isPaid ? 'bg-surface-elevated text-secondary-text' : 'bg-red-950 text-danger'}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-primary-text text-sm">{vio.violationType} Offense</h4>
                    <Badge variant={vio.isPaid ? 'success' : 'danger'} size="sm">
                      {vio.isPaid ? 'SETTLED' : 'UNPAID'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-text font-mono mt-0.5">
                    Ticket: <strong>{vio.ticketNumber}</strong> • {vio.date} • {vio.location}
                  </p>
                  {vio.detectedSpeedKmh && (
                    <p className="text-[11px] text-danger font-mono mt-0.5">
                      Recorded Speed: {vio.detectedSpeedKmh} km/h (Limit: {vio.speedLimitKmh} km/h)
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono text-xs">
                  <span className="font-bold text-danger block text-sm">₹{vio.fineAmount}</span>
                  <span className="text-muted-text">+{vio.penaltyPoints} Pts</span>
                </div>

                {!vio.isPaid && (
                  <Button
                    variant="danger"
                    size="sm"
                    glow
                    onClick={() => handlePay(vio.id, vio.ticketNumber)}
                  >
                    Pay Fine (₹{vio.fineAmount})
                  </Button>
                )}
              </div>
            </div>
          ))}

          {violations.length === 0 && (
            <div className="py-8 text-center text-xs font-mono text-emerald-400">
              ✓ Clean traffic record. No citations on file.
            </div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};
