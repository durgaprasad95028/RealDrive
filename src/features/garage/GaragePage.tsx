import React, { useState } from 'react';
import { 
  Wrench, 
  Car, 
  Paintbrush, 
  Gauge, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Trash2, 
  DollarSign, 
  Check, 
  Sparkles,
  Layers,
  Fuel,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { VehicleCustomization, VehicleHealth } from '../../types';

interface GaragePageProps {
  onNavigate: (path: string) => void;
}

export const GaragePage: React.FC<GaragePageProps> = ({ onNavigate }) => {
  const { 
    vehicles, 
    selectedVehicle, 
    selectVehicle, 
    wallet, 
    customizeVehicle, 
    serviceVehicle, 
    sellVehicle,
    driver 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'overview' | 'customization' | 'performance' | 'service'>('overview');
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [carToSellId, setCarToSellId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const ownedVehicles = vehicles.filter(v => v.isOwned);

  // Tuning State for currently selected car
  const [paintColor, setPaintColor] = useState(selectedVehicle?.customization.exterior.paintColor || '#2563EB');
  const [paintFinish, setPaintFinish] = useState<'gloss' | 'matte' | 'metallic'>(selectedVehicle?.customization.exterior.finish || 'metallic');
  const [tintLevel, setTintLevel] = useState<'none' | 'light' | 'medium' | 'dark'>(selectedVehicle?.customization.exterior.tintLevel || 'light');
  const [spoiler, setSpoiler] = useState(selectedVehicle?.customization.exterior.spoiler || 'Low-profile Lip');
  const [bodyKit, setBodyKit] = useState(selectedVehicle?.customization.exterior.bodyKit || 'Factory OEM');
  const [neonGlow, setNeonGlow] = useState(selectedVehicle?.customization.exterior.neonGlow || 'none');

  // Performance levels
  const [engineLevel, setEngineLevel] = useState(selectedVehicle?.customization.performance.engineLevel || 1);
  const [transLevel, setTransLevel] = useState(selectedVehicle?.customization.performance.transmissionLevel || 1);
  const [brakesLevel, setBrakesLevel] = useState(selectedVehicle?.customization.performance.brakesLevel || 1);
  const [suspensionLevel, setSuspensionLevel] = useState(selectedVehicle?.customization.performance.suspensionLevel || 1);
  const [tyresLevel, setTyresLevel] = useState(selectedVehicle?.customization.performance.tyresLevel || 1);
  const [ecuTuneLevel, setEcuTuneLevel] = useState(selectedVehicle?.customization.performance.ecuTuneLevel || 1);

  if (!selectedVehicle) return null;

  const colorPalette = [
    '#2563EB', '#38BDF8', '#EF4444', '#22C55E', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#F8FAFC', '#1E293B'
  ];

  // Calculate tuning cost
  const calculateTuningCost = () => {
    let cost = 0;
    if (paintColor !== selectedVehicle.customization.exterior.paintColor) cost += 450;
    if (paintFinish !== selectedVehicle.customization.exterior.finish) cost += 300;
    if (tintLevel !== selectedVehicle.customization.exterior.tintLevel) cost += 200;
    if (spoiler !== selectedVehicle.customization.exterior.spoiler) cost += 600;
    if (bodyKit !== selectedVehicle.customization.exterior.bodyKit) cost += 1200;
    if (neonGlow !== selectedVehicle.customization.exterior.neonGlow) cost += 350;

    const engDelta = engineLevel - selectedVehicle.customization.performance.engineLevel;
    if (engDelta > 0) cost += engDelta * 1800;

    const transDelta = transLevel - selectedVehicle.customization.performance.transmissionLevel;
    if (transDelta > 0) cost += transDelta * 1200;

    const brakeDelta = brakesLevel - selectedVehicle.customization.performance.brakesLevel;
    if (brakeDelta > 0) cost += brakeDelta * 950;

    const suspDelta = suspensionLevel - selectedVehicle.customization.performance.suspensionLevel;
    if (suspDelta > 0) cost += suspDelta * 850;

    const tyreDelta = tyresLevel - selectedVehicle.customization.performance.tyresLevel;
    if (tyreDelta > 0) cost += tyreDelta * 750;

    const ecuDelta = ecuTuneLevel - selectedVehicle.customization.performance.ecuTuneLevel;
    if (ecuDelta > 0) cost += ecuDelta * 1400;

    return cost;
  };

  const currentUpgradeCost = calculateTuningCost();

  const handleApplyCustomization = () => {
    const newCustomization: VehicleCustomization = {
      exterior: {
        paintColor,
        finish: paintFinish,
        wheels: selectedVehicle.customization.exterior.wheels,
        wheelColor: selectedVehicle.customization.exterior.wheelColor,
        tintLevel,
        spoiler,
        bodyKit,
        neonGlow,
      },
      performance: {
        engineLevel,
        transmissionLevel: transLevel,
        brakesLevel,
        suspensionLevel,
        tyresLevel,
        ecuTuneLevel,
      },
    };

    const res = customizeVehicle(selectedVehicle.id, newCustomization, currentUpgradeCost);
    if (res.success) {
      setActionFeedback('Customization and performance upgrades applied to vehicle!');
      setTimeout(() => setActionFeedback(null), 3500);
    } else {
      setActionFeedback(res.message);
    }
  };

  const handleConfirmSell = () => {
    if (!carToSellId) return;
    const res = sellVehicle(carToSellId);
    setSellModalOpen(false);
    setCarToSellId(null);
    if (res.success) {
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Garage & Customization Bay"
        subtitle="Manage your personal vehicle fleet, apply aerodynamic styling, and tune engine/chassis performance"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Car className="w-4 h-4" />}
              onClick={() => onNavigate('/marketplace')}
            >
              Buy Cars
            </Button>
            <Button
              variant="primary"
              size="sm"
              glow
              leftIcon={<Gauge className="w-4 h-4" />}
              onClick={() => onNavigate('/drive/game')}
            >
              Drive Car
            </Button>
          </div>
        }
      />

      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-blue-950/80 border border-blue-700 text-sky-300 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <span>ℹ {actionFeedback}</span>
          <button onClick={() => setActionFeedback(null)} className="text-white">✕</button>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Garage Fleet', count: ownedVehicles.length },
          { id: 'customization', label: 'Exterior Styling & Paint' },
          { id: 'performance', label: 'Performance & ECU Tuning' },
          { id: 'service', label: 'Workshop Service Bay' },
        ]}
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as any)}
      />

      {/* TAB 1: FLEET OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Garage Level and Capacity Bar */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface/80 border border-app-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-950 text-sky-400 border border-blue-800">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary-text">Personal Garage (Level 2)</h4>
                <p className="text-xs text-secondary-text">Capacity: {ownedVehicles.length} / 6 Vehicle Bays Occupied</p>
              </div>
            </div>
            <Badge variant="blue" size="md">6 BAYS AVAILABLE</Badge>
          </div>

          {/* Owned Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedVehicles.map(car => {
              const isSelected = selectedVehicle.id === car.id;
              return (
                <Card
                  key={car.id}
                  variant={isSelected ? 'glow-blue' : 'default'}
                  className="overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Header preview with car color background accent */}
                    <div 
                      className="h-36 p-5 flex flex-col justify-between border-b border-app-border relative"
                      style={{ background: `linear-gradient(135deg, ${car.color}22 0%, #111827 100%)` }}
                    >
                      <div className="flex justify-between items-start">
                        <Badge variant="blue" size="sm">{car.category}</Badge>
                        {isSelected && <Badge variant="accent" size="sm" dot>PRIMARY</Badge>}
                      </div>
                      <div>
                        <span className="text-xs font-mono text-muted-text">{car.brand}</span>
                        <h4 className="text-lg font-bold text-primary-text">{car.name}</h4>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 text-xs font-mono">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-surface-elevated">
                          <span className="text-[10px] text-muted-text block">POWER</span>
                          <span className="font-bold text-primary-text">{car.powerHp} HP</span>
                        </div>
                        <div className="p-2 rounded-lg bg-surface-elevated">
                          <span className="text-[10px] text-muted-text block">SPEED</span>
                          <span className="font-bold text-primary-text">{car.topSpeedKmH} km/h</span>
                        </div>
                        <div className="p-2 rounded-lg bg-surface-elevated">
                          <span className="text-[10px] text-muted-text block">HEALTH</span>
                          <span className="font-bold text-emerald-400">{car.overallCondition}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-secondary-text pt-2 border-t border-app-border">
                        <span>Valuation:</span>
                        <span className="font-bold text-emerald-400">₹{car.value.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2">
                    {isSelected ? (
                      <Button variant="secondary" size="sm" className="flex-1" disabled>
                        Selected Daily
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => selectVehicle(car.id)}
                      >
                        Select Vehicle
                      </Button>
                    )}

                    {ownedVehicles.length > 1 && (
                      <button
                        onClick={() => {
                          setCarToSellId(car.id);
                          setSellModalOpen(true);
                        }}
                        className="p-2 rounded-lg text-secondary-text hover:text-danger hover:bg-red-950/40 transition-colors"
                        title="Sell Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: EXTERIOR STYLING */}
      {activeTab === 'customization' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Styling Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="default">
              <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
                <Paintbrush className="w-5 h-5 text-sky-400" />
                <span>Body Paint & Surface Finish</span>
              </h3>

              <div className="space-y-4">
                {/* Paint Palette */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                    Select Paint Color
                  </label>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {colorPalette.map(c => (
                      <button
                        key={c}
                        onClick={() => setPaintColor(c)}
                        className={`w-10 h-10 rounded-full border-2 transition-transform ${
                          paintColor === c ? 'scale-125 border-white shadow-glow-blue' : 'border-app-border hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Finish Type */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                    Surface Finish
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['gloss', 'matte', 'metallic'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setPaintFinish(f)}
                        className={`p-3 rounded-xl border text-center capitalize font-mono text-xs font-bold transition-all ${
                          paintFinish === f ? 'bg-blue-950/60 border-sky-400 text-sky-300 shadow-glow-blue' : 'bg-surface border-app-border text-secondary-text'
                        }`}
                      >
                        {f} Finish
                      </button>
                    ))}
                  </div>
                </div>

                {/* Window Tint */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                    Window Tint Shade
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['none', 'light', 'medium', 'dark'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTintLevel(t)}
                        className={`p-2.5 rounded-xl border text-center capitalize font-mono text-xs transition-all ${
                          tintLevel === t ? 'bg-blue-950/60 border-sky-400 text-sky-300' : 'bg-surface border-app-border text-secondary-text'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="default">
              <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Aero Spoilers & Body Kits</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                    Rear Aero Spoiler
                  </label>
                  <div className="space-y-2">
                    {['none', 'Low-profile Lip', 'Roof Wing', 'GT Carbon High Downforce'].map(s => (
                      <button
                        key={s}
                        onClick={() => setSpoiler(s)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex justify-between items-center ${
                          spoiler === s ? 'bg-blue-950/60 border-sky-400 text-sky-300' : 'bg-surface border-app-border text-secondary-text'
                        }`}
                      >
                        <span>{s}</span>
                        {spoiler === s && <Check className="w-4 h-4 text-sky-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                    Aerodynamic Body Kit
                  </label>
                  <div className="space-y-2">
                    {['Factory OEM', 'Urban Sport', 'Widebody Super Trofeo', 'Executive Chrome'].map(b => (
                      <button
                        key={b}
                        onClick={() => setBodyKit(b)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex justify-between items-center ${
                          bodyKit === b ? 'bg-blue-950/60 border-sky-400 text-sky-300' : 'bg-surface border-app-border text-secondary-text'
                        }`}
                      >
                        <span>{b}</span>
                        {bodyKit === b && <Check className="w-4 h-4 text-sky-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right 1 Col: Summary & Cost checkout */}
          <Card variant="elevated" className="flex flex-col justify-between h-fit sticky top-20">
            <div>
              <h4 className="text-sm font-bold text-primary-text mb-3 flex items-center justify-between">
                <span>Styling Receipt</span>
                <Badge variant="blue" size="sm">{selectedVehicle.name}</Badge>
              </h4>

              <div className="p-4 rounded-xl bg-background-secondary border border-app-border space-y-2 text-xs font-mono mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-text">Paint:</span>
                  <span className="text-primary-text font-bold" style={{ color: paintColor }}>
                    {paintFinish} ({paintColor})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Tint:</span>
                  <span className="text-primary-text font-bold capitalize">{tintLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Spoiler:</span>
                  <span className="text-primary-text font-bold">{spoiler}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Body Kit:</span>
                  <span className="text-primary-text font-bold">{bodyKit}</span>
                </div>

                <div className="pt-3 border-t border-app-border flex justify-between text-sm">
                  <span className="text-secondary-text">Customization Fee:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    ₹{currentUpgradeCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              glow
              className="w-full"
              onClick={handleApplyCustomization}
              disabled={currentUpgradeCost === 0 && paintColor === selectedVehicle.customization.exterior.paintColor}
            >
              Apply Styling Changes (₹{currentUpgradeCost})
            </Button>
          </Card>
        </div>
      )}

      {/* TAB 3: PERFORMANCE TUNING */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[
              {
                title: 'Engine Internal Components',
                desc: 'Forged pistons, high-flow injectors, and reinforced crankshaft.',
                level: engineLevel,
                setLevel: setEngineLevel,
                max: 5,
                statLabel: '+25 HP per Stage',
              },
              {
                title: 'Transmission & Dual-Clutch Gearbox',
                desc: 'Close-ratio gear set with rapid sequential shifting.',
                level: transLevel,
                setLevel: setTransLevel,
                max: 5,
                statLabel: '+8 km/h Top Speed & Shift Speed',
              },
              {
                title: 'Competition Brake Rotors & Calipers',
                desc: 'Carbon-ceramic rotors and 6-piston high-friction calipers.',
                level: brakesLevel,
                setLevel: setBrakesLevel,
                max: 5,
                statLabel: '30% Shorter Braking Distance',
              },
              {
                title: 'Adjustable Track Suspension & Coilovers',
                desc: 'Stiffer damping, lowered center of gravity, anti-roll bars.',
                level: suspensionLevel,
                setLevel: setSuspensionLevel,
                max: 5,
                statLabel: '+15% High-Speed Cornering Grip',
              },
              {
                title: 'Performance Tyres & Compound',
                desc: 'Semi-slick compound with optimized wet-traction siping.',
                level: tyresLevel,
                setLevel: setTyresLevel,
                max: 5,
                statLabel: '+0.3s 0-100 Accel Improvement',
              },
              {
                title: 'ECU Dynamic Dyno Map',
                desc: 'Reflashed ignition timing and increased turbo boost profile.',
                level: ecuTuneLevel,
                setLevel: setEcuTuneLevel,
                max: 5,
                statLabel: '+15 HP & Torque Vectoring',
              },
            ].map((part, idx) => (
              <Card key={idx} variant="default" className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-primary-text">{part.title}</h4>
                      <Badge variant="blue" size="sm">Stage {part.level}</Badge>
                    </div>
                    <p className="text-xs text-secondary-text mt-0.5">{part.desc}</p>
                    <span className="text-[11px] font-mono text-sky-400 font-semibold">{part.statLabel}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => part.setLevel(Math.max(1, part.level - 1))}
                      disabled={part.level <= 1}
                      className="w-8 h-8 rounded-lg bg-surface-elevated border border-app-border text-primary-text font-bold disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-bold w-16 text-center text-primary-text">
                      Stage {part.level}
                    </span>
                    <button
                      onClick={() => part.setLevel(Math.min(part.max, part.level + 1))}
                      disabled={part.level >= part.max}
                      className="w-8 h-8 rounded-lg bg-blue-900 border border-blue-700 text-sky-300 font-bold disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Performance Tuning Checkout */}
          <Card variant="elevated" className="flex flex-col justify-between h-fit sticky top-20">
            <div>
              <h4 className="text-sm font-bold text-primary-text mb-3">Dyno Upgrades Checkout</h4>
              
              <div className="p-4 rounded-xl bg-background-secondary border border-app-border space-y-2.5 text-xs font-mono mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-text">Engine Level:</span>
                  <span className="font-bold text-primary-text">Stage {engineLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Transmission:</span>
                  <span className="font-bold text-primary-text">Stage {transLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Brakes:</span>
                  <span className="font-bold text-primary-text">Stage {brakesLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">ECU Stage:</span>
                  <span className="font-bold text-sky-400">Stage {ecuTuneLevel}</span>
                </div>

                <div className="pt-3 border-t border-app-border flex justify-between text-sm">
                  <span className="text-secondary-text">Parts & Labor:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    ₹{currentUpgradeCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              glow
              className="w-full"
              onClick={handleApplyCustomization}
              disabled={currentUpgradeCost === 0}
            >
              Install Tuning (₹{currentUpgradeCost.toLocaleString()})
            </Button>
          </Card>
        </div>
      )}

      {/* TAB 4: SERVICE BAY */}
      {activeTab === 'service' && (
        <div className="space-y-6">
          <Card variant="default">
            <h3 className="text-base font-bold text-primary-text mb-2">Quick Workshop Service Bay</h3>
            <p className="text-xs text-secondary-text mb-4">
              Restore depleted vehicle components to 100% factory efficiency.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { part: 'engine' as keyof VehicleHealth, label: 'Engine Tune & Spark Plugs', cost: 350, current: selectedVehicle.health.engine },
                { part: 'brakes' as keyof VehicleHealth, label: 'Brake Fluid & Pad Replacement', cost: 180, current: selectedVehicle.health.brakes },
                { part: 'tyres' as keyof VehicleHealth, label: 'Tire Balancing & Rotation', cost: 220, current: selectedVehicle.health.tyres },
                { part: 'transmission' as keyof VehicleHealth, label: 'Transmission Fluid Flush', cost: 280, current: selectedVehicle.health.transmission },
                { part: 'battery' as keyof VehicleHealth, label: '12V Battery Diagnostic', cost: 120, current: selectedVehicle.health.battery },
                { part: 'full' as const, label: 'Complete Master Overhaul (All Systems)', cost: 850, current: selectedVehicle.overallCondition },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-elevated border border-app-border flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-primary-text">{item.label}</h4>
                      <span className="font-mono text-xs font-bold text-emerald-400">₹{item.cost}</span>
                    </div>
                    <p className="text-xs font-mono text-secondary-text">Current: {item.current}%</p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => {
                      const res = serviceVehicle(selectedVehicle.id, item.part, item.cost);
                      if (res.success) {
                        setActionFeedback(`Completed service: ${item.label}`);
                        setTimeout(() => setActionFeedback(null), 3500);
                      }
                    }}
                  >
                    Perform Service (₹{item.cost})
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Sell Vehicle Confirmation Modal */}
      <Modal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        title="Confirm Vehicle Sale"
        subtitle="Liquidate vehicle from your garage"
      >
        <div className="space-y-4">
          <p className="text-xs text-secondary-text leading-relaxed">
            Are you sure you want to sell this vehicle? The proceeds calculated based on its market condition will be credited directly to your wallet balance.
          </p>
          <div className="flex justify-end gap-2 pt-4 border-t border-app-border">
            <Button variant="ghost" onClick={() => setSellModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" glow onClick={handleConfirmSell}>
              Confirm Sale
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
