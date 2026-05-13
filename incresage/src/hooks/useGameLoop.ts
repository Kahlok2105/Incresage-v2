import { useGameState } from "./useGameState";
import { useGameTick } from "./useGameTick";
import { useBreakthrough } from "./useBreakthrough";

export function useGameLoop() {
    const {state, setState} = useGameState();
    const breakthrough = useBreakthrough(state, setState);
    useGameTick(setState);

    return {
        state,
        ...breakthrough,
    }}