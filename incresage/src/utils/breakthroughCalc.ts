import type { PlayerState } from "../types/state";
import { getQiStage, isFinalQiStage } from "./realmUtils";

export const MIN_BREAKTHROUGH_FILL = 0.75;

export function canAttemptQiBreakthrough(state: PlayerState): boolean {
    return state.qi.fill >= MIN_BREAKTHROUGH_FILL && !isFinalQiStage(state.qi);
}

export function computeQiBreakthroughChance(state: PlayerState): number {
    const stage = getQiStage(state.qi);
    const fillMultiplier = Math.min(1, state.qi.fill / 0.95);
    
    return stage.baseBreakRate * fillMultiplier;
}