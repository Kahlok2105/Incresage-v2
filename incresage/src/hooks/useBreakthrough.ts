import type { Dispatch, SetStateAction} from "react";
import type {  PlayerState } from "../types/state";
import {canAttemptQiBreakthrough, computeQiBreakthroughChance } from "../utils/breakthroughCalc";
import { getNextQiPosition } from "../utils/realmUtils";


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

            return{
                attemptQiBreakthrough
            }
    }