/**
 * LiveryEditorStudio — Multi-Layer Decal, Wrap & Procedural Paint Customization Engine
 */

export type PaintFinishType =
  | 'GLOSS'
  | 'METALLIC_FLAKE'
  | 'MATTE_SILK'
  | 'SATIN_FROSTED'
  | 'PEARLESCENT_CHAMELEON'
  | 'CHROME_MIRROR'
  | 'CARBON_FIBER_TWILL'
  | 'FORGED_COMPOSITE_CARBON';

export type DecalPlacementRegion = 'HOOD' | 'ROOF' | 'LEFT_SIDE' | 'RIGHT_SIDE' | 'REAR' | 'FRONT_BUMPER' | 'WING';

export type DecalCategory =
  | 'RACING_STRIPES'
  | 'SPONSOR_LOGOS'
  | 'NUMBERS_BADGES'
  | 'JAPANESE_KANJI'
  | 'GEOMETRIC_CAMO'
  | 'FLAMES_TRIBAL'
  | 'CYBER_CIRCUITS'
  | 'MANUFACTURER_EMBLEMS';

export interface DecalLayer {
  id: string;
  name: string;
  category: DecalCategory;
  region: DecalPlacementRegion;
  posX: number; // -100 to +100
  posY: number; // -100 to +100
  scaleX: number; // 0.1 to 5.0
  scaleY: number; // 0.1 to 5.0
  rotationDeg: number; // 0 to 360
  colorHex: number;
  opacity: number; // 0.0 to 1.0
  isMirrored: boolean;
  blendMode: 'NORMAL' | 'MULTIPLY' | 'SCREEN' | 'OVERLAY';
}

export interface VehiclePaintScheme {
  primaryFinish: PaintFinishType;
  primaryColorHex: number;
  secondaryFinish: PaintFinishType;
  secondaryColorHex: number;
  brakeCaliperColorHex: number;
  rimColorHex: number;
  rimFinish: PaintFinishType;
  windowTintPercent: number; // 0% (clear) to 95% (limo black)
  tireLetteringText: string;
  headlightTintHex?: number;
  underglowNeonColorHex?: number;
  layers: DecalLayer[];
}

export class LiveryEditorStudio {
  /**
   * Generates a unique 9-digit alphanumeric share code for a livery design
   */
  public static generateShareCode(scheme: VehiclePaintScheme): string {
    const jsonStr = JSON.stringify(scheme);
    let hash = 0;
    for (let i = 0; i < jsonStr.length; i++) {
      hash = (hash << 5) - hash + jsonStr.charCodeAt(i);
      hash |= 0;
    }
    const code = Math.abs(hash).toString(36).toUpperCase().padStart(8, '0');
    return `${code.slice(0, 4)}-${code.slice(4, 8)}`;
  }

  /**
   * Preset livery designs
   */
  public static getPresetLiveries(): Array<{ name: string; scheme: VehiclePaintScheme }> {
    return [
      {
        name: 'Gulf Heritage Blue & Orange Racing',
        scheme: {
          primaryFinish: 'GLOSS',
          primaryColorHex: 0x5dade2,
          secondaryFinish: 'GLOSS',
          secondaryColorHex: 0xe67e22,
          brakeCaliperColorHex: 0xe67e22,
          rimColorHex: 0x111111,
          rimFinish: 'MATTE_SILK',
          windowTintPercent: 40,
          tireLetteringText: 'REALDRIVE RACING',
          underglowNeonColorHex: 0x5dade2,
          layers: [
            {
              id: 'layer_center_stripe',
              name: 'Wide Center Racing Stripe',
              category: 'RACING_STRIPES',
              region: 'HOOD',
              posX: 0,
              posY: 0,
              scaleX: 1.5,
              scaleY: 4.0,
              rotationDeg: 0,
              colorHex: 0xe67e22,
              opacity: 1.0,
              isMirrored: false,
              blendMode: 'NORMAL',
            },
            {
              id: 'layer_number_roundel',
              name: 'Classic Number 07 Roundel',
              category: 'NUMBERS_BADGES',
              region: 'LEFT_SIDE',
              posX: 10,
              posY: 0,
              scaleX: 1.2,
              scaleY: 1.2,
              rotationDeg: 0,
              colorHex: 0xffffff,
              opacity: 1.0,
              isMirrored: true,
              blendMode: 'NORMAL',
            },
          ],
        },
      },
      {
        name: 'Cyberpunk Neon Drift Specialist',
        scheme: {
          primaryFinish: 'MATTE_SILK',
          primaryColorHex: 0x17202a,
          secondaryFinish: 'CHROME_MIRROR',
          secondaryColorHex: 0x00ffcc,
          brakeCaliperColorHex: 0xff0055,
          rimColorHex: 0x00ffcc,
          rimFinish: 'GLOSS',
          windowTintPercent: 80,
          tireLetteringText: 'TOKYO MIDNIGHT',
          underglowNeonColorHex: 0xff0055,
          layers: [
            {
              id: 'layer_kanji_drift',
              name: 'Touge Speed Kanji',
              category: 'JAPANESE_KANJI',
              region: 'LEFT_SIDE',
              posX: -15,
              posY: 5,
              scaleX: 1.8,
              scaleY: 1.8,
              rotationDeg: -12,
              colorHex: 0xff0055,
              opacity: 0.95,
              isMirrored: true,
              blendMode: 'NORMAL',
            },
            {
              id: 'layer_circuit_traces',
              name: 'Cybernetic Circuit Overlay',
              category: 'CYBER_CIRCUITS',
              region: 'HOOD',
              posX: 0,
              posY: 0,
              scaleX: 2.2,
              scaleY: 2.2,
              rotationDeg: 45,
              colorHex: 0x00ffcc,
              opacity: 0.85,
              isMirrored: false,
              blendMode: 'SCREEN',
            },
          ],
        },
      },
      {
        name: 'Forged Carbon Stealth Interceptor',
        scheme: {
          primaryFinish: 'FORGED_COMPOSITE_CARBON',
          primaryColorHex: 0x111111,
          secondaryFinish: 'CARBON_FIBER_TWILL',
          secondaryColorHex: 0x1c2833,
          brakeCaliperColorHex: 0xf1c40f,
          rimColorHex: 0x0a0a0a,
          rimFinish: 'MATTE_SILK',
          windowTintPercent: 90,
          tireLetteringText: 'CARBON SPEC',
          layers: [],
        },
      },
    ];
  }
}
