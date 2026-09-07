/**
 * ============================================================================
 * REALDRIVE AUDIO — PROCEDURAL ENGINE HARMONIC SYNTHESIZER
 * ============================================================================
 * Granular acoustic harmonic profiles for powertrain audio synthesis:
 * - Engine firing order harmonic frequency arrays (Fundamental F0 + odd/even overtones)
 * - Turbocharger spool high-frequency whistle & compressor surge acoustic flutter
 * - Straight-cut straight gear whine pitch generation (f = (RPM / 60) * gear_teeth)
 * - Exhaust pops & bangs anti-lag transient impulse bursts
 */

export interface AcousticHarmonicProfile {
  engineType: string;
  cylinderCount: number;
  fundamentalOrder: number; // e.g. 3.0 for V6, 4.0 for V8
  harmonics: Array<{ order: number; relativeGainDb: number; qFactor: number }>;
  turboWhistleCenterFreqHz: number;
  gearWhineTeethCount: number;
  backfirePopFrequencyRange: [number, number];
}

export class EngineSoundSynthesizerServer {
  public static readonly PROFILES: Record<string, AcousticHarmonicProfile> = {
    INLINE_4_TURBO: {
      engineType: 'Inline-4 Turbocharged (2.0L JDM)',
      cylinderCount: 4,
      fundamentalOrder: 2.0,
      harmonics: [
        { order: 2.0, relativeGainDb: 0, qFactor: 8 },
        { order: 4.0, relativeGainDb: -6, qFactor: 12 },
        { order: 6.0, relativeGainDb: -14, qFactor: 16 },
        { order: 8.0, relativeGainDb: -22, qFactor: 20 },
      ],
      turboWhistleCenterFreqHz: 2850,
      gearWhineTeethCount: 32,
      backfirePopFrequencyRange: [80, 450],
    },
    V6_TWINTURBO: {
      engineType: 'V6 60-Degree Twin-Turbo (3.8L VR38DETT)',
      cylinderCount: 6,
      fundamentalOrder: 3.0,
      harmonics: [
        { order: 3.0, relativeGainDb: 0, qFactor: 10 },
        { order: 6.0, relativeGainDb: -4, qFactor: 14 },
        { order: 9.0, relativeGainDb: -12, qFactor: 18 },
        { order: 12.0, relativeGainDb: -20, qFactor: 22 },
      ],
      turboWhistleCenterFreqHz: 3400,
      gearWhineTeethCount: 36,
      backfirePopFrequencyRange: [70, 520],
    },
    V8_CROSSPLANE: {
      engineType: 'V8 90-Degree Crossplane Muscle (6.2L Supercharged)',
      cylinderCount: 8,
      fundamentalOrder: 4.0,
      harmonics: [
        { order: 2.0, relativeGainDb: -3, qFactor: 6 }, // Sub-harmonic rumble
        { order: 4.0, relativeGainDb: 0, qFactor: 10 },
        { order: 8.0, relativeGainDb: -8, qFactor: 15 },
        { order: 16.0, relativeGainDb: -18, qFactor: 20 },
      ],
      turboWhistleCenterFreqHz: 1800, // Supercharger whine
      gearWhineTeethCount: 28,
      backfirePopFrequencyRange: [50, 380],
    },
    V10_HIGH_REV: {
      engineType: 'V10 72-Degree Naturally Aspirated (5.2L Screamer)',
      cylinderCount: 10,
      fundamentalOrder: 5.0,
      harmonics: [
        { order: 5.0, relativeGainDb: 0, qFactor: 15 },
        { order: 10.0, relativeGainDb: -2, qFactor: 20 },
        { order: 15.0, relativeGainDb: -10, qFactor: 25 },
        { order: 20.0, relativeGainDb: -16, qFactor: 30 },
      ],
      turboWhistleCenterFreqHz: 0,
      gearWhineTeethCount: 42,
      backfirePopFrequencyRange: [120, 680],
    },
  };

  public static getProfileForEngine(engineType: string): AcousticHarmonicProfile {
    return this.PROFILES[engineType] || this.PROFILES.V6_TWINTURBO;
  }
}
