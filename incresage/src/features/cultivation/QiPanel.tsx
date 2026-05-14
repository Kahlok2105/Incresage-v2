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
    const buttonLabel = canAttempt ? 'Attempt Breakthrough' : 'Requires 75% Qi';
   
    return (
            <section className="panel">
                <h2>Qi Cultivation</h2>

                <p>
                    {getQiRealmName(state.qi)} - {getQiStageLabel(state.qi)}
                </p>

                <FillBar value={state.qi.fill} />

                <p>Breakthrough chance: {chance}%</p>
                <p>Body Sparks: {state.body.sparks}</p>
                <button 
                onClick={onAttemptBreakthrough} 
                disabled={!canAttempt}>
                    {buttonLabel}
                </button>

            </section>
    )
}