import type { PlayerState } from "../types/state";
import { getBodyStage, getQiStage, isFinalBodyStage, isFinalQiStage } from "./realmUtils";

export const MIN_BREAKTHROUGH_FILL = 0.75;

export function canAttemptQiBreakthrough(state: PlayerState): boolean {
    return state.qi.fill >= MIN_BREAKTHROUGH_FILL && !isFinalQiStage(state.qi);
}

export function computeQiBreakthroughChance(state: PlayerState): number {
    const stage = getQiStage(state.qi);
    const fillMultiplier = Math.min(1, state.qi.fill / 0.95);
    
    return stage.baseBreakRate * fillMultiplier;
}

export function getBodyTrialCost(state: PlayerState): number {
    const totalStageIndex = state.body.realmIndex * 3 + state.body.stage;
    
    return 2 + Math.floor(totalStageIndex / 3);
}

export function canAttemptBodyBreakthrough(state: PlayerState): boolean{
    return(
        state.body.fill >= MIN_BREAKTHROUGH_FILL &&
        state.body.sparks >= getBodyTrialCost(state) && 
        state.body.sparks > 1 &&
        !isFinalBodyStage(state.body)
    )
}

export function computeBodyBreakthroughChance(state: PlayerState): number {
    if (isFinalBodyStage(state.body)){
        return 0;
    }

    const stage = getBodyStage(state.body);
    const fillMultiplier = Math.min(1,state.body.fill / 0.95);
    
    return stage.baseBreakRate * fillMultiplier;
}