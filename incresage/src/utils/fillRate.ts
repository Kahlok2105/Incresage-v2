import type { PlayerState } from "../types/state";
import { getQiStage } from "./realmUtils";

export function computeQiFillRate(state: PlayerState): number {
    const stage = getQiStage(state.qi);
    const insightMultiplier = 1 + (state.qi.insight * 0.001); 
    
    return stage.fillRate * insightMultiplier
}