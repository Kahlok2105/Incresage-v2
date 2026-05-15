import type { BattleTechnique } from '../types/technique';

export const BATTLE_TECHNIQUES: BattleTechnique[] = [
  {
    id: 'tiger_breath',
    name: "Tiger's Breath",
    trait: 'attack',
    tier: 0,
    tierCosts: [10, 30, 70, 150, 300],
  },
  {
    id: 'iron_skin_mantra',
    name: 'Iron Skin Mantra',
    trait: 'defense',
    tier: 0,
    tierCosts: [10, 30, 70, 150, 300],
  },
  {
    id: 'boundless_heart',
    name: 'Boundless Heart',
    trait: 'vitality',
    tier: 0,
    tierCosts: [10, 30, 70, 150, 300],
  },
  {
    id: 'spirit_refinement',
    name: 'Spirit Refinement',
    trait: 'spirit',
    tier: 0,
    tierCosts: [10, 30, 70, 150, 300],
  },
];