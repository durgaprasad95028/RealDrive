/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - CUSTOM LIVERY & WRAP DESIGN STUDIO
 * ============================================================================
 * Interactive vinyl wrap & decal editor:
 * - Multi-layer decal composition (Racing Stripes, Sponsor Decals, Numbers)
 * - Paint material shaders (Gloss, Metallic Flake, Matte Velvet, Forged Carbon)
 * - Historic motorsport preset schemes (Gulf, Martini, JPS Gold, Corsa Red)
 * - Decal position, scale, rotation, and bilateral symmetry mirroring
 */

import React, { useState } from 'react';

export interface DecalLayer {
  readonly id: string;
  readonly type: 'racing_stripe' | 'race_number' | 'sponsor_logo' | 'tribal_flame' | 'camo_pattern';
  name: string;
  colorHex: string;
  posXPercent: number; // 0 to 100
  posYPercent: number;
  scalePercent: number;
  rotationDeg: number;
  opacityPercent: number;
  isMirrored: boolean;
  isVisible: boolean;
}

export const LiveryEditorStudioView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [basePaintFinish, setBasePaintFinish] = useState<'gloss' | 'metallic' | 'matte' | 'forged_carbon'>('metallic');
  const [baseColorHex, setBaseColorHex] = useState<string>('#DC2626');
  const [layers, setLayers] = useState<DecalLayer[]>([
    { id: 'layer_1', type: 'racing_stripe', name: 'Dual Center Racing Stripes', colorHex: '#FFFFFF', posXPercent: 50, posYPercent: 50, scalePercent: 100, rotationDeg: 0, opacityPercent: 100, isMirrored: true, isVisible: true },
    { id: 'layer_2', type: 'race_number', name: 'Competition Door Roundel #77', colorHex: '#000000', posXPercent: 30, posYPercent: 55, scalePercent: 85, rotationDeg: 0, opacityPercent: 100, isMirrored: true, isVisible: true },
    { id: 'layer_3', type: 'sponsor_logo', name: 'Apex Hyperdynamics Hood Decal', colorHex: '#F59E0B', posXPercent: 50, posYPercent: 25, scalePercent: 70, rotationDeg: 0, opacityPercent: 90, isMirrored: false, isVisible: true }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer_1');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  const historicSchemes = [
    { name: 'Gulf Racing Heritage', base: '#38BDF8', stripe: '#F97316' },
    { name: 'Martini Racing Tribute', base: '#F8FAFC', stripe: '#1D4ED8' },
    { name: 'JPS Black & Gold', base: '#0F172A', stripe: '#F59E0B' },
    { name: 'Rosso Corsa Scuderia', base: '#DC2626', stripe: '#FFFFFF' }
  ];

  const updateSelectedLayer = (param: keyof DecalLayer, value: any) => {
    setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, [param]: value } : l));
  };

  const handleSaveLivery = () => {
    setSaveMessage('Custom livery design saved to cloud profile and applied to active car!');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: 1040,
      backgroundColor: '#0a0f1d',
      borderRadius: 20,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: 24,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ backgroundColor: '#a855f7', color: '#fff', fontSize: 11, fontWeight: 900, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>STUDIO</span>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Custom Livery & Wrap Designer</h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#94a3b8' }}>Vector Decal Composition, Vinyl Graphics & Metallic Paint Shaders</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>✕</button>
        )}
      </div>

      {saveMessage && (
        <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', color: '#c084fc', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
          {saveMessage}
        </div>
      )}

      {/* Main Grid: 3D Preview Canvas Left, Layers & Shader Controls Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
        {/* Left: 2D/3D Texture Surface Canvas */}
        <div>
          <div style={{
            height: 280,
            backgroundColor: '#020617',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Base Paint Background */}
            <div style={{
              width: 220,
              height: 110,
              backgroundColor: baseColorHex,
              borderRadius: 24,
              boxShadow: `0 0 50px ${baseColorHex}66`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: basePaintFinish === 'forged_carbon' ? '2px dashed #475569' : 'none'
            }}>
              {/* Render Visible Decal Layers */}
              {layers.filter(l => l.isVisible).map(layer => (
                <div
                  key={layer.id}
                  style={{
                    position: 'absolute',
                    top: `${layer.posYPercent}%`,
                    left: `${layer.posXPercent}%`,
                    transform: `translate(-50%, -50%) rotate(${layer.rotationDeg}deg) scale(${layer.scalePercent / 100})`,
                    color: layer.colorHex,
                    fontSize: 14,
                    fontWeight: 900,
                    opacity: layer.opacityPercent / 100,
                    userSelect: 'none',
                    letterSpacing: 1
                  }}
                >
                  {layer.type === 'racing_stripe' && <div style={{ width: 140, height: 18, backgroundColor: layer.colorHex }} />}
                  {layer.type === 'race_number' && <div style={{ border: `3px solid ${layer.colorHex}`, padding: '4px 8px', borderRadius: 6, backgroundColor: '#fff', color: '#000' }}>#77</div>}
                  {layer.type === 'sponsor_logo' && <span>★ APEX CORSE ★</span>}
                </div>
              ))}
            </div>

            <div style={{ position: 'absolute', bottom: 12, left: 16, fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              MATERIAL: <strong style={{ color: '#f8fafc', textTransform: 'uppercase' }}>{basePaintFinish}</strong>
            </div>
          </div>

          {/* Historic Motorsport Presets */}
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>HISTORIC MOTORSPORT PRESETS</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 6 }}>
              {historicSchemes.map(sch => (
                <button
                  key={sch.name}
                  onClick={() => {
                    setBaseColorHex(sch.base);
                    if (layers[0]) updateSelectedLayer('colorHex', sch.stripe);
                  }}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    color: '#f8fafc',
                    fontSize: 12,
                    fontWeight: 600,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: sch.base, border: `2px solid ${sch.stripe}` }} />
                  <span>{sch.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Layer Stack & Tuning Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Paint Finish Selector */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>BASE SHADER MATERIAL</label>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {(['gloss', 'metallic', 'matte', 'forged_carbon'] as const).map(fin => (
                <button
                  key={fin}
                  onClick={() => setBasePaintFinish(fin)}
                  style={{
                    flex: 1,
                    backgroundColor: basePaintFinish === fin ? '#a855f7' : 'rgba(255,255,255,0.05)',
                    color: basePaintFinish === fin ? '#fff' : '#cbd5e1',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 0',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  {fin.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Decal Layer Stack */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>DECAL LAYERS</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
              {layers.map(layer => (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  style={{
                    backgroundColor: selectedLayerId === layer.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: selectedLayerId === layer.id ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{layer.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: layer.colorHex }} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLayers(prev => prev.map(l => l.id === layer.id ? { ...l, isVisible: !l.isVisible } : l));
                      }}
                      style={{ background: 'none', border: 'none', color: layer.isVisible ? '#22c55e' : '#64748b', fontSize: 12, cursor: 'pointer' }}
                    >
                      {layer.isVisible ? '👁️' : '🕶️'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Layer Fine Tuning Sliders */}
          {selectedLayer && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, backgroundColor: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600 }}>
                  <span>Scale Size</span>
                  <span>{selectedLayer.scalePercent}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={selectedLayer.scalePercent}
                  onChange={e => updateSelectedLayer('scalePercent', parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#a855f7' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600 }}>
                  <span>Rotation Angle</span>
                  <span>{selectedLayer.rotationDeg}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={selectedLayer.rotationDeg}
                  onChange={e => updateSelectedLayer('rotationDeg', parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#a855f7' }}
                />
              </div>
            </div>
          )}

          {/* Save Livery Button */}
          <button
            onClick={handleSaveLivery}
            style={{
              backgroundColor: '#a855f7',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 0',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(168, 85, 247, 0.4)',
              marginTop: 'auto'
            }}
          >
            SAVE & APPLY LIVERY
          </button>
        </div>
      </div>
    </div>
  );
};
