import React, { useState } from 'react';
import {
  TournamentCircuitEngine,
  ChampionshipSeason,
  RaceEventDefinition,
} from '../tournaments/TournamentCircuitEngine';
import { Trophy, Flag, Users, Award, Zap, Check, X, Calendar } from 'lucide-react';

interface TournamentHubModalProps {
  onSelectEvent: (event: RaceEventDefinition) => void;
  onClose: () => void;
}

export const TournamentHubModal: React.FC<TournamentHubModalProps> = ({
  onSelectEvent,
  onClose,
}) => {
  const [leagues, setLeagues] = useState<ChampionshipSeason[]>([
    ...TournamentCircuitEngine.LEAGUE_ROSTER,
  ]);
  const [selectedLeague, setSelectedLeague] = useState<ChampionshipSeason>(leagues[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Professional Racing Tournaments & Championship Leagues
              </h2>
              <p className="text-xs text-slate-400">
                Official Grand Prix Series • Touge Drift Battles • Underground Midnight Cups
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

        {/* League Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2">
          {leagues.map((lg) => (
            <button
              key={lg.id}
              onClick={() => setSelectedLeague(lg)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all border-t border-x ${
                selectedLeague.id === lg.id
                  ? 'bg-slate-900 text-amber-400 border-slate-700 border-b-0'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              {lg.name}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Round Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Event Details (2 Cols) */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-400" />
                Championship Round {selectedLeague.currentRound} of {selectedLeague.totalRounds}
              </h3>

              {selectedLeague.events.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4 hover:border-amber-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-white">{evt.title}</h4>
                      <p className="text-xs text-slate-400">
                        {evt.trackName} • {evt.district} • {evt.laps} Laps ({evt.trackDistanceKm} km)
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-amber-400 font-mono">
                        ${evt.prizeMoneyFirst.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">1st Place Purse</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="bg-slate-900 px-3 py-2 rounded border border-slate-800 text-center">
                      <span className="text-slate-500 block text-[10px]">GRID SIZE</span>
                      <span className="text-white font-bold">{evt.gridSize} Cars</span>
                    </div>
                    <div className="bg-slate-900 px-3 py-2 rounded border border-slate-800 text-center">
                      <span className="text-slate-500 block text-[10px]">WEATHER</span>
                      <span className="text-emerald-400 font-bold">{evt.weatherCondition}</span>
                    </div>
                    <div className="bg-slate-900 px-3 py-2 rounded border border-slate-800 text-center">
                      <span className="text-slate-500 block text-[10px]">TIER REQ</span>
                      <span className="text-purple-400 font-bold">Tier {evt.requiredTier}</span>
                    </div>
                  </div>

                  {/* AI Rivals Preview */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Top Rivals on Grid:</span>
                    <div className="space-y-1">
                      {evt.rivals.map((riv) => (
                        <div
                          key={riv.id}
                          className="flex items-center justify-between text-xs px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800"
                        >
                          <div className="flex items-center gap-2">
                            <span>{riv.avatarIcon}</span>
                            <span className="font-bold text-white">{riv.name}</span>
                            <span className="text-[10px] text-slate-500">({riv.vehicleName})</span>
                          </div>
                          <span className="text-amber-400 font-mono font-bold">{riv.driverSkillRating} OVR</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectEvent(evt);
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    Enter Grid & Start Race
                  </button>
                </div>
              ))}
            </div>

            {/* Standings Leaderboard (1 Col) */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Season Standings
              </h3>

              <div className="space-y-2">
                {selectedLeague.leaderboard.map((row, idx) => (
                  <div
                    key={row.driverName}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                      row.isPlayer
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-slate-500 w-4">#{idx + 1}</span>
                      <div>
                        <div className="font-bold">{row.driverName}</div>
                        <div className="text-[10px] text-slate-500">{row.vehicleName}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-sm">
                      {row.points} <span className="text-[10px] text-slate-500 font-normal">PTS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
