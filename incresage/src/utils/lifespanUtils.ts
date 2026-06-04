import type { PlayerState } from '../types/state';
import { getActiveTechnique, techniqueHasTrait } from './techniqueUtils';

// Maps realm stages to real-time lifespan in seconds.
// Shorter lifespans force reincarnation sooner — players generally reach no further
// than Core Formation on their first life without focused play.
const LIFESPAN_TABLE: Record<number, number[]> = {
  // key: realmIndex, value: [Early, Middle, Late] in seconds
  0: [600, 720, 900],            // Mortal: 10min, 12min, 15min
  1: [1200, 1500, 1800],         // Qi Condensation: 20min, 25min, 30min
  2: [2400, 3000, 3600],         // Foundation Est: 40min, 50min, 1hr
  3: [5400, 7200, 9000],         // Core Formation: 1.5hr, 2hr, 2.5hr
  4: [10800, 14400, 18000],      // Nascent Soul: 3hr, 4hr, 5hr
  5: [21600, 28800, 36000],      // Spirit Severing: 6hr, 8hr, 10hr
};

export function getMaxLifespanSeconds(state: PlayerState): number {
  const { realmIndex, stage } = state.qi;
  const realmTable = LIFESPAN_TABLE[realmIndex];
  if (!realmTable) {
    return 1800; // Fallback to 30 min
  }
  return realmTable[stage] ?? 1800;
}

export function computeLifespanDrain(state: PlayerState): number {
  const maxSeconds = getMaxLifespanSeconds(state);
  let drain = 1 / maxSeconds; // drain per tick (1 tick = 1 second)

  const activeTechnique = getActiveTechnique(state);
  if (activeTechnique && techniqueHasTrait(activeTechnique, 'lifespan_extend')) {
    // lifespan_extend: each level reduces drain by 2%, effectively extending lifespan
    const reduction = 1 / (1 + activeTechnique.level * 0.02);
    drain *= reduction;
  }

  return drain;
}

export function formatLifespanRemaining(lifespanFill: number, maxSeconds: number): string {
  const remainingSeconds = Math.max(0, Math.floor((1 - lifespanFill) * maxSeconds));

  if (remainingSeconds <= 0) {
    return '0s';
  }

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}