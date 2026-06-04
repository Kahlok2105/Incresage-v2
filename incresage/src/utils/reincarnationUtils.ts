import type { Imprint, ReincarnationSummary } from '../types/legacy';
import type { PlayerState } from '../types/state';
import { INITIAL_PLAYER_STATE } from '../constants/initialState';
import { TECHNIQUES } from '../constants/techniques';
import { TECHNIQUE_UNLOCK_REQUIREMENTS } from '../constants/techniques';
import type { Technique } from '../types/technique';
import type { EchoShopPerk } from '../types/legacy';

export function computeEchoesEarned(state: PlayerState): number {
  const { lifetimeStats } = state.life;
  return Math.floor(
    lifetimeStats.highestQiRealm * 10 +
    lifetimeStats.highestBodyRealm * 5 +
    lifetimeStats.breakthroughsTaken * 2 +
    lifetimeStats.monstersDefeated / 10
  );
}

export function computeImprintsEarned(state: PlayerState): Imprint[] {
  const imprints: Imprint[] = [];

  for (const technique of state.qi.techniques) {
    // Techniques at level 10+ can be imprinted
    if (technique.level >= 10) {
      const preservedLevel = Math.floor(technique.level * 0.3); // Preserve 30% of levels
      if (preservedLevel >= 1) {
        imprints.push({
          techniqueId: technique.id,
          preservedLevel,
        });
      }
    }
  }

  return imprints;
}

export function buildReincarnationSummary(state: PlayerState): ReincarnationSummary {
  const echoesEarned = computeEchoesEarned(state);
  const imprintsEarned = computeImprintsEarned(state);

  return {
    lifeNumber: state.legacy.reincarnationCount + 1,
    echoesEarned,
    imprintsEarned,
    highestQiRealm: state.life.lifetimeStats.highestQiRealm,
    highestBodyRealm: state.life.lifetimeStats.highestBodyRealm,
    monstersDefeated: state.life.lifetimeStats.monstersDefeated,
    breakthroughsTaken: state.life.lifetimeStats.breakthroughsTaken,
    lifespanFill: state.life.lifespanFill,
  };
}

export function buildRebirthState(
  state: PlayerState,
  summary: ReincarnationSummary,
  purchasedPerks: EchoShopPerk[],
): PlayerState {
  const now = Date.now();

  // Start from initial state
  const newState: PlayerState = JSON.parse(JSON.stringify(INITIAL_PLAYER_STATE));

  // Apply legacy preservation
  newState.legacy.echoes = state.legacy.echoes + summary.echoesEarned;
  newState.legacy.reincarnationCount = state.legacy.reincarnationCount + 1;
  newState.legacy.imprints = [...state.legacy.imprints, ...summary.imprintsEarned];

  // Apply imprinted technique levels
  const newTechniques = newState.qi.techniques.map((technique) => {
    const imprint = newState.legacy.imprints.find(
      (i) => i.techniqueId === technique.id,
    );
    if (imprint) {
      return {
        ...technique,
        level: Math.min(50, 1 + imprint.preservedLevel),
      };
    }
    return technique;
  });

  // Apply purchased perks
  let startingSparks = 0;
  let additionalPreservedLevels = 0;

  for (const perk of purchasedPerks) {
    switch (perk.id) {
      case 'soul_anchor':
        additionalPreservedLevels += 1;
        break;
      case 'spark_of_genesis':
        startingSparks += 1;
        break;
    }
  }

  // Apply additional preserved levels from Soul Anchor perk
  const finalTechniques = newTechniques.map((technique) => {
    const existingImprint = newState.legacy.imprints.find(
      (i) => i.techniqueId === technique.id,
    );
    if (existingImprint && additionalPreservedLevels > 0) {
      return {
        ...technique,
        level: Math.min(50, technique.level + additionalPreservedLevels),
      };
    }
    return technique;
  });

  newState.qi.techniques = finalTechniques;
  newState.body.sparks = startingSparks;

  // Update timestamps
  newState.life.lastUpdate = now;
  newState.life.lastActive = now;

  return newState;
}

// Check which techniques should be unlocked based on current Qi realm
export function getAvailableTechniques(techniques: Technique[], qiRealmIndex: number): Technique[] {
  const startTechniques = TECHNIQUES.slice(0, 3); // First 3 are starting techniques

  const unlockedTechniques = techniques.filter((t) => {
    const requirement = TECHNIQUE_UNLOCK_REQUIREMENTS[t.id];
    if (requirement === undefined) return true; // Starting techniques are always available
    return qiRealmIndex >= requirement;
  });

  // Ensure we have the base 3 techniques
  const techniqueMap = new Map<string, Technique>();
  for (const t of startTechniques) {
    techniqueMap.set(t.id, t);
  }
  for (const t of unlockedTechniques) {
    techniqueMap.set(t.id, t);
  }

  return Array.from(techniqueMap.values());
}