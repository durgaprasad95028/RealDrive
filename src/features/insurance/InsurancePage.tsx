import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Car, 
  Check, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  DollarSign,
  Sparkles
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { INITIAL_INSURANCE_PLANS } from '../../data/mockData';

interface InsurancePageProps {
  onNavigate: (path: string) => void;
}

export const InsurancePage: React.FC<InsurancePageProps> = ({ onNavigate }) => {
  const { selectedVehicle, policies, purchaseInsurance, wallet, driver } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!selectedVehicle) return null;

  const currentPolicy = policies.find(p => p.vehicleId === selectedVehicle.id);

  const handleBuyPlan = (planId: string, planName: string) => {
    purchaseInsurance(selectedVehicle.id, planId);
    setFeedback(`Activated ${planName} Insurance Coverage for ${selectedVehicle.name}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Automotive Insurance Underwriting"
        subtitle="Protect your vehicle fleet against repair liability, collision costs, and roadside breakdown expenses"
      />

      {feedback && (
        <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-600 text-sky-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <span>✓ {feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-white">✕</button>
        </div>
      )}

      {/* Active Policy Status Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-app-border">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-950 text-sky-400 border border-blue-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-text">VEHICLE POLICY</span>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-primary-text">{selectedVehicle.name}</h3>
              <Badge variant={currentPolicy ? 'success' : 'danger'} size="sm" dot>
                {currentPolicy ? `${currentPolicy.planName} Policy Active` : 'NO COVERAGE'}
              </Badge>
            </div>
            {currentPolicy && (
              <p className="text-xs text-muted-text font-mono mt-0.5">
                Coverage: <strong>{currentPolicy.coveragePct}%</strong> • Premium: <strong>₹{currentPolicy.monthlyPremium}/mo</strong> • Expires: <strong>{currentPolicy.expiryDate}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="text-right font-mono text-xs text-muted-text">
          <span>Driver Safe Score: </span>
          <strong className="text-sky-400">{driver?.stats.safeDrivingScore || 100} / 100</strong>
        </div>
      </div>

      {/* Insurance Plan Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_INSURANCE_PLANS.map(plan => {
          const isCurrentPlan = currentPolicy?.planId === plan.id;
          const isPremium = plan.name === 'Premium';

          return (
            <Card
              key={plan.id}
              variant={isCurrentPlan ? 'glow-blue' : isPremium ? 'glow-accent' : 'default'}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-muted-text">POLICY TIER</span>
                    <h4 className="text-xl font-bold text-primary-text">{plan.name} Plan</h4>
                  </div>
                  <Badge variant={isCurrentPlan ? 'success' : 'blue'} size="sm">
                    {plan.coveragePct}% COVERAGE
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-background-secondary border border-app-border mb-4 font-mono">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-400">₹{plan.monthlyPremium}</span>
                    <span className="text-xs text-muted-text">/ month</span>
                  </div>
                  <p className="text-[11px] text-secondary-text mt-0.5">
                    Deductible: <strong>₹{plan.deductible}</strong> per incident
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 text-xs text-secondary-text mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{plan.coveragePct}% Collision & Repair Coverage</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {plan.roadAssist ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-muted-text">✕</span>
                    )}
                    <span className={plan.roadAssist ? 'text-primary-text' : 'text-muted-text'}>
                      24/7 Roadside Breakdown Towing
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {plan.theftProtection ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-muted-text">✕</span>
                    )}
                    <span className={plan.theftProtection ? 'text-primary-text' : 'text-muted-text'}>
                      Full Theft & Vandalism Protection
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {plan.replacementVehicle ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-muted-text">✕</span>
                    )}
                    <span className={plan.replacementVehicle ? 'text-primary-text' : 'text-muted-text'}>
                      Complimentary Replacement Loaner Car
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {plan.accidentForgiveness ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-muted-text">✕</span>
                    )}
                    <span className={plan.accidentForgiveness ? 'text-primary-text' : 'text-muted-text'}>
                      Accident Forgiveness (Zero Rate Spikes)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {isCurrentPlan ? (
                  <Button variant="secondary" size="md" className="w-full" disabled>
                    Current Active Policy
                  </Button>
                ) : (
                  <Button
                    variant={isPremium ? 'accent' : 'primary'}
                    size="md"
                    glow={isPremium}
                    className="w-full"
                    onClick={() => handleBuyPlan(plan.id, plan.name)}
                  >
                    Select {plan.name} Policy (₹{plan.monthlyPremium})
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
