/**
 * ============================================================================
 * REALDRIVE MULTIPLAYER — 200M SPATIAL GRID INTEREST MANAGEMENT
 * ============================================================================
 * High-performance 2D/3D spatial hashing grid:
 * - Divides infinite game world into 200m x 200m cubic cells
 * - O(1) query complexity for nearby player discovery
 * - Eliminates O(N^2) broadcast overhead, scaling to 1,000+ simultaneous cars
 */

export interface SpatialEntity {
  id: string;
  socketId: string;
  userId: string;
  x: number;
  y: number;
  z: number;
  gridKey: string;
}

export class SpatialGridManager {
  private cellSize: number;
  private grid: Map<string, Set<string>> = new Map(); // gridKey -> Set(entityId)
  private entities: Map<string, SpatialEntity> = new Map(); // entityId -> SpatialEntity

  constructor(cellSize: number = 200) {
    this.cellSize = cellSize;
  }

  private computeGridKey(x: number, z: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellZ = Math.floor(z / this.cellSize);
    return `${cellX}:${cellZ}`;
  }

  public updatePosition(id: string, socketId: string, userId: string, x: number, y: number, z: number): {
    oldKey: string;
    newKey: string;
    changedCell: boolean;
  } {
    const newKey = this.computeGridKey(x, z);
    const existing = this.entities.get(id);

    if (!existing) {
      const entity: SpatialEntity = { id, socketId, userId, x, y, z, gridKey: newKey };
      this.entities.set(id, entity);

      let cell = this.grid.get(newKey);
      if (!cell) {
        cell = new Set();
        this.grid.set(newKey, cell);
      }
      cell.add(id);

      return { oldKey: '', newKey, changedCell: true };
    }

    const oldKey = existing.gridKey;
    const changedCell = oldKey !== newKey;

    existing.x = x;
    existing.y = y;
    existing.z = z;

    if (changedCell) {
      // Remove from old cell
      const oldCell = this.grid.get(oldKey);
      if (oldCell) {
        oldCell.delete(id);
        if (oldCell.size === 0) this.grid.delete(oldKey);
      }

      // Add to new cell
      let newCell = this.grid.get(newKey);
      if (!newCell) {
        newCell = new Set();
        this.grid.set(newKey, newCell);
      }
      newCell.add(id);
      existing.gridKey = newKey;
    }

    return { oldKey, newKey, changedCell };
  }

  public removeEntity(id: string): void {
    const existing = this.entities.get(id);
    if (!existing) return;

    const cell = this.grid.get(existing.gridKey);
    if (cell) {
      cell.delete(id);
      if (cell.size === 0) this.grid.delete(existing.gridKey);
    }
    this.entities.delete(id);
  }

  public getNearbyEntityIds(x: number, z: number, radiusMeters: number = 400): string[] {
    const cellRadius = Math.ceil(radiusMeters / this.cellSize);
    const centerCellX = Math.floor(x / this.cellSize);
    const centerCellZ = Math.floor(z / this.cellSize);

    const nearbyIds: string[] = [];
    const radiusSq = radiusMeters * radiusMeters;

    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dz = -cellRadius; dz <= cellRadius; dz++) {
        const key = `${centerCellX + dx}:${centerCellZ + dz}`;
        const cell = this.grid.get(key);
        if (!cell) continue;

        for (const entityId of cell) {
          const ent = this.entities.get(entityId);
          if (ent) {
            const distSq = Math.pow(ent.x - x, 2) + Math.pow(ent.z - z, 2);
            if (distSq <= radiusSq) {
              nearbyIds.push(entityId);
            }
          }
        }
      }
    }

    return nearbyIds;
  }

  public getEntity(id: string): SpatialEntity | undefined {
    return this.entities.get(id);
  }

  public getTotalEntities(): number {
    return this.entities.size;
  }

  public getActiveCellsCount(): number {
    return this.grid.size;
  }
}
