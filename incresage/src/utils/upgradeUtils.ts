import type { BattleTechnique } from '../types/technique';

export const BATTLE_TECHNIQUE_MAX_TIER = 5;

export function getNextTierCost(technique: BattleTechnique): number | null {
  if (technique.tier >= BATTLE_TECHNIQUE_MAX_TIER) {
    return null;
  }

  return technique.tierCosts[technique.tier];
}

export function getBattleTechniqueBonus(technique: BattleTechnique): number {
  switch (technique.tier) {
    case 0:
      return 0;
    case 1:
      return 3;
    case 2:
      return 6;
    case 3:
      return 10;
    case 4:
      return 15;
    case 5:
      return 20;
    default:
      return 0;
  }
}

export function getBattleTechniqueEffectText(technique: BattleTechnique): string {
  const bonus = getBattleTechniqueBonus(technique);

  switch (technique.trait) {
    case 'attack':
      return `Attack +${bonus}`;
    case 'defense':
      return `Defense +${bonus}`;
    case 'vitality':
      return `Vitality cap +${bonus * 15}`;
    case 'spirit':
      return `Spirit cap +${bonus * 15}`;
  }
}

export function getBattleTechniqueEffectTextAtTier(
  technique: BattleTechnique,
  tier: number,
): String{
  return getBattleTechniqueEffectText({ ...technique, tier });
}