import { FillBar } from "../../components/FillBar";
import type { PlayerState } from "../../types/state";
import { getQiRealmName, getQiStageLabel } from "../../utils/realmUtils";
import { canAttemptQiBreakthrough, computeQiBreakthroughChance } from "../../utils/breakthroughCalc";




interface QiPanelProps {
    state: PlayerState;
    onAttemptBreakthrough: () => void;
}

export function QiPanel({ state, onAttemptBreakthrough }: QiPanelProps) {
    const chance = Math.round(computeQiBreakthroughChance(state) * 100);
    const canAttempt = canAttemptQiBreakthrough(state);
    
    return (
            <section className="panel">
                <h2>Qi Cultivation</h2>

                <p>
                    {getQiRealmName(state.qi)} - {getQiStageLabel(state.qi)}
                </p>

                <FillBar value={state.qi.fill} />

                <p>Breakthrough chance: {chance}%</p>
                
                <button 
                onClick={onAttemptBreakthrough} 
                disabled={!canAttempt}>
                    Attempt Breakthrough
                </button>

            </section>
    )
}