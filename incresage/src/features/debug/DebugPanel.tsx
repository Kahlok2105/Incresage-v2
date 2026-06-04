import type { Dispatch, SetStateAction } from 'react';
import type { PlayerState } from '../../types/state';

interface DebugPanelProps {
  setState: Dispatch<SetStateAction<PlayerState>>;
}

export function DebugPanel({ setState }: DebugPanelProps) {
  function nearDeath() {
    setState((previous) => ({
      ...previous,
      life: {
        ...previous.life,
        lifespanFill: 0.999,
      },
    }));
  }

  function addQiFill() {
    setState((previous) => ({
      ...previous,
      qi: {
        ...previous.qi,
        fill: Math.min(1, previous.qi.fill + 0.50),
      },
    }));
  }

  function addBodyFill() {
    setState((previous) => ({
      ...previous,
      body: {
        ...previous.body,
        fill: Math.min(1, previous.body.fill + 0.50),
      },
    }));
  }

  return (
    <section className="panel">
      <h2>Debug</h2>
      <div className="action-row">
        <button type="button" onClick={nearDeath}>
          Near Death
        </button>
        <button type="button" onClick={addQiFill}>
          +50% Qi Fill
        </button>
        <button type="button" onClick={addBodyFill}>
          +50% Body Fill
        </button>
      </div>
    </section>
  );
}