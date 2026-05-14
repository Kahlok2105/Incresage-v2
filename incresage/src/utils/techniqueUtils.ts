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