import type { MonsterDef } from '../../constants/monsters';
import type { PlayerState } from '../../types/state';
import { getAvailableMonsters } from '../../utils/combatUtils';

interface MonsterListProps {
  state: PlayerState;
  onSelectMonster: (monsterId: string) => void;
}

export function MonsterList({ state, onSelectMonster }: MonsterListProps) {
  const monsters = getAvailableMonsters(state);

  return (
    <section className="panel">
      <h2>Hunting Grounds</h2>

      <div className="monster-list">
        {monsters.map((monster) => (
          <MonsterButton
            key={monster.id}
            monster={monster}
            isSelected={monster.id === state.combat.selectedMonsterId}
            onSelect={() => onSelectMonster(monster.id)}
          />
        ))}
      </div>
    </section>
  );
}

interface MonsterButtonProps {
  monster: MonsterDef;
  isSelected: boolean;
  onSelect: () => void;
}

function MonsterButton({ monster, isSelected, onSelect }: MonsterButtonProps) {
  return (
    <button
      type="button"
      className={`monster-button ${isSelected ? 'monster-button--selected' : ''}`}
      onClick={onSelect}
    >
      <strong>{monster.name}</strong>
      <span>Difficulty {monster.difficulty}</span>
      <small>
        HP {monster.hp} - Attack {monster.attack} - Body +{Math.round(monster.fillReward * 100)}%
      </small>
    </button>
  );
}