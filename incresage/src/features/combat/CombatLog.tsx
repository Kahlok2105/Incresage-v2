import type { PlayerState } from '../../types/state';

interface CombatLogProps {
  state: PlayerState;
}

export function CombatLog({ state }: CombatLogProps) {
  return (
    <section className="panel">
      <h2>Combat Log</h2>

      {state.combat.combatLog.length === 0 ? (
        <p>No combat events yet.</p>
      ) : (
        <div className="combat-log">
            {state.combat.combatLog.map((entry, index) => (
                <p key={`${entry}-${index}`}>{entry}</p>
            ))}
        </div>
      )}
    </section>
  );
}