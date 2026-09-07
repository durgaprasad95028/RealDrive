import React, { useState } from 'react';
import { 
  Fuel, 
  Zap, 
  Car, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Slider } from '../../components/common/Slider';
import { ProgressBar } from '../../components/common/ProgressBar';

interface FuelPageProps {
  onNavigate: (path: string) => void;
}

export const FuelPage: React.FC<FuelPageProps> = ({ onNavigate }) => {
  const { selectedVehicle, refuelVehicle, wallet } = useGame();

  const [fuelAmountLiters, setFuelAmountLiters] = useState(15);
  const [selectedGrade, setSelectedGrade] = useState<'Regular 91' | 'Premium 98' | 'Ultra Diesel' | 'DC Fast Charge'>('Regular 91');
  const [isPumping, setIsPumping] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!selectedVehicle) return null;

  const fuelMissingL = Math.max(0, selectedVehicle.fuelCapacityL - selectedVehicle.fuelCurrentL);
  const currentFuelPct = Math.round((selectedVehicle.fuelCurrentL / selectedVehicle.fuelCapacityL) * 100);
  const estimatedRangeKm = Math.round(selectedVehicle.fuelCurrentL * selectedVehicle.fuelEconomyKmPerL);

  // Price per Liter / kWh based on grade
  const gradePrices = {
    'Regular 91': 1.65,
    'Premium 98': 2.10,
    'Ultra Diesel': 1.80,
    'DC Fast Charge': 0.45,
  };

  const calculatedCost = Math.round(fuelAmountLiters * gradePrices[selectedGrade] * 80); // In in-game simulated currency

  const handleRefuel = () => {
    if (fuelAmountLiters <= 0) return;
    setIsPumping(true);
    setFeedback(null);

    setTimeout(() => {
      setIsPumping(false);
      const res = refuelVehicle(selectedVehicle.id, fuelAmountLiters, calculatedCost);
      if (res.success) {
        setFeedback(res.message);
        setFuelAmountLiters(10);
      } else {
        setFeedback(res.message);
      }
    }, 1200);
  };

  return (
    <PageContainer>
      <PageHeader
        title="OctanePrime 24/7 Superstation"
        subtitle="Automated dispensing pumps for high-octane gasoline, ultra-low sulfur diesel, and high-voltage EV fast chargers"
      />

      {feedback && (
        <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-600 text-sky-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <span>✓ {feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-white">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fuel Pump Dispensers & Grade Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default">
            <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-sky-400" />
              <span>Select Fuel Grade / Energy Type</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'Regular 91' as const, title: 'Octane 91 (Regular Unleaded)', rate: '₹132 / L', desc: 'Standard compression passenger cars and city commuters.' },
                { id: 'Premium 98' as const, title: 'Octane 98 (Apex Racing Blend)', rate: '₹168 / L', desc: 'High-boost turbocharged sports cars & track vehicles.' },
                { id: 'Ultra Diesel' as const, title: 'Ultra-Low Sulfur Diesel', rate: '₹144 / L', desc: 'Commercial heavy transport, delivery vans & 4x4 trucks.' },
                { id: 'DC Fast Charge' as const, title: '350kW DC Ultra Fast EV Port', rate: '₹36 / kWh', desc: 'Direct battery power for high-voltage electric grand tourers.' },
              ].map(grade => (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedGrade === grade.id
                      ? 'bg-blue-950/60 border-sky-400 shadow-glow-blue'
                      : 'bg-surface border-app-border hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-primary-text">{grade.title}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{grade.rate}</span>
                    </div>
                    <p className="text-xs text-secondary-text leading-relaxed">{grade.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Volume Dispenser Controls */}
          <Card variant="default">
            <h3 className="text-base font-bold text-primary-text mb-4">
              Dispenser Flow & Liters Allocation
            </h3>

            <div className="space-y-6">
              <Slider
                label="Liters to Dispense"
                unit="Liters"
                value={fuelAmountLiters}
                min={1}
                max={Math.max(1, Math.ceil(fuelMissingL))}
                step={1}
                onChange={setFuelAmountLiters}
              />

              {/* Preset quick buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase text-muted-text font-semibold mr-2">Presets:</span>
                {[5, 10, 20, 35].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setFuelAmountLiters(Math.min(fuelMissingL, amount))}
                    className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-app-border text-xs font-mono text-primary-text hover:border-sky-400"
                  >
                    +{amount}L
                  </button>
                ))}
                <button
                  onClick={() => setFuelAmountLiters(Math.ceil(fuelMissingL))}
                  className="px-3 py-1.5 rounded-lg bg-blue-950 border border-blue-700 text-xs font-mono text-sky-300 font-bold hover:bg-blue-900"
                >
                  Fill Entire Tank ({fuelMissingL.toFixed(1)}L)
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Vehicle Tank Telemetry & Pump Terminal */}
        <div className="space-y-6">
          <Card variant="elevated">
            <div className="flex items-center justify-between pb-3 border-b border-app-border mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-text">Vehicle Fuel Level</span>
              <Badge variant={currentFuelPct < 25 ? 'danger' : 'success'} size="sm">
                {currentFuelPct}% TANK
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-950 text-sky-400 border border-blue-800">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary-text">{selectedVehicle.name}</h4>
                  <p className="text-xs text-muted-text font-mono">Factory Spec: {selectedVehicle.fuelType}</p>
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-text">Current Fuel:</span>
                  <span className="font-bold text-primary-text">{selectedVehicle.fuelCurrentL.toFixed(1)} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Tank Capacity:</span>
                  <span className="text-primary-text">{selectedVehicle.fuelCapacityL} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Estimated Range:</span>
                  <span className="font-bold text-emerald-400">{estimatedRangeKm} km</span>
                </div>
              </div>

              <ProgressBar value={currentFuelPct} color={currentFuelPct < 25 ? 'danger' : 'blue'} size="md" />

              {/* Pump Dispenser Terminal Receipt */}
              <div className="p-4 rounded-xl bg-background-secondary border border-app-border space-y-2 font-mono text-xs pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-text">Grade:</span>
                  <span className="font-bold text-sky-400">{selectedGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Volume:</span>
                  <span className="text-primary-text">{fuelAmountLiters} Liters</span>
                </div>
                <div className="pt-2 border-t border-app-border flex justify-between text-sm">
                  <span className="text-secondary-text">Total Price:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    ₹{calculatedCost.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                glow
                isLoading={isPumping}
                className="w-full"
                onClick={handleRefuel}
                disabled={fuelAmountLiters <= 0 || fuelMissingL <= 0 || isPumping}
              >
                {isPumping ? 'Dispensing Fuel...' : `Authorize Pump (₹${calculatedCost})`}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
