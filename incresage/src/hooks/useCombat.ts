import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { MONSTERS } from '../constants/monsters';
import type { PlayerState } from '../types/state';
import { addCombatLog, getSelectedMonster, getVitalityCap } from '../utils/combatUtils';


const COMBAT_TICK_MS = 2000;

export function useCombat(
  setState: Dispatch<SetStateAction<PlayerState>>,
) {
  function selectMonster(monsterId: string) {
    setState((previous) => {

      const monster = MONSTERS.find((candidate) => candidate.id === monsterId);

      if (!monster || monster.unlockRealmIndex > previous.qi.realmIndex) {
        return previous;
      }

      return {
        ...previous,
        combat: {
          ...previous.combat,
          selectedMonsterId: monster.id,
          monsterHp: monster.hp,
          combatLog: addCombatLog(
            previous.combat.combatLog,
            `${monster.name} selected! Prepare for battle!`,
          ),
        },
      };
    });
  }

  useEffect(() => {
  const timerId = window.setInterval(() => {
    setState((previous) => {
        const battleLossRecovery = Math.min(
            1, previous.combat.vitalityFill + 0.02,
        )

      const monster = getSelectedMonster(previous);

      if (!monster) {
        return {
            ...previous,
            combat: {
                ...previous.combat,
                vitalityFill: battleLossRecovery,
            }
        };  
      }

      const playerDamage = previous.combat.attackPower;
      const monsterDamage = Math.max(
        1,
        monster.attack - previous.combat.defensePower,
      );

      const nextMonsterHp = previous.combat.monsterHp - playerDamage;
      const vitalityCap = getVitalityCap(previous);
      const vitalityDamageRatio = monsterDamage / vitalityCap;
      const nextVitalityFill = previous.combat.vitalityFill - vitalityDamageRatio;

      // Check for combat outcomes: monster defeat or player defeat
      // Monster defeat scenario
      if (nextMonsterHp <= 0) {
        const alreadyDefeated = previous.combat.defeatedMonsters.includes(monster.id);
        const trialsReward = alreadyDefeated ? 0 : monster.trialsReward;
        
        return {
          ...previous,
          body:{
            ...previous.body,
            fill: Math.min(1, previous.body.fill + monster.fillReward),
            trials: Math.min(
                previous.body.trialsMax,
                previous.body.trials + trialsReward,
            ),
          },
          combat: {
            ...previous.combat,
            monsterHp: monster.hp,
            defeatedMonsters: alreadyDefeated ? previous.combat.defeatedMonsters 
                : [...previous.combat.defeatedMonsters, monster.id],
            combatLog: addCombatLog(
              previous.combat.combatLog,
              alreadyDefeated
                  ? `Defeated ${monster.name}. Gained ${monster.spiritStones} spirit stones.`
                  : `First defeat: ${monster.name}. Gained ${monster.trialsReward} trials and ${monster.spiritStones} spirit stones.`,
              ),
          },
          systems:{
            ...previous.systems,
            spiritStones: previous.systems.spiritStones + monster.spiritStones,
          },
          life:{
            ...previous.life,
            lifetimeStats:{
                ...previous.life.lifetimeStats,
                monstersDefeated: previous.life.lifetimeStats.monstersDefeated + 1,
            },
          },
        };
      }

      // Player defeat scenario
      if (nextVitalityFill <= 0) {
        return {
          ...previous,
          combat: {
            ...previous.combat,
            vitalityFill: 0,
            selectedMonsterId: null,
            monsterHp: 0,
            combatLog: addCombatLog(
              previous.combat.combatLog,
              `Defeated by ${monster.name}. Recovery in progress...`,
            ),
          },
        };
      }

      return {
        ...previous,
        combat: {
          ...previous.combat,
          monsterHp: nextMonsterHp,
          vitalityFill: nextVitalityFill,
        },
      };
    });
  }, COMBAT_TICK_MS);

    return () => window.clearInterval(timerId);
    }, [setState]);

  return {
    selectMonster,
  };
}