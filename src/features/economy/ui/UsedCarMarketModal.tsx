import React, { useState } from 'react';
import {
  UsedCarMarketEngine,
  UsedCarListing,
  SellerPersonality,
} from '../marketplace/UsedCarMarketEngine';
import { ShoppingBag, Tag, FileText, AlertTriangle, Check, X, MessageSquare, DollarSign } from 'lucide-react';

interface UsedCarMarketModalProps {
  playerCredits: number;
  onBuyCar: (listing: UsedCarListing, finalPrice: number) => void;
  onClose: () => void;
}

export const UsedCarMarketModal: React.FC<UsedCarMarketModalProps> = ({
  playerCredits,
  onBuyCar,
  onClose,
}) => {
  const [listings, setListings] = useState<UsedCarListing[]>(
    UsedCarMarketEngine.generateMarketListings(8)
  );
  const [selectedListing, setSelectedListing] = useState<UsedCarListing | null>(null);
  const [offerInput, setOfferInput] = useState<number>(0);
  const [negotiationLog, setNegotiationLog] = useState<Array<{ sender: 'PLAYER' | 'SELLER'; msg: string }>>([]);

  const handleSelectListing = (listing: UsedCarListing) => {
    setSelectedListing(listing);
    setOfferInput(Math.round(listing.askingPriceCredits * 0.85));
    setNegotiationLog([
      {
        sender: 'SELLER',
        msg: `Hello! Thanks for your interest in my ${listing.year} ${listing.catalogEntry.name}. Asking $${listing.askingPriceCredits.toLocaleString()}. What are you thinking?`,
      },
    ]);
  };

  const handleMakeOffer = () => {
    if (!selectedListing) return;

    const offer = offerInput;
    const res = UsedCarMarketEngine.evaluateNegotiationOffer(selectedListing, offer);

    setNegotiationLog((prev) => [
      ...prev,
      { sender: 'PLAYER', msg: `How about $${offer.toLocaleString()} cash right now?` },
      { sender: 'SELLER', msg: res.sellerResponseMsg },
    ]);

    if (res.isAccepted) {
      setTimeout(() => {
        onBuyCar(selectedListing, offer);
        onClose();
      }, 1200);
    }
  };

  const handleBuyAskingPrice = () => {
    if (!selectedListing) return;
    if (playerCredits >= selectedListing.askingPriceCredits) {
      onBuyCar(selectedListing, selectedListing.askingPriceCredits);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Used Car Classifieds & Bargain Marketplace
              </h2>
              <p className="text-xs text-slate-400">
                Verified Listings • CarFax History • Direct Negotiation
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
          {!selectedListing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3 flex flex-col justify-between hover:border-amber-500/50 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-white">
                        {l.year} {l.catalogEntry.name}
                      </h4>
                      <div className="text-xl font-black text-amber-400 font-mono">
                        ${l.askingPriceCredits.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>{l.mileageKm.toLocaleString()} km</span>
                      <span>•</span>
                      <span>{l.previousOwnersCount} Owners</span>
                      <span>•</span>
                      <span className={l.titleStatus === 'CLEAN' ? 'text-emerald-400' : 'text-red-400'}>
                        {l.titleStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic">
                      "{l.sellerDescription}"
                    </p>

                    {/* Condition Mini Badges */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] font-mono">
                      <div className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-center">
                        <span className="text-slate-500 block text-[9px]">ENGINE</span>
                        <span className="text-emerald-400 font-bold">
                          {l.conditionReport.engineHealthPercent}%
                        </span>
                      </div>
                      <div className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-center">
                        <span className="text-slate-500 block text-[9px]">BRAKES</span>
                        <span className="text-blue-400 font-bold">
                          {l.conditionReport.brakePadThicknessMm} mm
                        </span>
                      </div>
                      <div className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-center">
                        <span className="text-slate-500 block text-[9px]">TIRES</span>
                        <span className="text-purple-400 font-bold">
                          {l.conditionReport.tireTreadDepthMm} mm
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectListing(l)}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all"
                  >
                    View Report & Negotiate
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Selected Car Negotiation View */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedListing(null)}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                ← Back to all listings
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Inspection Report */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        {selectedListing.year} {selectedListing.catalogEntry.name}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Seller: {selectedListing.sellerName} ({selectedListing.sellerLocationDistrict})
                      </p>
                    </div>
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      ${selectedListing.askingPriceCredits.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Odometer:</span>
                      <span className="font-mono text-white">
                        {selectedListing.mileageKm.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Title Status:</span>
                      <span className="font-bold text-emerald-400">
                        {selectedListing.titleStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Engine Compression:</span>
                      <span className="font-mono text-white">
                        {selectedListing.conditionReport.engineHealthPercent}% Spec
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transmission State:</span>
                      <span className="font-mono text-white">
                        {100 - selectedListing.conditionReport.transmissionWearPercent}% Healthy
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Oil Leak Status:</span>
                      <span className={selectedListing.conditionReport.hasOilLeak ? 'text-red-400' : 'text-emerald-400'}>
                        {selectedListing.conditionReport.hasOilLeak ? 'Minor Gasket Seep' : 'Dry / None'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBuyAskingPrice}
                    disabled={playerCredits < selectedListing.askingPriceCredits}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    Buy Immediately for Full Asking (${selectedListing.askingPriceCredits.toLocaleString()})
                  </button>
                </div>

                {/* AI Negotiation Chat Bay */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    Live Bargaining & Counter-Offer Chat
                  </h4>

                  <div className="h-48 overflow-y-auto space-y-3 p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                    {negotiationLog.map((log, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg max-w-[85%] ${
                          log.sender === 'PLAYER'
                            ? 'bg-amber-600/20 text-amber-200 border border-amber-500/30 ml-auto'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 mr-auto'
                        }`}
                      >
                        <span className="block font-bold text-[10px] text-slate-400 mb-0.5">
                          {log.sender === 'PLAYER' ? 'You' : selectedListing.sellerName}
                        </span>
                        {log.msg}
                      </div>
                    ))}
                  </div>

                  {/* Make Offer Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="number"
                      step={500}
                      value={offerInput}
                      onChange={(e) => setOfferInput(parseInt(e.target.value) || 0)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={handleMakeOffer}
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Make Offer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
