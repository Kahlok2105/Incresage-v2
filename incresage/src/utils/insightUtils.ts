import type { PlayerState } from "../types/state";
import { getActiveTechnique, techniqueHasTrait } from "./techniqueUtils";

export function getInsightCap(state: PlayerState): number{
    return 10 * (state.qi.realmIndex + 1);
}

export function computeInsightGainPerTick (state: PlayerState): number{
    const activeTechnique = getActiveTechnique(state);

    if(!activeTechnique || !techniqueHasTrait(activeTechnique, 'insight_deep')) return 0;

    return 0.05 * activeTechnique.level; // Each level gives 0.05 insight per tick
}