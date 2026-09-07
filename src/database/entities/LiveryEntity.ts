/**
 * ============================================================================
 * REALDRIVE ENTITY — LIVERY & VINYL WRAP ENTITY
 * ============================================================================
 * Multi-layer vinyl wraps, custom racing decals, sponsor graphics,
 * carbon fiber composites, and metallic flake shader properties.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface LiveryLayer {
  layerId: string;
  type: 'SHAPE' | 'SPONSOR_LOGO' | 'RACING_STRIPE' | 'NUMBER_PLATE' | 'GRADIENT' | 'CUSTOM_TEXT';
  graphicKey: string;
  posX: number;
  posY: number;
  scaleX: number;
  scaleY: number;
  rotationDeg: number;
  colorHex: string;
  opacity: number;
  metallicFactor: number;
  roughnessFactor: number;
  isMirrored: boolean;
  zIndex: number;
}

export interface LiveryEntity {
  id: string;
  vehicleId?: string;
  authorId: string;
  title: string;
  description: string;
  targetVehicleModelId: string;
  baseColorHex: string;
  secondaryColorHex: string;
  accentColorHex: string;
  finishType: 'HIGH_GLOSS' | 'MATTE_SATIN' | 'FROSTED_METALLIC' | 'CHROME_MIRROR' | 'FORGED_CARBON';
  layersJson: string; // Serialized LiveryLayer[]
  isPublic: boolean;
  downloadCount: number;
  ratingScore: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export const LiverySchema: TableSchema<LiveryEntity> = {
  name: 'liveries',
  primaryKey: 'id',
  indexes: ['authorId', 'targetVehicleModelId', 'isPublic', 'downloadCount'],
  foreignKeys: [
    {
      field: 'authorId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'CASCADE',
    },
  ],
  timestamps: true,
  softDeletes: true,
};
