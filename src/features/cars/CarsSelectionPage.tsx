import React, { useState } from 'react';
import { 
  Car, 
  Gauge, 
  Zap, 
  ShieldCheck, 
  Fuel, 
  Check, 
  Play, 
  Lock, 
  Sparkles, 
  DollarSign, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Sliders
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Vehicle } from '../../types';

interface CarsSelectionPageProps {
  onNavigate: (path: string) => void;
}

export const CarsSelectionPage: React.FC<CarsSelectionPageProps> = ({ onNavigate }) => {
  const { vehicles, selectedVehicle, selectVehicle, buyVehicle, wallet } = useGame();
  const [activeTab, setActiveTab] = useState<'all' | 'owned' | 'showroom'>('all');
  const [purchaseMsg, setPurchaseMsg] = useState<string | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    if (activeTab === 'owned') return v.isOwned;
    if (activeTab === 'showroom') return !v.isOwned;
    return true;
  });

  const handleSelectCar = (v: Vehicle) => {
    selectVehicle(v.id);
  };

  const handleBuyCar = (v: Vehicle) => {
    const res = buyVehicle(v.id);
    setPurchaseMsg(res.message);
    setTimeout(() => setPurchaseMsg(null), 3500);
  };

  const handleStartDriving = () => {
    onNavigate('/game');
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-[#F8FAFC] pb-16 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0D1117]/95 border-b border-[#1F2937] backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-7xl mx-auto rounded-b-2xl">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => onNavigate('/dashboard')}
          >
            Dashboard
          </Button>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg font-black font-display text-white uppercase tracking-wider">
              CAR SELECTION & FLEET GARAGE
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">WALLET:</span>
            <span className="font-bold text-emerald-400">₹{wallet.balance.toLocaleString()}</span>
          </div>

          <Button
            variant="primary"
            size="md"
            glow
            leftIcon={<Play className="w-4 h-4 fill-current" />}
            onClick={handleStartDriving}
            className="shadow-glow-blue uppercase font-bold text-xs tracking-wider"
          >
            START DRIVING ({selectedVehicle?.name || 'VEHICLE'})
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        {/* Banner with Active Selected Vehicle */}
        {selectedVehicle && (
          <div className="relative p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-slate-950 border border-blue-500/30 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">CURRENTLY ACTIVE VEHICLE</Badge>
                <span className="text-xs font-mono text-slate-400">• Ready for 3D simulation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
                {selectedVehicle.brand} {selectedVehicle.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {selectedVehicle.description}
              </p>

              {/* Quick Specs Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Top Speed</span>
                  <span className="text-sm font-bold text-sky-400">{selectedVehicle.topSpeedKmH} km/h</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Power</span>
                  <span className="text-sm font-bold text-amber-400">{selectedVehicle.powerHp} HP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">0-100 km/h</span>
                  <span className="text-sm font-bold text-emerald-400">{selectedVehicle.acceleration0To100}s</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Condition</span>
                  <span className="text-sm font-bold text-cyan-400">{selectedVehicle.overallCondition}%</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                glow
                leftIcon={<Play className="w-5 h-5 fill-current" />}
                onClick={handleStartDriving}
                className="w-full sm:w-auto px-8 py-4 font-bold text-sm tracking-wider uppercase shadow-glow-blue"
              >
                ENTER 3D COCKPIT
              </Button>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute right-0 top-0 w-96 h-full bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}

        {/* Purchase alert message if any */}
        {purchaseMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 font-mono text-sm flex items-center gap-2 animate-fadeIn">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>{purchaseMsg}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              ALL VEHICLES ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab('owned')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'owned'
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              OWNED GARAGE ({vehicles.filter(v => v.isOwned).length})
            </button>
            <button
              onClick={() => setActiveTab('showroom')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'showroom'
                  ? 'bg-blue-600 text-white shadow-glow-blue'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              DEALERSHIP SHOWROOM ({vehicles.filter(v => !v.isOwned).length})
            </button>
          </div>
        </div>

        {/* Fleet Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => {
            const isSelected = selectedVehicle?.id === v.id;
            const canAfford = wallet.balance >= v.price;

            return (
              <div
                key={v.id}
                className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900/90 border-2 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.25)]'
                    : 'bg-slate-950/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Card Top Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      {v.brand} • {v.modelYear}
                    </span>
                    {v.isOwned ? (
                      isSelected ? (
                        <Badge variant="blue" size="sm">ACTIVE</Badge>
                      ) : (
                        <Badge variant="success" size="sm">OWNED</Badge>
                      )
                    ) : (
                      <Badge variant="neutral" size="sm">LOCKED</Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-display text-white">
                      {v.name}
                    </h3>
                    <p className="text-xs text-sky-400 font-mono">
                      Category: {v.category}
                    </p>
                  </div>

                  {/* Visual Color Stripe Representation */}
                  <div 
                    className="h-2 rounded-full w-full opacity-80"
                    style={{ backgroundColor: v.customization?.exterior?.paintColor || v.color || '#2563EB' }}
                  />

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {v.description}
                  </p>

                  {/* Specifications Grid */}
                  <div className="space-y-2 pt-2 text-xs font-mono">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-500">Top Speed:</span>
                      <span className="font-bold text-sky-400">{v.topSpeedKmH} km/h</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-sky-400" style={{ width: `${Math.min(100, (v.topSpeedKmH / 320) * 100)}%` }} />
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-500">Acceleration (0-100):</span>
                      <span className="font-bold text-amber-400">{v.acceleration0To100}s</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${Math.max(10, 100 - (v.acceleration0To100 / 12) * 100)}%` }} />
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-500">Power:</span>
                      <span className="font-bold text-emerald-400">{v.powerHp} HP</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, (v.powerHp / 600) * 100)}%` }} />
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-slate-500">Fuel Capacity:</span>
                      <span className="font-bold text-cyan-400">{v.fuelCapacityL} L ({v.fuelType})</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-6 mt-4 border-t border-slate-800/80 space-y-2">
                  {v.isOwned ? (
                    isSelected ? (
                      <Button
                        variant="primary"
                        size="md"
                        glow
                        leftIcon={<Play className="w-4 h-4 fill-current" />}
                        onClick={handleStartDriving}
                        className="w-full shadow-glow-blue uppercase font-bold text-xs"
                      >
                        DRIVE THIS CAR
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => handleSelectCar(v)}
                        className="w-full uppercase font-bold text-xs"
                      >
                        SELECT AS ACTIVE
                      </Button>
                    )
                  ) : (
                    <Button
                      variant={canAfford ? 'primary' : 'outline'}
                      size="md"
                      disabled={!canAfford}
                      onClick={() => handleBuyCar(v)}
                      className="w-full uppercase font-bold text-xs"
                    >
                      {canAfford ? `BUY FOR ₹${v.price.toLocaleString()}` : `LOCKED (₹${v.price.toLocaleString()})`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
