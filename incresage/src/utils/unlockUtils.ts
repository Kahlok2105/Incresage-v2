import type { Feature, PlayerState } from '../types/state';

interface UnlockCondition {
  feature: Feature;
  check: (state: PlayerState) => boolean;
  message: string;
}

const UNLOCK_CONDITIONS: UnlockCondition[] = [
  {
    feature: 'combat',
    check: (state) => state.qi.realmIndex >= 1,
    message: 'Combat unlocked! Reach Qi Condensation to begin hunting monsters.',
  },
  {
    feature: 'bodyCultivation',
    check: (state) => state.qi.realmIndex >= 1,
    message: 'Body Cultivation unlocked! Defeat monsters to temper your body.',
  },
  {
    feature: 'alchemy',
    check: (state) => state.qi.realmIndex >= 3,
    message: 'Alchemy unlocked! Reach Core Formation to begin crafting pills.',
  },
];

export function checkFeatureUnlocks(state: PlayerState): {
  newlyUnlocked: Feature[];
  messages: string[];
} {
  const newlyUnlocked: Feature[] = [];
  const messages: string[] = [];

  for (const condition of UNLOCK_CONDITIONS) {
    if (
      condition.check(state) &&
      !state.systems.unlockedFeatures.includes(condition.feature)
    ) {
      newlyUnlocked.push(condition.feature);
      messages.push(condition.message);
    }
  }

  return { newlyUnlocked, messages };
}

export function isFeatureUnlocked(
  state: PlayerState,
  feature: Feature,
): boolean {
  return state.systems.unlockedFeatures.includes(feature);
}