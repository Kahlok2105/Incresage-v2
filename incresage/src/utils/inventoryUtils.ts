import type { InventoryItem, ItemRarity, GearBonus, GearSlot } from '../types/inventory';
import type {MonsterDrop} from '../constants/monsters';
import { getItemTemplate } from '../constants/items';
import { MAX_INVENTORY_SIZE } from '../types/inventory';

// Utility function to create a new inventory item based on a template ID
export function createInventoryItem(templateId: string): InventoryItem {
 
    const template = getItemTemplate(templateId);

    if (!template) {
        throw new Error(`Invalid item template ID: ${templateId}`);
    }

    return {
    templateId,
    instanceId: crypto.randomUUID(),
    quantity: 1,
    isEquipped: false,
    rarity: rollItemRarity(),

  };
}



// filter = keep only drops that succeeded
// map = turn each successful drop into an owned inventory item
export function rollMonsterDrops(drops: MonsterDrop[]): InventoryItem[] {
  return drops
    .filter((drop) => Math.random() <= drop.chance)
    .map((drop) => createInventoryItem(drop.templateId));
}

// Rolls a random item rarity based on predefined probabilities
export function rollItemRarity(): ItemRarity {{
    const roll = Math.random();
    if (roll < 0.01) return 'legendary';
    if (roll < 0.05) return 'epic';
    if (roll < 0.15) return 'rare';
    if (roll < 0.35) return 'exquisite';
    return 'common';
}}

// Multiplies the base stats of a gear item by a multiplier based on its rarity
export function getRarityMultiplier(rarity: ItemRarity): number {
  switch (rarity) {
    case 'common':
      return 1;
    case 'exquisite':
      return 1.5;
    case 'rare':
      return 2;
    case 'epic':
      return 3;
    case 'legendary':
      return 5;
  }
}

export function scaleGearBonus(
  bonus: GearBonus | undefined,
  rarity: ItemRarity,
): GearBonus {
  if (!bonus) {
    return {};
  }

  const multiplier = getRarityMultiplier(rarity);

  return {
    attackPower: bonus.attackPower
      ? Math.ceil(bonus.attackPower * multiplier)
      : undefined,
    defensePower: bonus.defensePower
      ? Math.ceil(bonus.defensePower * multiplier)
      : undefined,
  };
}


interface AddInventoryResult {
  inventory: InventoryItem[];
  addedItems: InventoryItem[];
  lostItems: InventoryItem[];
}

export function addItemsToInventory(
  currentInventory: InventoryItem[],
  incomingItems: InventoryItem[],
): AddInventoryResult {
  const nextInventory = [...currentInventory];
  const addedItems: InventoryItem[] = [];
  const lostItems: InventoryItem[] = [];

  incomingItems.forEach((item) => {
    const template = getItemTemplate(item.templateId);

    if (template?.stackable) {
      const existingStack = nextInventory.find(
        (candidate) => candidate.templateId === item.templateId,
      );

      if (existingStack) {
        existingStack.quantity += item.quantity;
        addedItems.push(item);
        return;
      }
    }

    if (nextInventory.length >= MAX_INVENTORY_SIZE) {
      lostItems.push(item);
      return;
    }

    nextInventory.push(item);
    addedItems.push(item);
  });

  return {
    inventory: nextInventory,
    addedItems,
    lostItems,
  };
}

export function getSalvageMultiplier(rarity: ItemRarity): number{
    switch (rarity){
    case 'common':
        return 1.1;
        case 'exquisite':
        return 1.5;
        case 'rare':
        return 2;   
        case 'epic':
        return 3;
        case 'legendary':
        return 5;
    }
}

//To get the equipped item by which slot it is in

export function getEquippedItemBySlot(
  inventory: InventoryItem[],
  slot: GearSlot,
): InventoryItem | null{
  return inventory.find((item) => {
    if(!item.isEquipped){
        return false;
    }
    
    const template = getItemTemplate(item.templateId);
  
    return template?.slot === slot;
  }) ?? null;
}
