import type { InventoryItem } from './inventory';
import type { Imprint, LifetimeStats, ReincarnationSummary } from './legacy';

// States are split into multiple sub-objects so each hook owns a clean slice.
export interface PlayerState {
  qi:      QiState;
  body:    BodyState;
  combat:  CombatStats;
  life:    LifeState;
  legacy:  LegacyState;
  systems: SystemsState;
}

export interface QiState {
  fill:              number; // Ratio of current stage.
  realmIndex:        number; // 0 to 5.
  stage:             number; // 0 = Early, 1 = Middle, 2 = Late.
  insight:           number; // Single mental stat.
  activeTechniqueId: string | null;
}

export interface BodyState {
  fill:      number; // Ratio of current stage.
  realmIndex: number; // 0 to 5.
  stage:     number; // 0 = Early, 1 = Middle, 2 = Late.
  trials:    number;
  trialsMax: number;
  sparks:    number;
}

export interface CombatStats {
  vitalityFill:     number; // 0.0 to 1.0.
  spiritFill:       number; // 0.0 to 1.0.
  attackPower:      number;
  defensePower:     number;
  defeatedMonsters: string[];
  equippedItems:    string[];
}

export interface LifeState {
  lifespanFill:  number; // 0.0 to 1.0.
  maxLifespan:   number;
  lastUpdate:    number;
  lastActive:    number;
  lifetimeStats: LifetimeStats;
}

export interface LegacyState {
  echoes:              number;
  imprints:            Imprint[];
  reincarnationCount:  number;
  pendingSummary:      ReincarnationSummary | null;
}

export interface SystemsState {
  unlockedFeatures: Feature[];
  inventory:        InventoryItem[];
  spiritStones:     number;
}

export type Feature = 'combat' | 'alchemy' | 'bodyCultivation';
