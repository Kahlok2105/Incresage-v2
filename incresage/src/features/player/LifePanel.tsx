import { FillBar } from '../../components/FillBar';
import type { PlayerState } from '../../types/state';
import { getMaxLifespanSeconds, formatLifespanRemaining } from '../../utils/lifespanUtils';

interface LifePanelProps {
  state: PlayerState;
}

export function LifePanel({ state }: LifePanelProps) {
  const maxSeconds = getMaxLifespanSeconds(state);
  const remaining = formatLifespanRemaining(state.life.lifespanFill, maxSeconds);
  const remainingRatio = 1 - state.life.lifespanFill;

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ margin: 0 }}>Life</h2>
        <span style={{ color: '#c9c7b5', fontSize: '0.9rem' }}>
          Life #{state.legacy.reincarnationCount + 1}
        </span>
      </div>

      <div className="lifespan-bar">
        <FillBar value={remainingRatio} label={`${remaining} remaining`} />
      </div>
    </section>
  );
}