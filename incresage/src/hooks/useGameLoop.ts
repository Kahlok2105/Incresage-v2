import { useGameState } from "./useGameState";
import { useGameTick } from "./useGameTick";
import { useBreakthrough } from "./useBreakthrough";
import { useTechnique } from "./useTechnique";
import { useCombat } from "./useCombat";
import { useUpgrades } from "./useUpgrades";
import { useInventory } from "./useInventory";
import { useLifecycle } from "./useLifecycle";
import { useNotifications } from "./useNotifications";


export function useGameLoop() {
    const {state, setState} = useGameState();
    const { notifications, addNotification, dismissNotification } = useNotifications();
    const lifecycle = useLifecycle(state, setState, addNotification);
    const breakthrough = useBreakthrough(state, setState, lifecycle.applyFeatureUnlocks);
    const technique = useTechnique(setState);
    const combat = useCombat(setState);
    const upgrades = useUpgrades(setState);
    const inventory = useInventory(setState);

    useGameTick(setState, () => {
        addNotification('Your lifespan has ended. The cycle begins anew.', 'death');
    });

    return {
        state,
        setState,
        notifications,
        addNotification,
        dismissNotification,
        ...lifecycle,
        ...breakthrough,
        ...technique,
        ...combat,
        ...upgrades,
        ...inventory,
    }}
