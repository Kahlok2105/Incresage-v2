import { MONSTERS } from "../constants/monsters";
import type { PlayerState } from "../types/state";

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

export function getVitalityCap(state: PlayerState): number{
    return (state.qi.realmIndex + 1) * (state.body.realmIndex + 1) * 20;
}

export function getSpiritCap(state: PlayerState): number {
  return 50 + state.qi.realmIndex * 25;
}

export function getCurrentVitality(state: PlayerState): number {
  return Math.round(state.combat.vitalityFill * getVitalityCap(state));
}

export function getCurrentSpirit(state: PlayerState): number {
  return Math.round(state.combat.spiritFill * getSpiritCap(state));
}