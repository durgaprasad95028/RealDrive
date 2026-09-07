import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Eye, 
  ShieldCheck, 
  User, 
  RotateCcw, 
  Check,
  Zap,
  Gauge,
  Monitor
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Switch } from '../../components/common/Switch';
import { Slider } from '../../components/common/Slider';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

interface SettingsPageProps {
  onNavigate: (path: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { settings, updateSettings, resetAllDemoData, user, driver } = useGame();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleToggle = (key: keyof typeof settings, val: boolean) => {
    updateSettings({ [key]: val });
    showSaveIndicator();
  };

  const showSaveIndicator = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleResetConfirm = () => {
    resetAllDemoData();
    setResetModalOpen(false);
    onNavigate('/login');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Simulation Settings & Preferences"
        subtitle="Configure automotive physics assists, audio telemetry volume, control bindings, and visual display options"
        actions={
          savedFeedback && (
            <Badge variant="success" size="md" dot>
              PREFERENCES PERSISTED
            </Badge>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driving Physics & Assists */}
        <Card variant="default">
          <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-sky-400" />
            <span>Driving Physics & Assists</span>
          </h3>

          <div className="space-y-4 divide-y divide-app-border/60">
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                Transmission Gearbox
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { updateSettings({ transmission: 'Automatic' }); showSaveIndicator(); }}
                  className={`p-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                    settings.transmission === 'Automatic'
                      ? 'bg-blue-950/60 border-sky-400 text-sky-300 shadow-glow-blue'
                      : 'bg-surface border-app-border text-secondary-text'
                  }`}
                >
                  Automatic (PRND)
                </button>
                <button
                  type="button"
                  onClick={() => { updateSettings({ transmission: 'Manual' }); showSaveIndicator(); }}
                  className={`p-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                    settings.transmission === 'Manual'
                      ? 'bg-blue-950/60 border-sky-400 text-sky-300 shadow-glow-blue'
                      : 'bg-surface border-app-border text-secondary-text'
                  }`}
                >
                  Manual Sequential (Q/E)
                </button>
              </div>
            </div>

            <div className="pt-3">
              <Switch
                checked={settings.showSpeedLimitAlert}
                onChange={(val) => handleToggle('showSpeedLimitAlert', val)}
                label="Audible Speed Limit Radar Warning"
                description="Trigger visual and audio chimes when exceeding posted zone limits"
              />
            </div>

            <div className="pt-3">
              <Switch
                checked={settings.autoBrakeAssist}
                onChange={(val) => handleToggle('autoBrakeAssist', val)}
                label="Autonomous Emergency Braking (AEB)"
                description="Applies emergency braking before front-end collisions"
              />
            </div>

            <div className="pt-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary-text mb-2">
                Measurement Units
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { updateSettings({ measurementUnit: 'metric' }); showSaveIndicator(); }}
                  className={`p-3 rounded-xl border text-xs font-mono font-bold ${
                    settings.measurementUnit === 'metric'
                      ? 'bg-blue-950/60 border-sky-400 text-sky-300'
                      : 'bg-surface border-app-border text-secondary-text'
                  }`}
                >
                  Metric (KM/H, Liters)
                </button>
                <button
                  type="button"
                  onClick={() => { updateSettings({ measurementUnit: 'imperial' }); showSaveIndicator(); }}
                  className={`p-3 rounded-xl border text-xs font-mono font-bold ${
                    settings.measurementUnit === 'imperial'
                      ? 'bg-blue-950/60 border-sky-400 text-sky-300'
                      : 'bg-surface border-app-border text-secondary-text'
                  }`}
                >
                  Imperial (MPH, Gallons)
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Audio Telemetry System */}
        <Card variant="default">
          <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <span>Audio Telemetry Synthesizer</span>
          </h3>

          <div className="space-y-6">
            <Switch
              checked={settings.soundEnabled}
              onChange={(val) => handleToggle('soundEnabled', val)}
              label="Master Web Audio API Sound"
              description="Enable real-time engine pitching, gear shift clicks, and indicators"
            />

            <Slider
              label="Master Volume"
              unit="%"
              value={settings.soundVolume}
              min={0}
              max={100}
              onChange={(val) => { updateSettings({ soundVolume: val }); showSaveIndicator(); }}
              disabled={!settings.soundEnabled}
            />

            <Slider
              label="Engine Exhaust & RPM Pitch"
              unit="%"
              value={settings.engineVolume}
              min={0}
              max={100}
              onChange={(val) => { updateSettings({ engineVolume: val }); showSaveIndicator(); }}
              disabled={!settings.soundEnabled}
            />

            <Slider
              label="Cockpit UI & Blinker Click Volume"
              unit="%"
              value={settings.uiVolume}
              min={0}
              max={100}
              onChange={(val) => { updateSettings({ uiVolume: val }); showSaveIndicator(); }}
              disabled={!settings.soundEnabled}
            />
          </div>
        </Card>

        {/* Display & Visual Telemetry HUD */}
        <Card variant="default">
          <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-emerald-400" />
            <span>Display & Visual Telemetry</span>
          </h3>

          <div className="space-y-4">
            <Switch
              checked={settings.showMinimap}
              onChange={(val) => handleToggle('showMinimap', val)}
              label="HUD MiniMap Overlay"
              description="Display radar sweep and waypoint directions in driving cockpit"
            />

            <Switch
              checked={settings.showTelemetry}
              onChange={(val) => handleToggle('showTelemetry', val)}
              label="Pedal & G-Force Telemetry Grid"
              description="Display real-time throttle and brake input bars"
            />

            <Switch
              checked={settings.reducedMotion}
              onChange={(val) => handleToggle('reducedMotion', val)}
              label="Reduced Motion Mode"
              description="Disable decorative gauge pulse animations"
            />
          </div>
        </Card>

        {/* Account & Demo Reset Zone */}
        <Card variant="default">
          <h3 className="text-base font-bold text-primary-text mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            <span>Account & Simulation State</span>
          </h3>

          <div className="p-4 rounded-xl bg-background-secondary border border-app-border space-y-2 font-mono text-xs mb-6">
            <div className="flex justify-between">
              <span className="text-muted-text">Logged In User:</span>
              <span className="font-bold text-primary-text">{user?.username} ({user?.role})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-text">Driver Profile:</span>
              <span className="text-sky-400">{driver?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-text">Persistence Engine:</span>
              <span className="text-emerald-400">LocalStorage Safe Sync</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="danger"
              size="md"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="w-full"
              onClick={() => setResetModalOpen(true)}
            >
              Reset All Simulation Demo Data
            </Button>
          </div>
        </Card>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset All Simulation State"
        subtitle="Clear LocalStorage and restore initial factory demo state"
      >
        <div className="space-y-4">
          <p className="text-xs text-secondary-text leading-relaxed">
            This action will clear all custom cars, completed jobs, wallet transactions, and driver licenses stored in your browser's LocalStorage and reset RealDrive back to the default demo state.
          </p>

          <div className="flex justify-end gap-2 pt-4 border-t border-app-border">
            <Button variant="ghost" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" glow onClick={handleResetConfirm}>
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};
