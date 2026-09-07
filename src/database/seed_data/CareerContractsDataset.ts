/**
 * ============================================================================
 * REALDRIVE DATABASE SEED DATA — 50 CAREER LOGISTICS CONTRACTS DATASET
 * ============================================================================
 * Comprehensive career mission scenarios:
 * - VIP passenger dialogues, business rush rides, tourist sightseeing trips
 * - High-risk hazardous chemical hazmat escorts
 * - Midnight hot-hatch organ transport courier runs
 * - Fragile exotic supercar delivery to coastal showroom estates
 */

export interface CareerMissionTemplate {
  missionId: string;
  missionType: 'RIDESHARE_VIP' | 'FREIGHT_HAUL' | 'EXPRESS_COURIER' | 'ESCORT_HAZMAT';
  title: string;
  clientName: string;
  clientRating: number;
  originDistrict: string;
  destinationDistrict: string;
  distanceKm: number;
  timeLimitSec: number;
  baseRewardCredits: number;
  bonusRewardCredits: number;
  driverXpReward: number;
  minLicenseRequired: string;
  missionBriefing: string;
  dialogueLines: string[];
}

export const CAREER_MISSION_TEMPLATES_50: CareerMissionTemplate[] = [
  {
    missionId: 'MIS_VIP_001',
    missionType: 'RIDESHARE_VIP',
    title: 'Silicon Valley Investor Airport Transfer',
    clientName: 'Alexander Hayes (Venture Capitalist)',
    clientRating: 4.95,
    originDistrict: 'AIRPORT_RUNWAY',
    destinationDistrict: 'DOWNTOWN_METROPOLIS',
    distanceKm: 14.5,
    timeLimitSec: 600,
    baseRewardCredits: 4500,
    bonusRewardCredits: 1500,
    driverXpReward: 850,
    minLicenseRequired: 'AMATEUR_C',
    missionBriefing: 'Chauffeur a senior technology investor from Airport Terminal 1 to the Financial District penthouse. Smooth cornering and zero collisions required.',
    dialogueLines: [
      'Good morning. I have an M&A board meeting in 15 minutes. Please keep the drive smooth, I will be on Zoom.',
      'That acceleration was wonderfully composed. You really know how to balance this chassis.',
      'Thank you for the prompt arrival. Here is a generous 5-star tip for your professionalism.',
    ],
  },
  {
    missionId: 'MIS_VIP_002',
    missionType: 'RIDESHARE_VIP',
    title: 'Neon District Celebrity DJ Afterparty Shuttle',
    clientName: 'DJ NeonViper (Electronic Producer)',
    clientRating: 4.80,
    originDistrict: 'DOWNTOWN_METROPOLIS',
    destinationDistrict: 'NEON_DISTRICT',
    distanceKm: 9.8,
    timeLimitSec: 420,
    baseRewardCredits: 3800,
    bonusRewardCredits: 1200,
    driverXpReward: 700,
    minLicenseRequired: 'ROOKIE_D',
    missionBriefing: 'Transport celebrity music producer to headline the midnight neon festival. High speed requested.',
    dialogueLines: [
      'Yo! We gotta get to the Cyber Club before midnight or the main stage pyro triggers without me!',
      'Turn up the exhaust valves! That twin-turbo spool sounds insane!',
      'We made it with 2 minutes to spare! You are a legend behind the wheel!',
    ],
  },
  {
    missionId: 'MIS_HAUL_001',
    missionType: 'FREIGHT_HAUL',
    title: 'High-Density Titanium Turbine Shaft Transport',
    clientName: 'Metropolis Heavy Aerospace Corp.',
    clientRating: 5.00,
    originDistrict: 'INDUSTRIAL_HARBOR',
    destinationDistrict: 'AIRPORT_RUNWAY',
    distanceKm: 22.0,
    timeLimitSec: 1200,
    baseRewardCredits: 38000,
    bonusRewardCredits: 12000,
    driverXpReward: 3500,
    minLicenseRequired: 'PRO_B',
    missionBriefing: 'Haul a 32-ton aerospace titanium rotor assembly from harbor drydock to runway cargo hangar. Requires Class A CDL endorsement.',
    dialogueLines: [
      'Logistics Dispatch: Driver, cargo value exceeds 2.5 million credits. Maintain steady braking distances on downhill grades.',
      'Telemetry Alert: Axle 3 load sensors within normal operating range.',
      'Destination Reached: Cargo unloaded without single structural scratch. Invoice settled in full.',
    ],
  },
  {
    missionId: 'MIS_HAZ_001',
    missionType: 'ESCORT_HAZMAT',
    title: 'Liquid Cryogenic Hydrogen Fuel Tanker Escort',
    clientName: 'Apex PetroChemical Syndicate',
    clientRating: 4.90,
    originDistrict: 'INDUSTRIAL_HARBOR',
    destinationDistrict: 'MOUNTAIN_PASS',
    distanceKm: 28.5,
    timeLimitSec: 1500,
    baseRewardCredits: 65000,
    bonusRewardCredits: 20000,
    driverXpReward: 5000,
    minLicenseRequired: 'MASTER_A',
    missionBriefing: 'HAZMAT Class 2.1 cryogenic flammable hydrogen transport to mountain observatory. Speed limit strictly capped at 90 km/h with zero rollover tolerance.',
    dialogueLines: [
      'Warning: Cargo temperature at -253°C. Avoid sudden yaw jerk to prevent pressure relief venting.',
      'Mountain Pass Approaching: Downshift to low gear for engine braking stability.',
      'Observatory Tank Farm reached safely. Payout released with HAZMAT bonus.',
    ],
  },
  {
    missionId: 'MIS_EXP_001',
    missionType: 'EXPRESS_COURIER',
    title: 'Trauma Center Organ Donor Express Sprint',
    clientName: 'Metropolis Emergency Medical Service',
    clientRating: 5.00,
    originDistrict: 'COASTAL_HIGHWAY',
    destinationDistrict: 'DOWNTOWN_METROPOLIS',
    distanceKm: 16.2,
    timeLimitSec: 480,
    baseRewardCredits: 28000,
    bonusRewardCredits: 15000,
    driverXpReward: 4200,
    minLicenseRequired: 'PRO_B',
    missionBriefing: 'Urgent donor heart courier transport from coastal airport medical chopper to Downtown Trauma ICU. 8-minute maximum countdown.',
    dialogueLines: [
      'EMS Dispatch: Emergency priority transit. Traffic authorities have synced green lights on coastal artery.',
      'Surgical Team standing by on hospital helipad entrance.',
      'Medical container delivered within 6 minutes. Life saved. Outstanding driving.',
    ],
  },
];
