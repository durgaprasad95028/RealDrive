import React, { useState } from 'react';
import {
  LiveryEditorStudio,
  VehiclePaintScheme,
  PaintFinishType,
  DecalLayer,
  DecalPlacementRegion,
} from '../tuning/LiveryEditorStudio';
import { Palette, Sparkles, Layers, Share2, Check, X, Plus, Trash2 } from 'lucide-react';

interface LiveryEditorModalProps {
  vehicleName: string;
  initialScheme?: Partial<VehiclePaintScheme>;
  playerCredits: number;
  onSaveLivery: (scheme: VehiclePaintScheme, cost: number) => void;
  onClose: () => void;
}

export const LiveryEditorModal: React.FC<LiveryEditorModalProps> = ({
  vehicleName,
  initialScheme,
  playerCredits,
  onSaveLivery,
  onClose,
}) => {
  const presets = LiveryEditorStudio.getPresetLiveries();

  const [paintScheme, setPaintScheme] = useState<VehiclePaintScheme>({
    primaryFinish: (initialScheme?.primaryFinish as PaintFinishType) || 'GLOSS',
    primaryColorHex: initialScheme?.primaryColorHex || 0x1b4f72,
    secondaryFinish: (initialScheme?.secondaryFinish as PaintFinishType) || 'MATTE_SILK',
    secondaryColorHex: initialScheme?.secondaryColorHex || 0x111111,
    brakeCaliperColorHex: initialScheme?.brakeCaliperColorHex || 0xe74c3c,
    rimColorHex: initialScheme?.rimColorHex || 0xcccccc,
    rimFinish: (initialScheme?.rimFinish as PaintFinishType) || 'GLOSS',
    windowTintPercent: initialScheme?.windowTintPercent || 35,
    tireLetteringText: initialScheme?.tireLetteringText || 'REALDRIVE',
    underglowNeonColorHex: initialScheme?.underglowNeonColorHex || 0x00ffff,
    layers: initialScheme?.layers || [],
  });

  const [activeTab, setActiveTab] = useState<'PAINT' | 'DECALS' | 'NEON' | 'PRESETS'>('PAINT');
  const [shareCode, setShareCode] = useState<string>('');

  const finishTypes: PaintFinishType[] = [
    'GLOSS',
    'METALLIC_FLAKE',
    'MATTE_SILK',
    'SATIN_FROSTED',
    'PEARLESCENT_CHAMELEON',
    'CHROME_MIRROR',
    'CARBON_FIBER_TWILL',
    'FORGED_COMPOSITE_CARBON',
  ];

  const colorPalette = [
    { name: 'Velocity Blue', hex: 0x1b4f72 },
    { name: 'Rosso Corsa', hex: 0xc0392b },
    { name: 'Acid Green', hex: 0x27ae60 },
    { name: 'Viper Yellow', hex: 0xf1c40f },
    { name: 'Papaya Orange', hex: 0xe67e22 },
    { name: 'Ultra Violet', hex: 0x6c3483 },
    { name: 'Nardo Grey', hex: 0x7f8c8d },
    { name: 'Tuxedo Black', hex: 0x111111 },
    { name: 'Alpine White', hex: 0xfdfefe },
    { name: 'Miami Teal', hex: 0x16a085 },
  ];

  const handleApplyPreset = (presetScheme: VehiclePaintScheme) => {
    setPaintScheme({ ...presetScheme });
  };

  const handleGenerateShareCode = () => {
    const code = LiveryEditorStudio.generateShareCode(paintScheme);
    setShareCode(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Livery, Wrap & Custom Paint Studio
              </h2>
              <p className="text-xs text-slate-400">{vehicleName} • Multi-Layer Customizer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2">
          {(['PAINT', 'DECALS', 'NEON', 'PRESETS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all border-t border-x ${
                activeTab === tab
                  ? 'bg-slate-900 text-pink-400 border-slate-700 border-b-0'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'PAINT' && (
            <div className="space-y-6">
              {/* Primary Paint Finish */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Primary Body Finish
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {finishTypes.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setPaintScheme({ ...paintScheme, primaryFinish: finish })}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        paintScheme.primaryFinish === finish
                          ? 'bg-pink-600 text-white border-pink-400 shadow-md shadow-pink-600/30'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {finish.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Color Palette */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Primary Paint Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {colorPalette.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setPaintScheme({ ...paintScheme, primaryColorHex: color.hex })}
                      className={`w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center ${
                        paintScheme.primaryColorHex === color.hex
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: `#${color.hex.toString(16).padStart(6, '0')}` }}
                      title={color.name}
                    >
                      {paintScheme.primaryColorHex === color.hex && <Check className="w-5 h-5 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brake Calipers & Rims */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Brake Caliper Paint
                  </label>
                  <div className="flex gap-2">
                    {[0xe74c3c, 0xf1c40f, 0x2ecc71, 0x3498db, 0x9b59b6, 0x111111].map((hex) => (
                      <button
                        key={hex}
                        onClick={() => setPaintScheme({ ...paintScheme, brakeCaliperColorHex: hex })}
                        className={`w-9 h-9 rounded-lg border-2 ${
                          paintScheme.brakeCaliperColorHex === hex ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: `#${hex.toString(16).padStart(6, '0')}` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Window Tint Darkness ({paintScheme.windowTintPercent}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={95}
                    step={5}
                    value={paintScheme.windowTintPercent}
                    onChange={(e) =>
                      setPaintScheme({ ...paintScheme, windowTintPercent: parseInt(e.target.value) })
                    }
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'NEON' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Underglow Neon Underbody Illumination
              </label>
              <div className="flex flex-wrap gap-4">
                {[0x00ffff, 0xff0055, 0x00ff44, 0xffaa00, 0x9900ff, 0xffffff, 0x000000].map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setPaintScheme({ ...paintScheme, underglowNeonColorHex: hex })}
                    className={`px-5 py-3 rounded-xl border-2 font-bold text-xs flex items-center gap-2 ${
                      paintScheme.underglowNeonColorHex === hex
                        ? 'border-white text-white shadow-lg'
                        : 'border-slate-800 text-slate-400'
                    }`}
                    style={{
                      boxShadow:
                        paintScheme.underglowNeonColorHex === hex
                          ? `0 0 15px #${hex.toString(16).padStart(6, '0')}`
                          : 'none',
                    }}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: `#${hex.toString(16).padStart(6, '0')}` }}
                    />
                    {hex === 0 ? 'Disabled' : `#${hex.toString(16).padStart(6, '0').toUpperCase()}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'PRESETS' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {presets.map((p) => (
                <div
                  key={p.name}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white">{p.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {p.scheme.primaryFinish} • {p.scheme.layers.length} Decal Layers
                    </p>
                  </div>
                  <button
                    onClick={() => handleApplyPreset(p.scheme)}
                    className="w-full py-2 rounded-lg bg-pink-600/30 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/40 text-xs font-bold uppercase transition-all"
                  >
                    Apply Preset
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateShareCode}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              <Share2 className="w-4 h-4" />
              {shareCode ? `Code: ${shareCode}` : 'Generate Share Code'}
            </button>
          </div>

          <button
            onClick={() => {
              onSaveLivery(paintScheme, 800);
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/30 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            Apply Paint & Save Scheme ($800)
          </button>
        </div>
      </div>
    </div>
  );
};
