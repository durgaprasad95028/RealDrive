import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  SlidersHorizontal, 
  Fuel, 
  Gauge, 
  Wrench, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { VehicleHealthGrid } from '../../components/hud/TelemetryOverlay';
import { Vehicle, VehicleCategory } from '../../types';

interface VehiclesPageProps {
  onNavigate: (path: string) => void;
}

export const VehiclesPage: React.FC<VehiclesPageProps> = ({ onNavigate }) => {
  const { vehicles, selectVehicle, selectedVehicle } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailCar, setActiveDetailCar] = useState<Vehicle | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Fleet', count: vehicles.length },
    { id: 'Sedan', label: 'Sedans', count: vehicles.filter(v => v.category === 'Sedan').length },
    { id: 'Hatchback', label: 'Hatchbacks', count: vehicles.filter(v => v.category === 'Hatchback').length },
    { id: 'SUV', label: 'SUVs', count: vehicles.filter(v => v.category === 'SUV').length },
    { id: 'Sports', label: 'Sports / GT', count: vehicles.filter(v => v.category === 'Sports').length },
    { id: 'Electric', label: 'EV Electric', count: vehicles.filter(v => v.category === 'Electric').length },
    { id: 'Utility', label: 'Utility / 4x4', count: vehicles.filter(v => v.category === 'Utility').length },
  ];

  const filteredVehicles = vehicles.filter(v => {
    const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Vehicle Fleet & Specs"
        subtitle="Inspect fictional automotive engineering specifications, health telemetry, and performance profiles"
        actions={
          <Button
            variant="primary"
            size="sm"
            glow
            leftIcon={<Wrench className="w-4 h-4" />}
            onClick={() => onNavigate('/garage')}
          >
            Open My Garage
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Tabs
          tabs={categories}
          activeTab={selectedCategory}
          onChange={setSelectedCategory}
          className="w-full sm:w-auto"
        />

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search make or model..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(car => {
          const isSelected = selectedVehicle?.id === car.id;

          return (
            <Card
              key={car.id}
              variant={isSelected ? 'glow-blue' : 'default'}
              className="overflow-hidden flex flex-col justify-between group hover:border-blue-500/50 transition-all"
            >
              <div>
                {/* Header Banner */}
                <div className="h-44 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 p-5 flex flex-col justify-between border-b border-app-border relative overflow-hidden">
                  <div className="flex justify-between items-start z-10">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="blue" size="sm">{car.category}</Badge>
                      {car.isOwned && (
                        <Badge variant="success" size="sm">OWNED</Badge>
                      )}
                      {isSelected && (
                        <Badge variant="accent" size="sm" dot>SELECTED</Badge>
                      )}
                    </div>
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      ₹{car.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="z-10">
                    <span className="text-xs text-muted-text font-mono">{car.brand} • {car.modelYear}</span>
                    <h3 className="text-xl font-bold text-primary-text group-hover:text-sky-400 transition-colors">
                      {car.name}
                    </h3>
                  </div>

                  {/* Decorative background glow */}
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Specs Matrix */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-secondary-text leading-relaxed line-clamp-2">
                    {car.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-surface-elevated/70 border border-app-border">
                      <p className="text-[10px] text-muted-text uppercase font-mono">Power</p>
                      <p className="text-xs font-mono font-bold text-primary-text">{car.powerHp} HP</p>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-elevated/70 border border-app-border">
                      <p className="text-[10px] text-muted-text uppercase font-mono">0-100</p>
                      <p className="text-xs font-mono font-bold text-sky-400">{car.acceleration0To100}s</p>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-elevated/70 border border-app-border">
                      <p className="text-[10px] text-muted-text uppercase font-mono">Top Speed</p>
                      <p className="text-xs font-mono font-bold text-primary-text">{car.topSpeedKmH} km/h</p>
                    </div>
                  </div>

                  {/* Fuel & Condition status */}
                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-app-border">
                    <span className="text-muted-text flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-amber-400" />
                      <span>{car.fuelEconomyKmPerL} km/L</span>
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {car.overallCondition}% Condition
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setActiveDetailCar(car)}
                >
                  Full Specs
                </Button>

                {car.isOwned ? (
                  <Button
                    variant={isSelected ? 'secondary' : 'primary'}
                    size="sm"
                    className="flex-1"
                    onClick={() => selectVehicle(car.id)}
                    disabled={isSelected}
                  >
                    {isSelected ? 'Active Car' : 'Select Car'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => onNavigate('/marketplace')}
                  >
                    Dealership
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Vehicle Modal */}
      {activeDetailCar && (
        <Modal
          isOpen={!!activeDetailCar}
          onClose={() => setActiveDetailCar(null)}
          title={`${activeDetailCar.brand} ${activeDetailCar.name} (${activeDetailCar.modelYear})`}
          subtitle={`Detailed automotive telemetry and powertrain specifications`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-background-secondary/80 border border-app-border">
              <p className="text-sm text-secondary-text leading-relaxed">
                {activeDetailCar.description}
              </p>
            </div>

            {/* Performance Specifications Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text mb-3">
                Factory Performance Telemetry
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-surface-elevated border border-app-border">
                  <span className="text-[10px] text-muted-text uppercase block">Horsepower</span>
                  <span className="text-base font-bold text-primary-text">{activeDetailCar.powerHp} HP</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-elevated border border-app-border">
                  <span className="text-[10px] text-muted-text uppercase block">0-100 km/h</span>
                  <span className="text-base font-bold text-sky-400">{activeDetailCar.acceleration0To100} seconds</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-elevated border border-app-border">
                  <span className="text-[10px] text-muted-text uppercase block">Top Speed</span>
                  <span className="text-base font-bold text-primary-text">{activeDetailCar.topSpeedKmH} km/h</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-elevated border border-app-border">
                  <span className="text-[10px] text-muted-text uppercase block">Fuel Type</span>
                  <span className="text-base font-bold text-amber-400">{activeDetailCar.fuelType}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-elevated border border-app-border">
                  <span className="text-[10px] text-muted-text uppercase block">Fuel Capacity</span>
                  <span className="text-base font-bold text-primary-text">{activeDetailCar.fuelCapacityL} Liters</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-elevated border border-app-border">
                  <span className="text-[10px] text-muted-text uppercase block">Efficiency</span>
                  <span className="text-base font-bold text-emerald-400">{activeDetailCar.fuelEconomyKmPerL} km/L</span>
                </div>
              </div>
            </div>

            {/* Component Health Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text mb-3">
                8-Point Health Diagnostics
              </h4>
              <VehicleHealthGrid health={activeDetailCar.health} />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-app-border">
              <Button variant="outline" onClick={() => setActiveDetailCar(null)}>
                Close
              </Button>
              {activeDetailCar.isOwned ? (
                <Button
                  variant="primary"
                  glow
                  onClick={() => {
                    selectVehicle(activeDetailCar.id);
                    setActiveDetailCar(null);
                    onNavigate('/garage');
                  }}
                >
                  Tune in Garage
                </Button>
              ) : (
                <Button
                  variant="primary"
                  glow
                  onClick={() => {
                    setActiveDetailCar(null);
                    onNavigate('/marketplace');
                  }}
                >
                  View in Dealership
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};
