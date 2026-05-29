import type { InventoryItem } from '../types/inventory';
import type {MonsterDrop} from '../constants/monsters';

// Utility function to create a new inventory item based on a template ID
export function createInventoryItem(templateId: string): InventoryItem {
  return {
    templateId,
    instanceId: crypto.randomUUID(),
    quantity: 1,
    isEquipped: false,
  };
}



// filter = keep only drops that succeeded
// map = turn each successful drop into an owned inventory item
export function rollMonsterDrops(drops: MonsterDrop[]): InventoryItem[] {
  return drops
    .filter((drop) => Math.random() <= drop.chance)
    .map((drop) => createInventoryItem(drop.templateId));
}