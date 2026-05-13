import type { Technique } from '../types/technique';

// All five meditation techniques.
// Unlockable techniques have their unlock condition noted —
// the actual gate check lives in useReincarnation and feature unlocks.
// Level and exp start at 1 and 0 — these are the default values
// when a technique is first acquired.

export const TECHNIQUES: Technique[] = [
  {
    id:          'stillwater_breathing',
    name:        'Stillwater Breathing',
    description: 'Calm the mind like still water. Pure Qi cultivation through deep stillness.',
    level:       1,
    exp:         0,
    traits:      ['qi_focus', 'insight_deep'],
  },
  {
    id:          'iron_will_tempering',
    name:        'Iron Will Tempering',
    description: 'Harden the mind and body as one. What does not break you becomes part of you.',
    level:       1,
    exp:         0,
    traits:      ['body_resilience', 'insight_deep'],
  },
  {
    id:          'predators_instinct',
    name:        "Predator's Instinct",
    description: 'Hunt to live longer. The killer who survives long enough becomes something else entirely.',
    level:       1,
    exp:         0,
    traits:      ['combat_edge', 'lifespan_extend'],
  },
  {
    id:          'soul_searching',
    name:        'Soul Searching',
    description: 'Probe the boundaries of self and void. Unlocked at Core Formation.',
    level:       1,
    exp:         0,
    traits:      ['qi_focus', 'lifespan_extend', 'magicfind_rate'],
  },
  {
    id:          'life_pondering',
    name:        'Life Pondering',
    description: 'A cultivator who has lived centuries begins to ask different questions. Unlocked at Nascent Soul.',
    level:       1,
    exp:         0,
    traits:      ['lifespan_extend', 'insight_deep'],
  },
];

// Techniques unlocked by reaching a Qi realm.
// Key is the technique id, value is the required qi realmIndex.
export const TECHNIQUE_UNLOCK_REQUIREMENTS: Record<string, number> = {
  soul_searching: 3,   // Core Formation = realmIndex 3
  life_pondering: 4,   // Nascent Soul = realmIndex 4
};

// Total technique level gate per realm's Late breakthrough.
// The player's sum of all technique levels must meet this threshold
// before a Late stage breakthrough can be attempted.
export const LATE_BREAKTHROUGH_LEVEL_GATES: Record<string, number> = {
  mortal:                   3,
  qi_condensation:          6,
  foundation_establishment: 10,
  core_formation:           20,
  nascent_soul:             35,
  spirit_severing:          80,
};

// Experience required to reach the next level.
// Linear scaling — level × 15 seconds of active meditation.
// At 50 levels total per technique, a fully levelled technique
// requires 19,125 seconds (~5.3 hours) of active use.
export function techExpToNextLevel(level: number): number {
  return level * 15;
}