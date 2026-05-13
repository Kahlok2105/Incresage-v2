import type { Dispatch, SetStateAction} from "react";
import type {  PlayerState } from "../types/state";
import {canAttemptQiBreakthrough, computeQiBreakthroughChance } from "../utils/breakthroughCalc";

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

            return previous;});

        }

        return{
            attemptQiBreakthrough
        }
    }