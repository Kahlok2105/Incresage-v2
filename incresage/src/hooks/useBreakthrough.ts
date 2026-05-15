import type { Dispatch, SetStateAction} from "react";
import type {  PlayerState } from "../types/state";
import {canAttemptQiBreakthrough, computeQiBreakthroughChance, canAttemptBodyBreakthrough, computeBodyBreakthroughChance, getBodyTrialCost } from "../utils/breakthroughCalc";
import { getNextBodyPosition, getNextQiPosition } from "../utils/realmUtils";


export function useBreakthrough(
    state: PlayerState,
    setState: Dispatch<SetStateAction<PlayerState>>
){
    function attemptQiBreakthrough(){
        if (!canAttemptQiBreakthrough(state)) return;

        setState((previous) => {
            const chance = computeQiBreakthroughChance(previous);
            const success = Math.random() <= chance;

            if(!success) {
                return{
                    ...previous,
                    qi:{
                        ...previous.qi,
                        fill: previous.qi.fill * 0.5,
                    },
                    
                };
            }
            const nextQiPosition = getNextQiPosition(previous.qi);
            
            /*On success, three slices change:
                qi: advances stage/realm and resets fill
                body: gains one spark
                life: updates lifetime stats*/
                
            return {
            ...previous,

            qi: {
                ...previous.qi,
                ...nextQiPosition,
                fill: 0,
            },
            body: {
                ...previous.body,
                sparks: previous.body.sparks + 1,
            },
            life: {
                ...previous.life,
                lifetimeStats: {
                ...previous.life.lifetimeStats,
                highestQiRealm: Math.max(
                    previous.life.lifetimeStats.highestQiRealm,
                    nextQiPosition.realmIndex,
                ),
                breakthroughsTaken: previous.life.lifetimeStats.breakthroughsTaken + 1,
                },
            },
            }

        });
    }

    function attemptBodyBreakthrough() {
        if (!canAttemptBodyBreakthrough(state)) return;

        setState((previous) => {
            if (!canAttemptBodyBreakthrough(previous)) return previous;

            const chance = computeBodyBreakthroughChance(previous);
            const success = Math.random() <= chance;

            if (!success) {
            return {
                ...previous,
                body: {
                ...previous.body,
                fill: previous.body.fill * 0.6,
                trials: Math.max(0, previous.body.trials - 1),
                },
            };
            }

            const nextBodyPosition = getNextBodyPosition(previous.body);
            const trialCost = getBodyTrialCost(previous);

            return {
            ...previous,
            qi: {
                ...previous.qi,
                fill: Math.min(1, previous.qi.fill + 0.15),
            },
            body: {
                ...previous.body,
                ...nextBodyPosition,
                fill: 0,
                trials: previous.body.trials - trialCost,
                sparks: previous.body.sparks - 1,
            },
            life: {
                ...previous.life,
                lifetimeStats: {
                ...previous.life.lifetimeStats,
                highestBodyRealm: Math.max(
                    previous.life.lifetimeStats.highestBodyRealm,
                    nextBodyPosition.realmIndex,
                ),
                breakthroughsTaken: previous.life.lifetimeStats.breakthroughsTaken + 1,
                },
            },
            };
        });
    }
    
    return{
        attemptQiBreakthrough,
        attemptBodyBreakthrough,
    }

}

