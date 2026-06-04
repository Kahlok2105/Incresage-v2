import type { Dispatch, SetStateAction } from 'react';
import { getItemTemplate } from '../constants/items';
import type { PlayerState } from '../types/state';

export function useInventory(
  setState: Dispatch<SetStateAction<PlayerState>>,
) {
    // Unequip currently equipped item in the same slot, and equip the new item. 
    // If the item is already equipped, this will just unequip it.
  function equipItem(instanceId: string) {
    setState((previous) => {
      const item = previous.systems.inventory.find(
        (candidate) => candidate.instanceId === instanceId,
      );

      if (!item) {
        return previous;
      }

      const template = getItemTemplate(item.templateId);

      if (!template || template.type !== 'gear' || !template.slot) {
        return previous;
      }

      const nextInventory = previous.systems.inventory.map((candidate) => {
        const candidateTemplate = getItemTemplate(candidate.templateId);
        const isSameSlot =
          candidateTemplate?.type === 'gear' &&
          candidateTemplate.slot === template.slot;

        if (candidate.instanceId === instanceId) {
          return {
            ...candidate,
            isEquipped: true,
          };
        }

        if (isSameSlot) {
          return {
            ...candidate,
            isEquipped: false,
          };
        }

        return candidate;
      });

      return {
        ...previous,
        combat: {
          ...previous.combat,
          equippedItems: getEquippedItemIds(nextInventory),
        },
        systems: {
          ...previous.systems,
          inventory: nextInventory,
        },
      };
    });
  }

  function unequipItem(instanceId: string) {
    setState((previous) => {
      const nextInventory = previous.systems.inventory.map((item) => {
        if (item.instanceId !== instanceId) {
          return item;
        }

        return {
          ...item,
          isEquipped: false,
        };
      });

      return {
        ...previous,
        combat: {
          ...previous.combat,
          equippedItems: getEquippedItemIds(nextInventory),
        },
        systems: {
          ...previous.systems,
          inventory: nextInventory,
        },
      };
    });
  }

        function deleteItem(instanceId: string) {
        setState((previous) => {
          const nextInventory = previous.systems.inventory.filter(
            (item) => item.instanceId !== instanceId,
          );

          return {
            ...previous,
            combat: {
              ...previous.combat,
              equippedItems: getEquippedItemIds(nextInventory),
            },
            systems: {
              ...previous.systems,
              inventory: nextInventory,
            },
          };
        });
      }

      
  return {
    equipItem,
    unequipItem,
    deleteItem,
  };
}

function getEquippedItemIds(inventory: PlayerState['systems']['inventory']): string[] {
  return inventory
    .filter((item) => item.isEquipped)
    .map((item) => item.instanceId);
}