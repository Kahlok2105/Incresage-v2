import type { Dispatch, SetStateAction } from 'react';
import type { PlayerState } from '../types/state';
import { computeLifespanDrain, getMaxLifespanSeconds } from '../utils/lifespanUtils';
import { buildReincarnationSummary, buildRebirthState } from '../utils/reincarnationUtils';
import { computeOfflineProgress } from '../utils/offlineUtils';
import { checkFeatureUnlocks } from '../utils/unlockUtils';
import type { EchoShopPerk } from '../types/legacy';
import { ECHO_SHOP_PERKS } from '../constants/echoShopPerks';

export function useLifecycle(
  state: PlayerState,
  setState: Dispatch<SetStateAction<PlayerState>>,
  addNotification: (message: string, type: 'info' | 'success' | 'warning' | 'death') => void,
) {
  // Process offline progress when the hook mounts (i.e., on game load)
  function processOfflineProgress(): void {
    setState((previous) => {
      const offlineResult = computeOfflineProgress(previous);

      if (offlineResult.ticksApplied > 0) {
        // Build notification message
        const parts: string[] = [];
        if (offlineResult.qiFillGained > 0) {
          parts.push(`Qi fill +${(offlineResult.qiFillGained * 100).toFixed(1)}%`);
        }
        for (const tech of offlineResult.techniqueLevelsGained) {
          if (tech.levels > 0) {
            parts.push(`${tech.name} +${tech.levels} level${tech.levels > 1 ? 's' : ''}`);
          }
        }

        if (parts.length > 0) {
          // Schedule notification for after render
          setTimeout(() => {
            addNotification(
              `Offline progress (${Math.floor(offlineResult.ticksApplied / 60)}m): ${parts.join(', ')}`,
              'info',
            );
          }, 500);
        }
      }

      // Check for death during offline
      if (offlineResult.state.life.lifespanFill >= 1 && !previous.legacy.pendingSummary) {
        const summary = buildReincarnationSummary(offlineResult.state);
        setTimeout(() => {
          addNotification('Your lifespan has ended. The cycle begins anew.', 'death');
        }, 500);

        return {
          ...offlineResult.state,
          legacy: {
            ...offlineResult.state.legacy,
            pendingSummary: summary,
          },
        };
      }

      return offlineResult.state;
    });
  }

  // Attempt reincarnation (called when user clicks "Reincarnate" in modal)
  function attemptReincarnation() {
    setState((previous) => {
      if (!previous.legacy.pendingSummary) return previous;

      const summary = previous.legacy.pendingSummary;

      // Count how many times each perk has been purchased
      const purchasedPerks = getPurchasedPerks(previous);

      const newState = buildRebirthState(previous, summary, purchasedPerks);

      // Check for feature unlocks on the new state
      const { newlyUnlocked, messages } = checkFeatureUnlocks(newState);
      if (newlyUnlocked.length > 0) {
        newState.systems.unlockedFeatures = [
          ...new Set([...newState.systems.unlockedFeatures, ...newlyUnlocked]),
        ];
      }

      setTimeout(() => {
        addNotification(`Reborn! Life ${summary.lifeNumber} begins.`, 'success');
        if (messages.length > 0) {
          for (const msg of messages) {
            addNotification(msg, 'success');
          }
        }
      }, 500);

      return newState;
    });
  }

  // Apply feature unlock checks after breakthroughs
  function applyFeatureUnlocks() {
    setState((previous) => {
      const { newlyUnlocked, messages } = checkFeatureUnlocks(previous);

      if (newlyUnlocked.length === 0) return previous;

      const nextState = {
        ...previous,
        systems: {
          ...previous.systems,
          unlockedFeatures: [
            ...new Set([...previous.systems.unlockedFeatures, ...newlyUnlocked]),
          ],
        },
      };

      setTimeout(() => {
        for (const msg of messages) {
          addNotification(msg, 'success');
        }
      }, 100);

      return nextState;
    });
  }

  // Purchase an echo shop perk
  function purchasePerk(perkId: string) {
    setState((previous) => {
      const perk = ECHO_SHOP_PERKS.find((p) => p.id === perkId);
      if (!perk) return previous;

      // Check if already purchased to max
      const purchases = previous.legacy.imprints.filter(
        (i) => i.techniqueId === `perk_${perkId}`,
      ).length;

      if (purchases >= perk.maxPurchases) return previous;
      if (previous.legacy.echoes < perk.cost) return previous;

      setTimeout(() => {
        addNotification(`Purchased: ${perk.name}`, 'success');
      }, 100);

      return {
        ...previous,
        legacy: {
          ...previous.legacy,
          echoes: previous.legacy.echoes - perk.cost,
          // Track perk purchases as special imprints
          imprints: [
            ...previous.legacy.imprints,
            {
              techniqueId: `perk_${perkId}`,
              preservedLevel: purchases + 1,
            },
          ],
        },
      };
    });
  }

  return {
    processOfflineProgress,
    attemptReincarnation,
    applyFeatureUnlocks,
    purchasePerk,
  };
}

function getPurchasedPerks(state: PlayerState): EchoShopPerk[] {
  const purchasedPerks: EchoShopPerk[] = [];

  for (const imprint of state.legacy.imprints) {
    if (imprint.techniqueId.startsWith('perk_')) {
      const perkId = imprint.techniqueId.replace('perk_', '');
      const perk = ECHO_SHOP_PERKS.find((p) => p.id === perkId);
      if (perk) {
        // Add one per purchase count
        for (let i = 0; i < imprint.preservedLevel; i++) {
          purchasedPerks.push(perk);
        }
      }
    }
  }

  return purchasedPerks;
}