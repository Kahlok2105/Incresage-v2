import type { PlayerState } from '../types/state';
import { QI_REALMS } from './qiRealms';

const now = Date.now();

export const INITIAL_PLAYER_STATE: PlayerState = {
  qi: {
    fill: 0,
    realmIndex: 0,
    stage: 0,
    insight: 0,
    activeTechniqueId: null,
  },
  body: {
    fill: 0,
    realmIndex: 0,
    stage: 0,
    trials: 0,
    trialsMax: 8,
    sparks: 0,
  },
  combat: {
    vitalityFill: 1,
    spiritFill: 1,
    attackPower: 10,
    defensePower: 10,
    defeatedMonsters: [],
    equippedItems: [],
  },
  life: {
    lifespanFill: 0,
    maxLifespan: QI_REALMS[0].stages[0].lifespanYears,
    lastUpdate: now,
    lastActive: now,
    lifetimeStats: {
      highestQiRealm: 0,
      highestBodyRealm: 0,
      monstersDefeated: 0,
      breakthroughsTaken: 0,
      lifespanFill: 0,
    },
  },
  legacy: {
    echoes: 0,
    imprints: [],
    reincarnationCount: 0,
    pendingSummary: null,
  },
  systems: {
    unlockedFeatures: [],
    inventory: [],
    spiritStones: 0,
  },
};
