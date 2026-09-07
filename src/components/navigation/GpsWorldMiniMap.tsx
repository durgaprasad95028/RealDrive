/**
 * ============================================================================
 * REALDRIVE FRONTEND COMPONENT - GPS NAVIGATION MINI-MAP
 * ============================================================================
 * Rotating in-game GPS radar mini-map:
 * - Dynamic heading orientation (North-Up vs Heading-Up toggle)
 * - District topology road splines & highway flyover overlays
 * - Multi-target radar blips (Player, AI Traffic, Police Interceptors, Speed Traps)
 * - Turn-by-turn route waypoint guidance indicator
 */

import React, { useState } from 'react';

export interface MiniMapEntity {
  readonly id: string;
  readonly type: 'player' | 'multiplayer_rival' | 'traffic_civilian' | 'police_interceptor' | 'speed_radar_camera';
  readonly posX: number;
  readonly posZ: number;
  readonly headingDeg: number;
  readonly label?: string;
}

export interface GpsWorldMiniMapProps {
  readonly playerPosX: number;
  readonly playerPosZ: number;
  readonly playerHeadingDeg: number;
  readonly currentDistrictName: string;
  readonly nearbyEntities?: readonly MiniMapEntity[];
  readonly destinationCoords?: [number, number];
}

export const GpsWorldMiniMap: React.FC<GpsWorldMiniMapProps> = ({
  playerPosX,
  playerPosZ,
  playerHeadingDeg,
  currentDistrictName,
  nearbyEntities = [],
  destinationCoords = [1800, -400]
}) => {
  const [zoomScale, setZoomScale] = useState<number>(0.25); // Pixels per meter
  const [isHeadingUp, setIsHeadingUp] = useState<boolean>(true);

  const mapSizePx = 180;
  const centerPx = mapSizePx / 2;

  // Transform world coords to minimap screen coords relative to player
  const transformCoords = (x: number, z: number) => {
    const dx = x - playerPosX;
    const dz = z - playerPosZ;

    let rotX = dx;
    let rotZ = dz;

    if (isHeadingUp) {
      const headingRad = -(playerHeadingDeg * Math.PI) / 180.0;
      const cosH = Math.cos(headingRad);
      const sinH = Math.sin(headingRad);
      rotX = dx * cosH - dz * sinH;
      rotZ = dx * sinH + dz * cosH;
    }

    const screenX = centerPx + rotX * zoomScale;
    const screenY = centerPx - rotZ * zoomScale; // Invert Z for screen Y

    return { screenX, screenY };
  };

  const getBlipColor = (type: MiniMapEntity['type']) => {
    switch (type) {
      case 'player': return '#38bdf8';
      case 'multiplayer_rival': return '#a855f7';
      case 'traffic_civilian': return '#eab308';
      case 'police_interceptor': return '#ef4444';
      case 'speed_radar_camera': return '#f97316';
    }
  };

  const destPos = transformCoords(destinationCoords[0], destinationCoords[1]);
  const destDistM = Math.round(Math.sqrt(Math.pow(destinationCoords[0] - playerPosX, 2) + Math.pow(destinationCoords[1] - playerPosZ, 2)));

  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: 24,
      width: mapSizePx,
      height: mapSizePx + 42,
      backgroundColor: 'rgba(10, 15, 25, 0.90)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: 18,
      padding: 10,
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      userSelect: 'none',
      zIndex: 100,
      overflow: 'hidden'
    }}>
      {/* District Header Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
          {currentDistrictName}
        </span>
        <button
          onClick={() => setIsHeadingUp(!isHeadingUp)}
          style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 10, fontWeight: 700, cursor: 'pointer', padding: 0 }}
        >
          {isHeadingUp ? 'HEAD' : 'NORTH'}
        </button>
      </div>

      {/* Circular Radar Mini-Map Canvas */}
      <div style={{
        width: mapSizePx - 20,
        height: mapSizePx - 20,
        borderRadius: '50%',
        backgroundColor: '#020617',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto'
      }}>
        {/* Concentric Radar Distance Rings */}
        <div style={{ position: 'absolute', inset: '15%', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', inset: '35%', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.04)' }} />

        {/* Destination Waypoint Flag */}
        {destPos.screenX >= 0 && destPos.screenX <= (mapSizePx - 20) && destPos.screenY >= 0 && destPos.screenY <= (mapSizePx - 20) && (
          <div style={{
            position: 'absolute',
            left: destPos.screenX,
            top: destPos.screenY,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            boxShadow: '0 0 10px #22c55e',
            transform: 'translate(-50%, -50%)'
          }} />
        )}

        {/* Nearby Entities Blips */}
        {nearbyEntities.map(ent => {
          const { screenX, screenY } = transformCoords(ent.posX, ent.posZ);
          if (screenX < 0 || screenX > (mapSizePx - 20) || screenY < 0 || screenY > (mapSizePx - 20)) return null;

          return (
            <div
              key={ent.id}
              style={{
                position: 'absolute',
                left: screenX,
                top: screenY,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: getBlipColor(ent.type),
                boxShadow: `0 0 6px ${getBlipColor(ent.type)}`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}

        {/* Center Player Vehicle Marker */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '12px solid #38bdf8',
          transform: isHeadingUp ? 'translate(-50%, -50%)' : `translate(-50%, -50%) rotate(${playerHeadingDeg}deg)`,
          filter: 'drop-shadow(0 0 6px #38bdf8)'
        }} />
      </div>

      {/* Destination Waypoint Guidance Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 11, color: '#cbd5e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: '#22c55e' }}>🏁</span>
          <span style={{ fontWeight: 700 }}>{destDistM}m</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setZoomScale(Math.min(0.60, zoomScale + 0.1))}
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 4, width: 20, height: 18, fontSize: 10, cursor: 'pointer' }}
          >
            +
          </button>
          <button
            onClick={() => setZoomScale(Math.max(0.10, zoomScale - 0.1))}
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 4, width: 20, height: 18, fontSize: 10, cursor: 'pointer' }}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};
