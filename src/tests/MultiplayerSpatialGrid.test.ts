/**
 * ============================================================================
 * REALDRIVE TESTS — MULTIPLAYER SPATIAL HASHING TEST SUITE
 * ============================================================================
 * Unit tests for 200m spatial grid indexing, interest management filtering,
 * and binary telemetry packet encoding & decoding.
 */

import { SpatialGridManager } from '../modules/multiplayer/SpatialGridManager.js';
import { BinaryProtocolCodec } from '../modules/multiplayer/BinaryProtocolCodec.js';

export function runMultiplayerTestSuite(): { passed: number; failed: number; tests: string[] } {
  const tests: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      tests.push(`[PASS] ${testName}`);
      passed++;
    } else {
      tests.push(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Spatial Grid Clustering
  const grid = new SpatialGridManager(200);

  grid.updatePosition('player_1', 'sock_1', 'usr_1', 100, 0, 100);
  grid.updatePosition('player_2', 'sock_2', 'usr_2', 150, 0, 120); // nearby (54m away)
  grid.updatePosition('player_3', 'sock_3', 'usr_3', 3000, 0, 3000); // distant (4100m away)

  const nearbyToPlayer1 = grid.getNearbyEntityIds(100, 100, 300);
  assert(nearbyToPlayer1.includes('player_2'), 'SpatialGrid finds player_2 within 300m radius');
  assert(!nearbyToPlayer1.includes('player_3'), 'SpatialGrid excludes player_3 outside 300m radius');

  // Test 2: Binary Telemetry Codec
  const packedState = {
    sequence: 1420,
    entityId: 'player_1',
    x: 1250.75,
    y: 12.5,
    z: -840.25,
    yaw: 1.5708,
    speedKmh: 245.5,
    steering: -0.45,
    brake: true,
    nitro: false,
    headlights: true,
    horn: false,
  };

  const encoded = BinaryProtocolCodec.encodeState(packedState);
  assert(encoded.length === 28, 'BinaryProtocolCodec produces compact 28-byte packet');

  const decoded = BinaryProtocolCodec.decodeState(encoded);
  assert(decoded.sequence === 1420, 'BinaryProtocolCodec decodes sequence number correctly');
  assert(Math.abs(decoded.speedKmh - 245.5) < 0.2, 'BinaryProtocolCodec preserves speed telemetry');
  assert(decoded.brake === true && decoded.headlights === true, 'BinaryProtocolCodec unpacks bit-packed flags');

  return { passed, failed, tests };
}
