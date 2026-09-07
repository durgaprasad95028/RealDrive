import React, { useState } from 'react';
import { RideshareCareerEngine, RidesharePassenger } from '../engine/RideshareCareerEngine';
import { FreightHaulingEngine, FreightContract } from '../engine/FreightHaulingEngine';
import { ExpressDeliveryEngine, ExpressDeliveryMission } from '../engine/ExpressDeliveryEngine';
import { Briefcase, Users, Truck, Package, Clock, ShieldAlert, Star, Check, X, MapPin } from 'lucide-react';

interface CareerDispatchModalProps {
  currentDistrict: string;
  driverLevel: number;
  onAcceptMission: (missionData: any, type: 'RIDESHARE' | 'FREIGHT' | 'EXPRESS') => void;
  onClose: () => void;
}

export const CareerDispatchModal: React.FC<CareerDispatchModalProps> = ({
  currentDistrict,
  driverLevel,
  onAcceptMission,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'RIDESHARE' | 'FREIGHT' | 'EXPRESS'>('RIDESHARE');

  const rideshareRequests = RideshareCareerEngine.generateAvailableRequests(currentDistrict, 'REAL_STANDARD', 1.35);
  const freightContracts = FreightHaulingEngine.generateAvailableContracts(driverLevel);
  const expressMissions = ExpressDeliveryEngine.generateAvailableMissions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Career Logistics & Professional Dispatch Center
              </h2>
              <p className="text-xs text-slate-400">
                Operating District: {currentDistrict} • Driver Level {driverLevel}
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

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('RIDESHARE')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all border-t border-x ${
              activeTab === 'RIDESHARE'
                ? 'bg-slate-900 text-emerald-400 border-slate-700 border-b-0'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Rideshare Dispatch ({rideshareRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('FREIGHT')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all border-t border-x ${
              activeTab === 'FREIGHT'
                ? 'bg-slate-900 text-blue-400 border-slate-700 border-b-0'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            Heavy Freight Logistics ({freightContracts.length})
          </button>

          <button
            onClick={() => setActiveTab('EXPRESS')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all border-t border-x ${
              activeTab === 'EXPRESS'
                ? 'bg-slate-900 text-amber-400 border-slate-700 border-b-0'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            Express Courier & Medical ({expressMissions.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'RIDESHARE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rideshareRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between space-y-3 hover:border-emerald-500/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{req.avatarIcon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-white">{req.name}</h4>
                          <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-current" /> {req.rating}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-emerald-400 font-mono">
                          ${req.baseFareCredits}
                        </div>
                        {req.surgeMultiplier > 1.0 && (
                          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                            {req.surgeMultiplier}x Surge
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 text-xs space-y-1 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pickup: {req.pickupLocationName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>Dropoff: {req.dropoffLocationName} ({req.distanceKm} km)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onAcceptMission(req, 'RIDESHARE');
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    Accept Passenger Fare
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'FREIGHT' && (
            <div className="space-y-4">
              {freightContracts.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-500/50 transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-base text-white">{c.title}</h4>
                      {c.hazardClass && (
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/40">
                          <ShieldAlert className="w-3 h-3" /> {c.hazardClass}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Route: {c.originHub} → {c.destinationHub} • {c.distanceKm} km
                    </p>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-1">
                      <span>Payload: {c.cargoWeightTons} Tons</span>
                      <span>Min HP: {c.minimumTruckHpRequired} HP</span>
                      <span>Time Limit: {c.timeLimitMinutes} mins</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    <div className="text-right">
                      <div className="text-2xl font-black text-blue-400 font-mono">
                        ${c.rewardCredits.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono">
                        +${c.bonusOnTimeCredits.toLocaleString()} On-Time Bonus
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onAcceptMission(c, 'FREIGHT');
                        onClose();
                      }}
                      className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all"
                    >
                      Sign Freight Bill of Lading
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'EXPRESS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expressMissions.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white">{m.title}</h4>
                      <div className="text-lg font-black text-amber-400 font-mono">
                        ${m.baseRewardCredits}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      Pickup: {m.pickupLocation} • {m.packages.length} Packages ({m.totalDistanceKm} km)
                    </p>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-300 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {Math.round(m.totalTimeLimitSec / 60)} mins
                      </span>
                      {m.isEmergencySirenPermitted && (
                        <span className="text-red-400 font-bold uppercase text-[10px] bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">
                          Code 3 Sirens Authorized
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onAcceptMission(m, 'EXPRESS');
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all"
                  >
                    Accept Courier Route
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
