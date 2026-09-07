import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Car, 
  Search, 
  SlidersHorizontal, 
  Check, 
  Fuel, 
  Gauge, 
  Zap, 
  Layers, 
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { Vehicle } from '../../types';

interface MarketplacePageProps {
  onNavigate: (path: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate }) => {
  const { vehicles, buyVehicle, wallet } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareCarA, setCompareCarA] = useState<Vehicle | null>(null);
  const [compareCarB, setCompareCarB] = useState<Vehicle | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Showroom', count: vehicles.length },
    { id: 'Sedan', label: 'Sedans', count: vehicles.filter(v => v.category === 'Sedan').length },
    { id: 'Hatchback', label: 'Hatchbacks', count: vehicles.filter(v => v.category === 'Hatchback').length },
    { id: 'SUV', label: 'SUVs', count: vehicles.filter(v => v.category === 'SUV').length },
    { id: 'Sports', label: 'Super Sports', count: vehicles.filter(v => v.category === 'Sports').length },
    { id: 'Electric', label: 'Electric EV', count: vehicles.filter(v => v.category === 'Electric').length },
    { id: 'Utility', label: 'Utility 4x4', count: vehicles.filter(v => v.category === 'Utility').length },
  ];

  const filteredVehicles = vehicles.filter(v => {
    const matchCat = selectedCategory === 'ALL' || v.category === selectedCategory;
    const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleBuy = (car: Vehicle) => {
    const res = buyVehicle(car.id);
    if (res.success) {
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch {}
      setFeedback(res.message);
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback(res.message);
    }
  };

  const openCompare = (car: Vehicle) => {
    if (!compareCarA) {
      setCompareCarA(car);
      setCompareCarB(vehicles.find(v => v.id !== car.id) || null);
    } else {
      setCompareCarB(car);
    }
    setIsCompareModalOpen(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Metropolis Prestige Auto Mall"
        subtitle="Official dealership showroom for brand-new and certified pre-owned fictional vehicle models"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Scale className="w-4 h-4" />}
              onClick={() => {
                setCompareCarA(vehicles[0]);
                setCompareCarB(vehicles[1]);
                setIsCompareModalOpen(true);
              }}
            >
              Side-by-Side Compare
            </Button>
            <Button
              variant="primary"
              size="sm"
              glow
              leftIcon={<Car className="w-4 h-4" />}
              onClick={() => onNavigate('/garage')}
            >
              My Garage Bay
            </Button>
          </div>
        }
      />

      {feedback && (
        <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-600 text-sky-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <span>ℹ {feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-white">✕</button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Tabs
          tabs={categories}
          activeTab={selectedCategory}
          onChange={setSelectedCategory}
        />

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search showroom..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Showroom Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(car => {
          const isOwned = car.isOwned;
          const canAfford = wallet.balance >= car.price;

          return (
            <Card
              key={car.id}
              variant={isOwned ? 'default' : canAfford ? 'glow-accent' : 'default'}
              className="flex flex-col justify-between overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div>
                {/* Visual Header Box */}
                <div 
                  className="h-44 p-5 flex flex-col justify-between border-b border-app-border relative"
                  style={{ background: `linear-gradient(135deg, ${car.color}22 0%, #111827 100%)` }}
                >
                  <div className="flex justify-between items-start">
                    <Badge variant="blue" size="sm">{car.category}</Badge>
                    <span className="font-mono text-base font-black text-emerald-400">
                      ₹{car.price.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-muted-text font-mono">{car.brand} • {car.modelYear}</span>
                    <h3 className="text-xl font-bold text-primary-text group-hover:text-sky-400 transition-colors">
                      {car.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-secondary-text leading-relaxed line-clamp-2">
                    {car.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-lg bg-surface-elevated border border-app-border">
                      <span className="text-[10px] text-muted-text block">POWER</span>
                      <span className="font-bold text-primary-text">{car.powerHp} HP</span>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-elevated border border-app-border">
                      <span className="text-[10px] text-muted-text block">0-100</span>
                      <span className="font-bold text-sky-400">{car.acceleration0To100}s</span>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-elevated border border-app-border">
                      <span className="text-[10px] text-muted-text block">TOP</span>
                      <span className="font-bold text-primary-text">{car.topSpeedKmH} km/h</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-mono text-muted-text pt-2 border-t border-app-border">
                    <span>Fuel: <strong className="text-primary-text">{car.fuelType}</strong></span>
                    <span>Economy: <strong className="text-emerald-400">{car.fuelEconomyKmPerL} km/L</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openCompare(car)}
                >
                  Compare
                </Button>

                {isOwned ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => onNavigate('/garage')}
                  >
                    In Your Garage
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    glow={canAfford}
                    className="flex-1"
                    disabled={!canAfford}
                    onClick={() => handleBuy(car)}
                  >
                    {canAfford ? `Purchase Vehicle` : `Need ₹${(car.price - wallet.balance).toLocaleString()}`}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && compareCarA && compareCarB && (
        <Modal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          title="Vehicle Comparison Tool"
          subtitle="Compare technical specifications and performance ratings"
          maxWidth="4xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Car A */}
              <div className="p-4 rounded-xl bg-surface-elevated border border-app-border space-y-3 font-mono text-xs">
                <div className="border-b border-app-border pb-2">
                  <Badge variant="blue" size="sm">{compareCarA.category}</Badge>
                  <h4 className="text-base font-bold text-primary-text mt-1">{compareCarA.name}</h4>
                  <span className="text-emerald-400 font-bold text-sm">₹{compareCarA.price.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Horsepower:</span><strong>{compareCarA.powerHp} HP</strong></div>
                  <div className="flex justify-between"><span>0-100 km/h:</span><strong className="text-sky-400">{compareCarA.acceleration0To100}s</strong></div>
                  <div className="flex justify-between"><span>Top Speed:</span><strong>{compareCarA.topSpeedKmH} km/h</strong></div>
                  <div className="flex justify-between"><span>Fuel Economy:</span><strong>{compareCarA.fuelEconomyKmPerL} km/L</strong></div>
                  <div className="flex justify-between"><span>Powertrain:</span><strong>{compareCarA.fuelType}</strong></div>
                </div>
              </div>

              {/* Car B */}
              <div className="p-4 rounded-xl bg-surface-elevated border border-app-border space-y-3 font-mono text-xs">
                <div className="border-b border-app-border pb-2">
                  <Badge variant="blue" size="sm">{compareCarB.category}</Badge>
                  <h4 className="text-base font-bold text-primary-text mt-1">{compareCarB.name}</h4>
                  <span className="text-emerald-400 font-bold text-sm">₹{compareCarB.price.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Horsepower:</span><strong>{compareCarB.powerHp} HP</strong></div>
                  <div className="flex justify-between"><span>0-100 km/h:</span><strong className="text-sky-400">{compareCarB.acceleration0To100}s</strong></div>
                  <div className="flex justify-between"><span>Top Speed:</span><strong>{compareCarB.topSpeedKmH} km/h</strong></div>
                  <div className="flex justify-between"><span>Fuel Economy:</span><strong>{compareCarB.fuelEconomyKmPerL} km/L</strong></div>
                  <div className="flex justify-between"><span>Powertrain:</span><strong>{compareCarB.fuelType}</strong></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setIsCompareModalOpen(false)}>
                Close Comparison
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};
