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
           {state.combat.combatLog.map((entry) => (
  <p key={entry.id}>
    <span className="combat-log__time">[{entry.timestamp}]</span>{' '}
            <span>{entry.message}</span>
            {entry.drops && entry.drops.length > 0 && (
              <>
                {' '}
                <span>Drops: </span>
                {entry.drops.map((drop, index) => (
                  <span
                    key={`${drop.name}-${index}`}
                    className={`rarity-text-${drop.rarity}`}
                  >
                    {drop.name}
                    {index < entry.drops!.length - 1 ? ', ' : ''}
                  </span>
                ))}
                <span>.</span>
              </>
            )}
            {entry.salvagedDrops && entry.salvagedDrops.length > 0 && (
              <>
                {' '}
                <span>Salvaged: </span>
                {entry.salvagedDrops.map((drop, index) => (
                  <span
                    key={`${drop.name}-${index}`}
                    className={`rarity-text-${drop.rarity}`}
                  >
                    {drop.name}
                    {index < entry.salvagedDrops!.length - 1 ? ', ' : ''}
                  </span>
                ))}
                <span>.</span>
              </>
            )}
          </p>
        ))}
        </div>
      )}
    </section>
  );
}