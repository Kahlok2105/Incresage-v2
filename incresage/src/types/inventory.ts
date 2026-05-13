// Items the player can own, find, and equip.
// Only two gear slots exist right now: weapon and accessory.
// More slots get added when new gear exists, not before.

export type ItemRarity = 'common' | 'exquisite' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'material' | 'pill' | 'gear';
export type GearSlot = 'weapon' | 'accessory';

// The template is the blueprint: one per item type in the game.
// InventoryItem is an instance of a template the player owns.
export interface ItemTemplate {
  id:           string;
  type:         ItemType;
  name:         string;
  description:  string;
  rarity:       ItemRarity;
  stackable:    boolean;
  slot?:        GearSlot;
  statBonus?:   GearBonus;
}

export interface GearBonus {
  attackPower?:  number;
  defensePower?: number;
}

export interface InventoryItem {
  templateId:  string;
  instanceId:  string;
  quantity:    number;
  isEquipped:  boolean;
}
