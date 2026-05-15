import { MONSTERS } from "../constants/monsters";
import type { PlayerState } from "../types/state";
import type { BattleTechnique } from '../types/technique';
import { getBattleTechniqueBonus } from './upgradeUtils';

export function getSelectedMonster (state: PlayerState) {
    if(!state.combat.selectedMonsterId) return null;

    return MONSTERS.find(
        (monster) => monster.id === state.combat.selectedMonsterId,
    ) ?? null;
}

export function getAvailableMonsters(state: PlayerState) {
    return MONSTERS.filter(
        (monster) => monster.unlockRealmIndex <= state.qi.realmIndex,
    )
}

export function getVitalityCap(state: PlayerState): number {
  const vitalityTechnique = getBattleTechniqueByTrait(
    state.body.battleTechniques,
    'vitality',
  );

  const techniqueBonus = vitalityTechnique
    ? getBattleTechniqueBonus(vitalityTechnique) * 15
    : 0;

  return (state.qi.realmIndex + 1) * (state.body.realmIndex + 1) * 20 + techniqueBonus;
}

export function getSpiritCap(state: PlayerState): number {
  const spiritTechnique = getBattleTechniqueByTrait(
    state.body.battleTechniques,
    'spirit',
  );

  const techniqueBonus = spiritTechnique
    ? getBattleTechniqueBonus(spiritTechnique) * 15
    : 0;

  return 50 + state.qi.realmIndex * 25 + techniqueBonus;
}

export function getCurrentVitality(state: PlayerState): number {
  return Math.round(state.combat.vitalityFill * getVitalityCap(state));
}

export function getCurrentSpirit(state: PlayerState): number {
  return Math.round(state.combat.spiritFill * getSpiritCap(state));
}

function formatLogTime(date: Date): string {
  return date.toLocaleTimeString('en-SG', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function addCombatLog(
  currentLog: string[],
  message: string,
  maxEntries = 50,
): string[] {
  return [`[${formatLogTime(new Date())}] ${message}`, ...currentLog].slice(0, maxEntries);
}

function getBattleTechniqueByTrait(
  techniques: BattleTechnique[],
  trait: BattleTechnique['trait'],
): BattleTechnique | undefined {
  return techniques.find((technique) => technique.trait === trait);
}

export function getAttackPower(state: PlayerState): number {
  const attackTechnique = getBattleTechniqueByTrait(
    state.body.battleTechniques,
    'attack',
  );

  return state.combat.attackPower + (
    attackTechnique ? getBattleTechniqueBonus(attackTechnique) : 0
  );
}

export function getDefensePower(state: PlayerState): number {
  const defenseTechnique = getBattleTechniqueByTrait(
    state.body.battleTechniques,
    'defense',
  );

  return state.combat.defensePower + (
    defenseTechnique ? getBattleTechniqueBonus(defenseTechnique) : 0
  );
}