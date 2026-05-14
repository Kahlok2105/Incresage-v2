
import {useEffect, useState} from "react";
import { INITIAL_PLAYER_STATE } from "../constants/initialState";
import type { PlayerState } from "../types/state";

const SAVE_KEY = 'incresage-v2-player-state';

function loadSavedState(): PlayerState {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return INITIAL_PLAYER_STATE;

    try {
        const parsed = JSON.parse(saved) as PlayerState;

        return {
        ...INITIAL_PLAYER_STATE,
        ...parsed,
        qi: {
            ...INITIAL_PLAYER_STATE.qi,
            ...parsed.qi,
        },
        body: {
            ...INITIAL_PLAYER_STATE.body,
            ...parsed.body,
        },
        combat: {
            ...INITIAL_PLAYER_STATE.combat,
            ...parsed.combat,
        },
        life: {
            ...INITIAL_PLAYER_STATE.life,
            ...parsed.life,
        },
        legacy: {
            ...INITIAL_PLAYER_STATE.legacy,
            ...parsed.legacy,
        },
        systems: {
            ...INITIAL_PLAYER_STATE.systems,
            ...parsed.systems,
        },
        };
    }catch {
        return INITIAL_PLAYER_STATE;
    }
}

export function useGameState() {

    // We are retiring this as it loads and renders the game evry tick. 
    // const [state, setState] = useState<PlayerState>(loadSavedState());
    
   // New loading method that only loads once on initial render, and then saves on every state change.
   // Laze Initializer where the function is only called once to set the initial state, preventing unnecessary parsing on every render.
    const [state, setState] = useState<PlayerState>(() => loadSavedState());

    useEffect(() => {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }, [state]);

    return { 
        state, 
        setState 
    };
}
