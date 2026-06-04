import type { CombatLogDrop, PlayerState } from '../../types/state';

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
           {state.combat.combatLog.map((entry) => (
  <p key={entry.id}>
    <span className="combat-log__time">[{entry.timestamp}]</span>{' '}
            <span>{entry.message}</span>
            {entry.count > 1 && (
              <>
                {' '}
                <span className="combat-log__count">({entry.count})</span>
              </>
            )}
            <LogDrops label="Drops" drops={entry.drops} />
            <LogDrops label="Salvaged" drops={entry.salvagedDrops} />
          </p>
        ))}
        </div>
      )}
    </section>
  );
}


interface LogDropsProps {
  label: string;
  drops?: CombatLogDrop[];
}

function LogDrops({ label, drops }: LogDropsProps) {
  if (!drops || drops.length === 0) {
    return null;
  }

  return (
    <>
      {' '}
      <span>{label}: </span>
      {drops.map((drop, index) => (
        <span
          key={`${drop.name}-${index}`}
          className={`rarity-text-${drop.rarity}`}
        >
          {drop.name}
          {index < drops.length - 1 ? ', ' : ''}
        </span>
      ))}
      <span>.</span>
    </>
  );
}