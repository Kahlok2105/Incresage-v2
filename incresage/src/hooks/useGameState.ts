
import {useEffect, useState} from "react";
import { INITIAL_PLAYER_STATE } from "../constants/initialState";
import type { PlayerState } from "../types/state";

const SAVE_KEY = 'incresage-v2-player-state';

function loadSavedState(): PlayerState {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return INITIAL_PLAYER_STATE;

    try {
        return JSON.parse(saved) as PlayerState;
    }catch {
        return INITIAL_PLAYER_STATE;
    }
}

export function useGameState() {
    const [state, setState] = useState<PlayerState>(loadSavedState());

    useEffect(() => {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }, [state]);

    return { 
        state, 
        setState 
    };
}
