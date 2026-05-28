import { FillBar } from '../../components/FillBar';
import type { PlayerState } from '../../types/state';
import {
  getAttackPower,
  getCurrentVitality,
  getCurrentSpirit,
  getSelectedMonster,
  getVitalityCap,
  getSpiritCap,
  getDefensePower,
} from '../../utils/combatUtils';

interface CombatTargetProps {
  state: PlayerState;
}

export function CombatTarget({ state }: CombatTargetProps) {
  const monster = getSelectedMonster(state);
  const vitalityCap = getVitalityCap(state);
  const currentVitality = getCurrentVitality(state);
  const spiritCap = getSpiritCap(state);
  const currentSpirit = getCurrentSpirit(state);

  if (!monster) {
  return (
      <section className="panel">
        <h2>Combat</h2>
        <p>Select a monster to begin hunting.</p>
        <span>Vitality: {currentVitality} / {vitalityCap}</span>
        <FillBar value={state.combat.vitalityFill} />
      </section>
    );
}

  const attackPower = getAttackPower(state);
  const defensePower = getDefensePower(state);

  const monsterHpRatio = state.combat.monsterHp / monster.hp;

  return (
    <section className="panel">
      <h2>Combat</h2>

      <div className="combat-target">
        <strong>{monster.name}</strong>
        <div className="combat-stats">
            <span>Attack: {attackPower}</span>
            <span>Defense: {defensePower}</span>
            <span>Vitality: {currentVitality} / {vitalityCap}</span>
            <span>Spirit: {currentSpirit} / {spiritCap}</span>
        </div>
        <FillBar value={state.combat.vitalityFill} />
        <span>Monster HP</span>
        <FillBar value={monsterHpRatio} />

      </div>
    </section>
  );
}