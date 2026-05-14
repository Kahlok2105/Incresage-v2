import type { PlayerState } from "../types/state";
import { getQiStage } from "./realmUtils";
import { getActiveTechnique, techniqueHasTrait } from "./techniqueUtils";

export function computeQiFillRate(state: PlayerState): number {
    const stage = getQiStage(state.qi);
    const activeTechnique = getActiveTechnique(state);

    const insightMultiplier = 1 + (state.qi.insight * 0.001); 
    
    const techniqueMultiplier = 
    activeTechnique &&techniqueHasTrait(activeTechnique, 'qi_focus')
        ? 1 + activeTechnique.level * 0.02
        : 1;

    return stage.fillRate * insightMultiplier * techniqueMultiplier;
}