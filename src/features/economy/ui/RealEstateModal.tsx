import React, { useState } from 'react';
import {
  GaragePropertyManager,
  GarageProperty,
  GaragePropertyUpgrade,
} from '../realestate/GaragePropertyManager';
import { Building2, Home, Star, Wrench, Shield, Check, X, MapPin } from 'lucide-react';

interface RealEstateModalProps {
  playerCredits: number;
  onBuyProperty: (propertyId: string, cost: number) => void;
  onClose: () => void;
}

export const RealEstateModal: React.FC<RealEstateModalProps> = ({
  playerCredits,
  onBuyProperty,
  onClose,
}) => {
  const [properties, setProperties] = useState<GarageProperty[]>(
    GaragePropertyManager.getAllProperties()
  );
  const [selectedProp, setSelectedProp] = useState<GarageProperty | null>(null);

  const handlePurchase = (prop: GarageProperty) => {
    if (playerCredits >= prop.purchasePriceCredits) {
      onBuyProperty(prop.id, prop.purchasePriceCredits);
      prop.isOwned = true;
      setProperties([...properties]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Metropolis Real Estate & Luxury Garage Portfolio
              </h2>
              <p className="text-xs text-slate-400">
                District Garages • Vehicle Storage • Custom Workshops
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                  p.isOwned
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-purple-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white">{p.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                        <span>{p.address} ({p.district})</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {p.isOwned ? (
                        <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Owned
                        </span>
                      ) : (
                        <div className="text-xl font-black text-purple-400 font-mono">
                          ${p.purchasePriceCredits.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">{p.description}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                    <div className="bg-slate-900 px-3 py-2 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">CAPACITY</span>
                      <span className="text-white font-bold">{p.vehicleCapacity} Vehicles</span>
                    </div>
                    <div className="bg-slate-900 px-3 py-2 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">WORKSHOP BAY</span>
                      <span className="text-amber-400 font-bold">
                        {p.hasDynoBay ? 'AWD Dyno Equipped' : 'Standard Detailing'}
                      </span>
                    </div>
                  </div>
                </div>

                {!p.isOwned && (
                  <button
                    onClick={() => handlePurchase(p)}
                    disabled={playerCredits < p.purchasePriceCredits}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all ${
                      playerCredits >= p.purchasePriceCredits
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Purchase Property Deed (${p.purchasePriceCredits.toLocaleString()})
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
