import { useGameState } from "./useGameState";
import { useGameTick } from "./useGameTick";
import { useBreakthrough } from "./useBreakthrough";
import { useTechnique } from "./useTechnique";
import { useCombat } from "./useCombat";
import { useUpgrades } from "./useUpgrades";

export function useGameLoop() {
    const {state, setState} = useGameState();
    const breakthrough = useBreakthrough(state, setState);
    const technique = useTechnique(setState);
    const combat = useCombat(setState);
    const upgrades = useUpgrades(setState);

    useGameTick(setState);

    return {
        state,
        ...breakthrough,
        ...technique,
        ...combat,
        ...upgrades
    }}
