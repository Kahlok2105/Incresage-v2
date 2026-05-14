import { useGameState } from "./useGameState";
import { useGameTick } from "./useGameTick";
import { useBreakthrough } from "./useBreakthrough";
import { useTechnique } from "./useTechnique";

export function useGameLoop() {
    const {state, setState} = useGameState();
    const breakthrough = useBreakthrough(state, setState);
    const technique = useTechnique(setState);

    useGameTick(setState);

    return {
        state,
        ...breakthrough,
        ...technique,
    }}