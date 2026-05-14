import { techExpToNextLevel } from "../constants/techniques";
import type { PlayerState } from "../types/state";
import type { Technique, TechniqueTrait } from "../types/technique";

export const TECHNIQUE_LEVEL_CAP = 50;

export function getActiveTechnique(state: PlayerState): Technique | null {
    if(!state.qi.activeTechniqueId) return null;

    return state.qi.techniques.find(
        (technique) => technique.id === state.qi.activeTechniqueId,
    ) ?? null;

}

export function techniqueHasTrait (
    technique: Technique | null,
    trait: TechniqueTrait,
): boolean {
    return technique?.traits.includes(trait) ?? false;
}

export function addTechniqueExp(technique: Technique, expGained: number): Technique {
    if (technique.level >= TECHNIQUE_LEVEL_CAP) {
        return technique; // No change if already at max level
    }

    let nextTechnique = {
        ...technique,
        exp: technique.exp + expGained,
    }

    while (
        nextTechnique.level < TECHNIQUE_LEVEL_CAP &&
        nextTechnique.exp >= techExpToNextLevel(nextTechnique.level)
    ) {
        nextTechnique = {
            ...nextTechnique,
            exp: nextTechnique.exp - techExpToNextLevel(nextTechnique.level),
            level: nextTechnique.level + 1,
        }
    }
    return nextTechnique;
}

// export function getTraitLabel(trait: TechniqueTrait): string {
//   switch (trait) {
//     case 'qi_focus':
//       return 'Qi Focus';
//     case 'body_resilience':
//       return 'Body Resilience';
//     case 'insight_deep':
//       return 'Deep Insight';
//     case 'combat_edge':
//       return 'Combat Edge';
//     case 'lifespan_extend':
//       return 'Lifespan Extension';
//     case 'magicfind_rate':
//       return 'Treasure Sense';
//   }
// }

export function getTechniqueEffectText(technique: Technique): string[] {
  return technique.traits.map((trait) => {
    switch (trait) {
      case 'qi_focus':
        return `Qi speed +${technique.level * 2}%`;
      case 'insight_deep':
        return `Insight +${(0.05 * technique.level).toFixed(2)}/s`;
      case 'body_resilience':
        return 'Body failure penalty reduced';
      case 'combat_edge':
        return 'Combat stats increased';
      case 'lifespan_extend':
        return 'Lifespan lasts longer';
      case 'magicfind_rate':
        return 'Improved item discovery';
    }
  });
}