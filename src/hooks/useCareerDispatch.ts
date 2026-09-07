/**
 * ============================================================================
 * REALDRIVE FRONTEND HOOK - CAREER MISSIONS & DISPATCH CONTRACTS
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { CareerApiClient } from '../services/api/CareerApiClient';

export interface RideshareFareDto {
  fareId: string;
  passengerName: string;
  passengerRating: number;
  personality: string;
  pickupLocationName: string;
  destinationLocationName: string;
  estimatedDistanceKm: number;
  timeLimitSeconds: number;
  baseFareUSD: number;
  surgePricingMultiplier: number;
  passengerDialogueOnPickup: string;
}

export interface FreightContractDto {
  contractId: string;
  shipperCompanyName: string;
  cargoClassification: string;
  cargoDescription: string;
  cargoMassKg: number;
  originHub: string;
  destinationHub: string;
  routeDistanceKm: number;
  timeWindowMinutes: number;
  basePayUSD: number;
  fuelSurchargeUSD: number;
  onTimeBonusUSD: number;
}

export function useCareerDispatch() {
  const [rideshareFares, setRideshareFares] = useState<RideshareFareDto[]>([
    {
      fareId: 'fare_vip_exec_001',
      passengerName: 'Julian Sterling (Hedge Fund MD)',
      passengerRating: 4.9,
      personality: 'impatient_executive',
      pickupLocationName: 'Downtown Financial Plaza Tower 1',
      destinationLocationName: 'Oceanfront Pacific Private Helipad',
      estimatedDistanceKm: 6.8,
      timeLimitSeconds: 240,
      baseFareUSD: 85,
      surgePricingMultiplier: 1.8,
      passengerDialogueOnPickup: 'I have a private chopper in 4 minutes. Get me there fast!'
    },
    {
      fareId: 'fare_nightclub_002',
      passengerName: 'Chloe & Dave (Club Revelers)',
      passengerRating: 4.4,
      personality: 'motion_sick_fragile',
      pickupLocationName: 'Neon Strip Cyberclub Apex',
      destinationLocationName: 'Green Hills Suburbia Villa 42',
      estimatedDistanceKm: 8.5,
      timeLimitSeconds: 480,
      baseFareUSD: 45,
      surgePricingMultiplier: 2.2,
      passengerDialogueOnPickup: 'Please take it easy on the turns... Dave feels nauseous.'
    }
  ]);

  const [freightContracts, setFreightContracts] = useState<FreightContractDto[]>([
    {
      contractId: 'frt_exotic_transporter_001',
      shipperCompanyName: 'Apex Hyperdynamics Logistics',
      cargoClassification: 'luxury_exotics_transporter',
      cargoDescription: '4x Homologated Le Mans Prototype Hypercars for Season Finale',
      cargoMassKg: 6500,
      originHub: 'Apex Factory Headquarters (Downtown)',
      destinationHub: 'RealDrive International Speedway Paddock',
      routeDistanceKm: 18.5,
      timeWindowMinutes: 25,
      basePayUSD: 4500,
      fuelSurchargeUSD: 450,
      onTimeBonusUSD: 1500
    }
  ]);

  const [activeContractId, setActiveContractId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [faresRes, freightRes] = await Promise.all([
        CareerApiClient.getAvailableRideshareFares().catch(() => ({ fares: [] })),
        CareerApiClient.getFreightContracts().catch(() => ({ contracts: [] }))
      ]);

      if (faresRes?.fares?.length) setRideshareFares(faresRes.fares);
      if (freightRes?.contracts?.length) setFreightContracts(freightRes.contracts);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch career contracts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const acceptJob = useCallback((id: string) => {
    setActiveContractId(id);
  }, []);

  const completeJob = useCallback(async (id: string, deliveryTimeMin: number, damagePercent: number) => {
    try {
      await CareerApiClient.deliverFreight(id, 100 - damagePercent);
    } catch {
      // Offline fallback
    }
    setActiveContractId(null);
    return {
      success: true,
      payout: {
        totalPayoutUSD: 6450,
        summaryMessage: 'Cargo delivered on time with zero damage inspection.'
      }
    };
  }, []);

  return {
    rideshareFares,
    freightContracts,
    activeContractId,
    isLoading,
    error,
    refreshJobs: fetchJobs,
    acceptJob,
    completeJob
  };
}
