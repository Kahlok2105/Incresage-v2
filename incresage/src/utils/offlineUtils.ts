import type { PlayerState } from '../types/state';
import { computeQiFillRate } from './fillRate';
import { addTechniqueExp } from './techniqueUtils';
import { computeInsightGainPerTick, getInsightCap } from './insightUtils';
import { computeLifespanDrain } from './lifespanUtils';

const OFFLINE_CAP_TICKS = 8 * 3600; // 8 hours max offline

export interface OfflineResult {
  state: PlayerState;
  ticksApplied: number;
  qiFillGained: number;
  techniqueLevelsGained: Array<{ id: string; name: string; levels: number }>;
  lifespanConsumed: number;
}

export function computeOfflineProgress(
  savedState: PlayerState,
): OfflineResult {
  const now = Date.now();
  const elapsedMs = now - savedState.life.lastUpdate;
  const elapsedTicks = Math.floor(elapsedMs / 1000);
  const cappedTicks = Math.min(elapsedTicks, OFFLINE_CAP_TICKS);

  let workingState = { ...savedState };
  let totalQiFillGained = 0;
  const techniqueLevelsGained: Record<string, number> = {};
  let totalLifespanConsumed = 0;

  // Batch offline ticks for performance (process in batches of 100)
  const BATCH_SIZE = 100;
  let processed = 0;

  while (processed < cappedTicks) {
    const batchRemaining = cappedTicks - processed;
    const batchCount = Math.min(batchRemaining, BATCH_SIZE);

    // Process batch: Qi fill, technique XP, insight, lifespan
    for (let i = 0; i < batchCount; i++) {
      const fillRate = computeQiFillRate(workingState);
      workingState = {
        ...workingState,
        qi: {
          ...workingState.qi,
          fill: Math.min(1, workingState.qi.fill + fillRate),
          techniques: workingState.qi.techniques.map((t) => {
            if (t.id !== workingState.qi.activeTechniqueId) return t;
            const updated = addTechniqueExp(t, 1);
            if (updated.level > t.level) {
              techniqueLevelsGained[t.id] = (techniqueLevelsGained[t.id] ?? 0) + (updated.level - t.level);
            }
            return updated;
          }),
          insight: Math.min(
            getInsightCap(workingState),
            workingState.qi.insight + computeInsightGainPerTick(workingState),
          ),
        },
      };

      totalQiFillGained += fillRate;

      // Lifespan drain
      const drain = computeLifespanDrain(workingState);
      const newLifespanFill = Math.min(1, workingState.life.lifespanFill + drain);
      totalLifespanConsumed += drain;

      workingState = {
        ...workingState,
        life: {
          ...workingState.life,
          lifespanFill: newLifespanFill,
        },
      };

      // Check for death during offline (cap at death)
      if (workingState.life.lifespanFill >= 1) {
        break;
      }
    }

    processed += batchCount;

    // Check death break
    if (workingState.life.lifespanFill >= 1) {
      break;
    }
  }

  // Update lastUpdate and lastActive
  workingState = {
    ...workingState,
    life: {
      ...workingState.life,
      lastUpdate: now,
      lastActive: now,
    },
  };

  // Map technique level gains to readable format
  const techniqueLevelsGainedArray = Object.entries(techniqueLevelsGained).map(
    ([id, levels]) => {
      const technique = savedState.qi.techniques.find((t) => t.id === id);
      return {
        id,
        name: technique?.name ?? id,
        levels,
      };
    },
  );

  return {
    state: workingState,
    ticksApplied: processed,
    qiFillGained: totalQiFillGained,
    techniqueLevelsGained: techniqueLevelsGainedArray,
    lifespanConsumed: totalLifespanConsumed,
  };
}