import { FillBar } from '../../components/FillBar';
import type { PlayerState } from '../../types/state';
import {
  canAttemptBodyBreakthrough,
  computeBodyBreakthroughChance,
  getBodyTrialCost,
} from '../../utils/breakthroughCalc';
import { getBodyRealmName, getBodyStageLabel } from '../../utils/realmUtils';

interface BodyPanelProps {
  state: PlayerState;
  onAttemptBreakthrough: () => void;
}

export function BodyPanel({ state, onAttemptBreakthrough }: BodyPanelProps) {
  const chance = Math.round(computeBodyBreakthroughChance(state) * 100);
  const trialCost = getBodyTrialCost(state);
  const hasEnoughTrials = state.body.trials >= trialCost;
  const canAttempt = canAttemptBodyBreakthrough(state);
  const buttonLabel = canAttempt ? 'Attempt Body Breakthrough' : 'Needs Body Fill, Trials, and Spark';

  return (
    <section className="panel">
      <h2>Body Cultivation</h2>

      <p>
        {getBodyRealmName(state.body)} - {getBodyStageLabel(state.body)}
      </p>

      <FillBar value={state.body.fill} />

      <p>Breakthrough chance: {chance}%</p>
      <p>Trials Required: {trialCost} {hasEnoughTrials ? '✅' : `(have ${state.body.trials})`}</p>
      <p>Body Sparks: {state.body.sparks}</p>
    

        <div className="action-row">
        <button
            type="button"
            disabled={!canAttempt}
            onClick={onAttemptBreakthrough}
        >
            {buttonLabel}
        </button>
        </div>
    </section>
  );
}