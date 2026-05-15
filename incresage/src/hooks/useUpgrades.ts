import type { Dispatch, SetStateAction } from 'react';
import type { PlayerState } from '../types/state';
import { getNextTierCost } from '../utils/upgradeUtils';

export function useUpgrades(
  setState: Dispatch<SetStateAction<PlayerState>>,
) {
  function upgradeBattleTechnique(techniqueId: string) {
    setState((previous) => {
      const technique = previous.body.battleTechniques.find(
        (candidate) => candidate.id === techniqueId,
      );

      if (!technique) {
        return previous;
      }

      const cost = getNextTierCost(technique);

      const nextTier = technique.tier + 1;
      const requiredRealmIndex = nextTier - 1;

      if (nextTier > 5 || previous.body.realmIndex < requiredRealmIndex) {
        return previous;
        }
      if (cost === null || previous.systems.spiritStones < cost) {
        return previous;
      }

      return {
        ...previous,
        body: {
          ...previous.body,
          battleTechniques: previous.body.battleTechniques.map((candidate) => {
            if (candidate.id !== techniqueId) {
              return candidate;
            }

            return {
              ...candidate,
              tier: candidate.tier + 1,
            };
          }),
        },
        systems: {
          ...previous.systems,
          spiritStones: previous.systems.spiritStones - cost,
        },
      };
    });
  }

  return {
    upgradeBattleTechnique,
  };
}
