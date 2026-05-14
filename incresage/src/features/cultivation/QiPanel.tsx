import { FillBar } from "../../components/FillBar";
import type { PlayerState } from "../../types/state";
import { getQiRealmName, getQiStageLabel } from "../../utils/realmUtils";
import { canAttemptQiBreakthrough, computeQiBreakthroughChance } from "../../utils/breakthroughCalc";
import { getInsightCap } from "../../utils/insightUtils";




interface QiPanelProps {
    state: PlayerState;
    onAttemptBreakthrough: () => void;
}

export function QiPanel({ state, onAttemptBreakthrough }: QiPanelProps) {
    const chance = Math.round(computeQiBreakthroughChance(state) * 100);
    const canAttempt = canAttemptQiBreakthrough(state);
    const buttonLabel = canAttempt ? 'Attempt Breakthrough' : 'Requires 75% Qi';
    const insightCap = getInsightCap(state);

    return (
            <section className="panel">
                <h2>Qi Cultivation</h2>

                <p>
                    {getQiRealmName(state.qi)} - {getQiStageLabel(state.qi)}
                </p>

                <FillBar value={state.qi.fill} />

                <p>Breakthrough chance: {chance}%</p>
                <p>Insight: {Math.floor(state.qi.insight)} / {insightCap}</p>
                <p>Body Sparks: {state.body.sparks}</p>
                <div className="action-row">
                    <button
                        onClick={onAttemptBreakthrough}
                        disabled={!canAttempt}
                    >
                        {buttonLabel}
                    </button>
                    </div>

            </section>
    )
}