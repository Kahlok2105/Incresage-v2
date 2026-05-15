import type { PlayerState } from '../../types/state';
import {
  getCurrentSpirit,
  getCurrentVitality,
  getSpiritCap,
  getVitalityCap,
} from '../../utils/combatUtils';

interface PlayerPanelProps {
  state: PlayerState;
}

export function PlayerPanel({ state }: PlayerPanelProps) {
  const vitalityCap = getVitalityCap(state);
  const spiritCap = getSpiritCap(state);
  const currentVitality = getCurrentVitality(state);
  const currentSpirit = getCurrentSpirit(state);

  return (
    <section className="panel">
      <h2>Player</h2>

      <div className="player-stat-grid">
        <span>Attack: {state.combat.attackPower}</span>
        <span>Defense: {state.combat.defensePower}</span>
        <span>Vitality: {currentVitality} / {vitalityCap}</span>
        <span>Spirit: {currentSpirit} / {spiritCap}</span>
        <span>Spirit Stones: {state.systems.spiritStones}</span>
        <span>Echoes: {state.legacy.echoes}</span>
      </div>
    </section>
  );
}