import type { Dispatch, SetStateAction} from "react";
import type {  PlayerState } from "../types/state";
import {canAttemptQiBreakthrough, computeQiBreakthroughChance, canAttemptBodyBreakthrough, computeBodyBreakthroughChance } from "../utils/breakthroughCalc";
import { getNextBodyPosition, getNextQiPosition } from "../utils/realmUtils";


export function useBreakthrough(
    state: PlayerState,
    setState: Dispatch<SetStateAction<PlayerState>>,
    onBreakthroughSuccess?: () => void,
){
    function attemptQiBreakthrough(){
        setState((previous) => {
            // Move canAttempt check inside functional update to prevent stale state race conditions
            if (!canAttemptQiBreakthrough(previous)) return previous;

            const chance = computeQiBreakthroughChance(previous);
            const success = Math.random() <= chance;

            if(!success) {
                return{
                    ...previous,
                    qi:{
                        ...previous.qi,
                        fill: previous.qi.fill * 0.5,
                    },
                    life: {
                        ...previous.life,
                        lastUpdate: Date.now(),
                    },
                };
            }
            const nextQiPosition = getNextQiPosition(previous.qi);
            
            /*On success, three slices change:
                qi: advances stage/realm and resets fill
                body: gains one spark
                life: updates lifetime stats*/
            
            // Notify unlock check on next cycle
            setTimeout(() => onBreakthroughSuccess?.(), 0);

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
                lastUpdate: Date.now(),
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
                },
                life: {
                    ...previous.life,
                    lastUpdate: Date.now(),
                },
            };
            }

            const nextBodyPosition = getNextBodyPosition(previous.body);

            // Notify unlock check on next cycle
            setTimeout(() => onBreakthroughSuccess?.(), 0);

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
                sparks: previous.body.sparks - 1,
            },
            life: {
                ...previous.life,
                lastUpdate: Date.now(),
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

