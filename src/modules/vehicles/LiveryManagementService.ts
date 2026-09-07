/**
 * ============================================================================
 * REALDRIVE VEHICLES — LIVERY & WRAP MANAGEMENT SERVICE
 * ============================================================================
 * Custom vinyl wraps, sponsor graphics decal layers, metallic/matte paint shaders,
 * community sharing repository, rating votes, and downloads.
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { LiveryEntity, LiveryLayer } from '../../database/entities/LiveryEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export interface CreateLiveryDto {
  title: string;
  description: string;
  targetVehicleModelId: string;
  baseColorHex: string;
  secondaryColorHex: string;
  accentColorHex: string;
  finishType: any;
  layers: LiveryLayer[];
  isPublic: boolean;
}

export class LiveryManagementService {
  constructor(private database: DatabaseClient = db) {}

  public async createLivery(authorId: string, dto: CreateLiveryDto): Promise<LiveryEntity> {
    if (!dto.title || !dto.targetVehicleModelId) {
      throw HttpError.badRequest('Livery title and target vehicle model are required.');
    }

    return this.database.insert<LiveryEntity>('liveries', {
      authorId,
      title: dto.title,
      description: dto.description || '',
      targetVehicleModelId: dto.targetVehicleModelId,
      baseColorHex: dto.baseColorHex || '#ffffff',
      secondaryColorHex: dto.secondaryColorHex || '#000000',
      accentColorHex: dto.accentColorHex || '#e11d48',
      finishType: dto.finishType || 'HIGH_GLOSS',
      layersJson: JSON.stringify(dto.layers || []),
      isPublic: !!dto.isPublic,
      downloadCount: 0,
      ratingScore: 5.0,
      ratingCount: 1,
    });
  }

  public async getPublicLiveries(vehicleModelId?: string, limit: number = 20): Promise<LiveryEntity[]> {
    const q = this.database.query<LiveryEntity>('liveries');
    q.where('isPublic', '=', true);
    if (vehicleModelId) {
      q.where('targetVehicleModelId', '=', vehicleModelId);
    }
    q.orderBy('downloadCount', 'DESC');
    q.limit(limit);

    return this.database.executeQuery(q);
  }

  public async getLiveryById(id: string): Promise<LiveryEntity | null> {
    return this.database.findById<LiveryEntity>('liveries', id);
  }

  public async rateLivery(id: string, rating: number): Promise<LiveryEntity> {
    if (rating < 1 || rating > 5) {
      throw HttpError.badRequest('Rating must be between 1 and 5 stars.');
    }

    const livery = await this.getLiveryById(id);
    if (!livery) throw HttpError.notFound('Livery not found');

    const totalStars = livery.ratingScore * livery.ratingCount + rating;
    const newCount = livery.ratingCount + 1;
    const newScore = Number((totalStars / newCount).toFixed(2));

    const updated = await this.database.update<LiveryEntity>('liveries', id, {
      ratingScore: newScore,
      ratingCount: newCount,
    });

    return updated!;
  }

  public async downloadLivery(id: string): Promise<LiveryEntity> {
    const livery = await this.getLiveryById(id);
    if (!livery) throw HttpError.notFound('Livery not found');

    const updated = await this.database.update<LiveryEntity>('liveries', id, {
      downloadCount: livery.downloadCount + 1,
    });

    return updated!;
  }
}
