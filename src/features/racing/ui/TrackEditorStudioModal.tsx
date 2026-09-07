import React, { useState } from 'react';
import {
  ProceduralTrackEditor,
  CustomTrackDesign,
  TrackSplineNode,
  SurfaceMaterialType,
} from '../trackeditor/ProceduralTrackEditor';
import { Route, Plus, Trash2, Check, X, Sliders, Play, Save, Share2 } from 'lucide-react';

interface TrackEditorStudioModalProps {
  onSaveTrack: (track: CustomTrackDesign) => void;
  onClose: () => void;
}

export const TrackEditorStudioModal: React.FC<TrackEditorStudioModalProps> = ({
  onSaveTrack,
  onClose,
}) => {
  const [track, setTrack] = useState<CustomTrackDesign>({
    id: `custom_track_${Date.now()}`,
    title: 'Metropolis Grand Prix Raceway',
    authorName: 'Player Architect',
    description: 'High-speed street circuit featuring technical chicanes and banking curves.',
    isClosedCircuit: true,
    totalLengthMeters: 3800,
    cornersCount: 14,
    elevationChangeMeters: 28,
    nodes: [
      {
        id: 'node_0',
        position: { x: 0, y: 0, z: 0 },
        bankAngleDegrees: 0,
        trackWidthMeters: 14,
        surface: 'RACING_ASPHALT',
        hasCurbLeft: true,
        hasCurbRight: true,
        hasTireBarrier: false,
        isTimingSectorGate: true,
        sectorIndex: 1,
      },
      {
        id: 'node_1',
        position: { x: 450, y: 5, z: 200 },
        bankAngleDegrees: 3.5,
        trackWidthMeters: 14,
        surface: 'RACING_ASPHALT',
        hasCurbLeft: true,
        hasCurbRight: false,
        hasTireBarrier: true,
        isTimingSectorGate: false,
      },
      {
        id: 'node_2',
        position: { x: 600, y: 15, z: 750 },
        bankAngleDegrees: 6.0,
        trackWidthMeters: 12,
        surface: 'RACING_ASPHALT',
        hasCurbLeft: false,
        hasCurbRight: true,
        hasTireBarrier: true,
        isTimingSectorGate: true,
        sectorIndex: 2,
      },
      {
        id: 'node_3',
        position: { x: 100, y: 8, z: 950 },
        bankAngleDegrees: 0,
        trackWidthMeters: 16,
        surface: 'RACING_ASPHALT',
        hasCurbLeft: true,
        hasCurbRight: true,
        hasTireBarrier: false,
        isTimingSectorGate: false,
      },
      {
        id: 'node_4',
        position: { x: -300, y: 0, z: 450 },
        bankAngleDegrees: -4.0,
        trackWidthMeters: 14,
        surface: 'RACING_ASPHALT',
        hasCurbLeft: true,
        hasCurbRight: false,
        hasTireBarrier: false,
        isTimingSectorGate: true,
        sectorIndex: 3,
      },
    ],
    createdTimestamp: Date.now(),
  });

  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const selectedNode = track.nodes[selectedNodeIndex];

  const validation = ProceduralTrackEditor.validateTrack(track);

  const handleAddNode = () => {
    const lastNode = track.nodes[track.nodes.length - 1];
    const newNode: TrackSplineNode = {
      id: `node_${track.nodes.length}`,
      position: { x: lastNode.position.x + 150, y: lastNode.position.y, z: lastNode.position.z + 150 },
      bankAngleDegrees: 0,
      trackWidthMeters: 14,
      surface: 'RACING_ASPHALT',
      hasCurbLeft: true,
      hasCurbRight: true,
      hasTireBarrier: false,
      isTimingSectorGate: false,
    };
    setTrack({ ...track, nodes: [...track.nodes, newNode] });
    setSelectedNodeIndex(track.nodes.length);
  };

  const handleDeleteNode = (index: number) => {
    if (track.nodes.length <= 4) return;
    const newNodes = track.nodes.filter((_, i) => i !== index);
    setTrack({ ...track, nodes: newNodes });
    setSelectedNodeIndex(Math.max(0, index - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Route className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Procedural Race Track Architect & Spline Studio
              </h2>
              <p className="text-xs text-slate-400">
                Custom Circuit Layouts • Corner Banking • Curbs & Timing Sectors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Track Summary Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Length
              </span>
              <div className="text-3xl font-black text-cyan-400 mt-1 font-mono">
                {validation.stats.totalLengthM.toLocaleString()}
                <span className="text-sm font-normal text-slate-500 ml-1">meters</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Spline Nodes
              </span>
              <div className="text-3xl font-black text-white mt-1 font-mono">
                {track.nodes.length}
                <span className="text-sm font-normal text-slate-500 ml-1">waypoints</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Max Slope
              </span>
              <div className="text-3xl font-black text-amber-400 mt-1 font-mono">
                {validation.stats.maxSlopePct}%
                <span className="text-sm font-normal text-slate-500 ml-1">gradient</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Circuit Type
              </span>
              <div className="text-xl font-black text-emerald-400 mt-2 font-mono">
                {track.isClosedCircuit ? 'Closed Loop Circuit' : 'Point-to-Point Sprint'}
              </div>
            </div>
          </div>

          {/* 2D Canvas Track Top-Down Preview */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>TOP-DOWN 2D CIRCUIT MAP</span>
              <span className="text-slate-500">Click node below to edit coordinates & banking</span>
            </div>

            <div className="w-full h-48 bg-slate-900/60 rounded-lg border border-slate-800 relative flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="-400 -200 1200 1200">
                {/* Track Centerline Path */}
                <path
                  d={`M ${track.nodes.map((n) => `${n.position.x + 100},${n.position.z}`).join(' L ')} ${
                    track.isClosedCircuit ? 'Z' : ''
                  }`}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={`M ${track.nodes.map((n) => `${n.position.x + 100},${n.position.z}`).join(' L ')} ${
                    track.isClosedCircuit ? 'Z' : ''
                  }`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                />

                {/* Node Handles */}
                {track.nodes.map((n, idx) => (
                  <circle
                    key={n.id}
                    cx={n.position.x + 100}
                    cy={n.position.z}
                    r={selectedNodeIndex === idx ? 16 : 10}
                    fill={selectedNodeIndex === idx ? '#f59e0b' : '#3b82f6'}
                    stroke="#ffffff"
                    strokeWidth="3"
                    className="cursor-pointer"
                    onClick={() => setSelectedNodeIndex(idx)}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Node Editor Controls */}
          {selectedNode && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Editing Waypoint #{selectedNodeIndex + 1} ({selectedNode.id})
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddNode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Insert Waypoint
                  </button>
                  {track.nodes.length > 4 && (
                    <button
                      onClick={() => handleDeleteNode(selectedNodeIndex)}
                      className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-800 text-red-400 hover:text-white border border-red-500/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Bank Angle */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Corner Bank Camber</span>
                    <span className="text-cyan-400 font-mono">{selectedNode.bankAngleDegrees}°</span>
                  </div>
                  <input
                    type="range"
                    min={-15}
                    max={15}
                    step={1}
                    value={selectedNode.bankAngleDegrees}
                    onChange={(e) => {
                      selectedNode.bankAngleDegrees = parseInt(e.target.value);
                      setTrack({ ...track });
                    }}
                    className="w-full accent-cyan-500"
                  />
                </div>

                {/* Track Width */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Track Width</span>
                    <span className="text-blue-400 font-mono">{selectedNode.trackWidthMeters} m</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={22}
                    step={1}
                    value={selectedNode.trackWidthMeters}
                    onChange={(e) => {
                      selectedNode.trackWidthMeters = parseInt(e.target.value);
                      setTrack({ ...track });
                    }}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* Elevation Y */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Elevation Height</span>
                    <span className="text-amber-400 font-mono">{selectedNode.position.y} m</span>
                  </div>
                  <input
                    type="range"
                    min={-20}
                    max={80}
                    step={2}
                    value={selectedNode.position.y}
                    onChange={(e) => {
                      selectedNode.position.y = parseInt(e.target.value);
                      setTrack({ ...track });
                    }}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 px-6 py-4 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs">
            {validation.isValid ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Check className="w-4 h-4" /> Track Validated for RealDrive Simulation
              </span>
            ) : (
              <span className="text-red-400 font-bold">{validation.errors[0]}</span>
            )}
          </div>

          <button
            onClick={() => {
              if (validation.isValid) {
                onSaveTrack(track);
                onClose();
              }
            }}
            disabled={!validation.isValid}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg transition-all ${
              validation.isValid
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Save Track Circuit
          </button>
        </div>
      </div>
    </div>
  );
};
