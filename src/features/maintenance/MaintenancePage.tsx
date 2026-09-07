import React, { useState } from 'react';
import { 
  Wrench, 
  Car, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Cpu,
  Sparkles
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { VehicleHealth } from '../../types';

interface MaintenancePageProps {
  onNavigate: (path: string) => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ onNavigate }) => {
  const { selectedVehicle, serviceVehicle, wallet } = useGame();
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!selectedVehicle) return null;

  const handleDiagnosticScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
    setActionFeedback(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
    }, 1500);
  };

  const serviceOptions = [
    {
      part: 'oil' as const,
      label: 'Synthetic Engine Oil & Filter Flush',
      desc: 'Replaces degraded engine oil and removes sludge buildup.',
      cost: 95,
      wearTarget: 'Engine Lubrication',
      healthKey: 'engine' as keyof VehicleHealth,
    },
    {
      part: 'brakes' as keyof VehicleHealth,
      label: 'Brake Pad & Rotor Resurfacing',
      desc: 'Restores hydraulic stopping force and eliminates brake squeal.',
      cost: 160,
      wearTarget: 'Brake Calipers & Pads',
      healthKey: 'brakes' as keyof VehicleHealth,
    },
    {
      part: 'tyres' as keyof VehicleHealth,
      label: 'New High-Grip Tyre Set & Laser Alignment',
      desc: 'Replaces worn tread to restore full wet-weather braking traction.',
      cost: 240,
      wearTarget: 'Tread Life',
      healthKey: 'tyres' as keyof VehicleHealth,
    },
    {
      part: 'transmission' as keyof VehicleHealth,
      label: 'Transmission Clutch & Gear Fluid Service',
      desc: 'Ensures instantaneous gear engagement and eliminates slippage.',
      cost: 290,
      wearTarget: 'Gearbox Synchros',
      healthKey: 'transmission' as keyof VehicleHealth,
    },
    {
      part: 'suspension' as keyof VehicleHealth,
      label: 'Suspension Bushings & Shock Dampers',
      desc: 'Stabilizes high-speed road holding and bump absorption.',
      cost: 220,
      wearTarget: 'Chassis Dampers',
      healthKey: 'suspension' as keyof VehicleHealth,
    },
    {
      part: 'battery' as keyof VehicleHealth,
      label: '12V Battery Cell & Alternator Service',
      desc: 'Ensures rapid starter ignition and electronic safety assist power.',
      cost: 110,
      wearTarget: 'Electrical Power',
      healthKey: 'battery' as keyof VehicleHealth,
    },
    {
      part: 'full' as const,
      label: 'Comprehensive Master Workshop Overhaul',
      desc: 'Factory re-calibration of all powertrain, chassis, and electronic subsystems.',
      cost: 850,
      wearTarget: 'Complete Vehicle',
      healthKey: 'engine' as keyof VehicleHealth,
    },
  ];

  const handlePerformService = (part: keyof VehicleHealth | 'full', cost: number, label: string) => {
    const res = serviceVehicle(selectedVehicle.id, part, cost);
    if (res.success) {
      setActionFeedback(`Successfully completed: ${label}`);
      setTimeout(() => setActionFeedback(null), 3500);
    } else {
      setActionFeedback(res.message);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Precision Auto Diagnostics & Maintenance Hub"
        subtitle="Certified master inspection bay for component wear diagnostics, brake flushes, and engine rebuilding"
        actions={
          <Button
            variant="primary"
            size="sm"
            glow
            isLoading={isScanning}
            leftIcon={<Activity className="w-4 h-4" />}
            onClick={handleDiagnosticScan}
          >
            {isScanning ? 'Running OBD-II Diagnostic Scan...' : 'Run OBD-II Diagnostic Scan'}
          </Button>
        }
      />

      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-blue-950/80 border border-blue-600 text-sky-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <span>✓ {actionFeedback}</span>
          <button onClick={() => setActionFeedback(null)} className="text-white">✕</button>
        </div>
      )}

      {/* Vehicle Inspection Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-app-border">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-950 text-sky-400 border border-blue-800">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-text">INSPECTION BAY 1</span>
            <h3 className="text-lg font-bold text-primary-text">{selectedVehicle.name} ({selectedVehicle.brand})</h3>
            <p className="text-xs text-muted-text font-mono">
              Odometer: <strong>{selectedVehicle.mileageKm.toLocaleString()} km</strong> • Condition: <strong>{selectedVehicle.overallCondition}%</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={selectedVehicle.overallCondition < 60 ? 'danger' : selectedVehicle.overallCondition < 85 ? 'warning' : 'success'}
            size="md"
            dot
          >
            {selectedVehicle.overallCondition < 60 ? 'CRITICAL SERVICE DUE' : selectedVehicle.overallCondition < 85 ? 'MAINTENANCE RECOMMENDED' : 'OPTIMAL HEALTH'}
          </Badge>
        </div>
      </div>

      {/* Diagnostics Scan Results Panel */}
      {scanCompleted && (
        <Card variant="glow-blue" className="animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-app-border mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              <h4 className="text-sm font-bold text-primary-text">OBD-II Diagnostic Telemetry Scan Complete</h4>
            </div>
            <Badge variant="blue" size="sm">ZERO FAULT CODES</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-muted-text">
            <div>Engine ECU: <strong className="text-emerald-400">PASSED</strong></div>
            <div>Brake Fluid Pressure: <strong className="text-primary-text">145 PSI (Normal)</strong></div>
            <div>Alternator Voltage: <strong className="text-primary-text">14.2V (Stable)</strong></div>
            <div>Emissions Output: <strong className="text-emerald-400">CLEAN</strong></div>
          </div>
        </Card>
      )}

      {/* Service Action Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceOptions.map((opt, idx) => {
          const currentHealth = opt.part === 'full' 
            ? selectedVehicle.overallCondition 
            : selectedVehicle.health[opt.healthKey];
          
          const isWorn = currentHealth < 75;

          return (
            <Card
              key={idx}
              variant={isWorn ? 'glow-accent' : 'default'}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-primary-text">{opt.label}</h4>
                  <span className="font-mono text-sm font-bold text-emerald-400">₹{opt.cost}</span>
                </div>

                <p className="text-xs text-secondary-text leading-relaxed mb-4">
                  {opt.desc}
                </p>

                <div className="p-3 rounded-xl bg-background-secondary border border-app-border space-y-1.5 mb-4 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-text">Component:</span>
                    <span className="text-primary-text">{opt.wearTarget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-text">Current Condition:</span>
                    <span className={`font-bold ${currentHealth < 60 ? 'text-danger' : currentHealth < 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {currentHealth}%
                    </span>
                  </div>
                  <ProgressBar
                    value={currentHealth}
                    color={currentHealth < 60 ? 'danger' : currentHealth < 85 ? 'warning' : 'success'}
                    showPercent={false}
                    size="sm"
                  />
                </div>
              </div>

              <Button
                variant={isWorn ? 'primary' : 'secondary'}
                size="md"
                glow={isWorn}
                className="w-full"
                onClick={() => handlePerformService(opt.part as any, opt.cost, opt.label)}
              >
                Perform Service (₹{opt.cost})
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Historical Service Logs */}
      <Card variant="default">
        <h4 className="text-sm font-bold text-primary-text mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <span>Vehicle Service History Records</span>
        </h4>

        <div className="space-y-2 text-xs font-mono">
          {selectedVehicle.serviceLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-app-border">
              <div>
                <span className="font-bold text-primary-text">{log.type}</span>
                <p className="text-[11px] text-muted-text mt-0.5">
                  {log.date} • {log.mileage.toLocaleString()} km • Parts: {log.parts.join(', ')}
                </p>
              </div>
              <span className="font-bold text-emerald-400">₹{log.cost}</span>
            </div>
          ))}

          {selectedVehicle.serviceLogs.length === 0 && (
            <p className="text-muted-text py-4 text-center">No previous maintenance logs on file.</p>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};
