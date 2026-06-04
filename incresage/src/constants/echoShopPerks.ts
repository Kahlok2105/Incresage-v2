import type { EchoShopPerk } from '../types/legacy';

export const ECHO_SHOP_PERKS: EchoShopPerk[] = [
  {
    id: 'soul_anchor',
    name: 'Soul Anchor',
    description:
      'Your soul remembers its past. On reincarnation, preserved techniques gain 1 additional level.',
    cost: 5,
    maxPurchases: 10,
  },
  {
    id: 'spark_of_genesis',
    name: 'Spark of Genesis',
    description:
      'The first flame kindles anew. Start each life with 1 additional Body Spark.',
    cost: 3,
    maxPurchases: 5,
  },
];