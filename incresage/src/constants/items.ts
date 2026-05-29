import type { ItemTemplate } from '../types/inventory';

export const ITEM_TEMPLATES: ItemTemplate[] = [
  {
    id: 'rusty_sword',
    type: 'gear',
    name: 'Rusty Sword',
    description: 'A chipped blade that still remembers how to cut. May cause mild tetanus.',
    rarity: 'common',
    stackable: false,
    slot: 'weapon',
    statBonus: {
      attackPower: 2,
    },
  },
  {
    id: 'wolf_fang_blade',
    type: 'gear',
    name: 'Wolf Fang Blade',
    description: 'A crude weapon carved from a spirit beast fang. It still has a bit of bite left in it.',
    rarity: 'exquisite',
    stackable: false,
    slot: 'weapon',
    statBonus: {
      attackPower: 5,
    },
  },
  {
    id: 'woven_guard_charm',
    type: 'gear',
    name: 'Woven Guard Charm',
    description: 'A small charm threaded with caresse, said to protect against harm.',
    rarity: 'common',
    stackable: false,
    slot: 'accessory',
    statBonus: {
      defensePower: 2,
    },
  },
  {
    id: 'stoneheart_bead',
    type: 'gear',
    name: 'Stoneheart Bead',
    description: 'A heavy bead that steadies the body under pressure. ',
    rarity: 'exquisite',
    stackable: false,
    slot: 'accessory',
    statBonus: {
      defensePower: 5,
    },
  },
];

export function getItemTemplate(templateId: string): ItemTemplate | null {
  return ITEM_TEMPLATES.find((item) => item.id === templateId) ?? null;
}