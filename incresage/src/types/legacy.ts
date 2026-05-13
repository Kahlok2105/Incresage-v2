// Types related to reincarnation and cross-life persistence.
// Kept separate because this system is self-contained.
// It only activates at end of life and only reads from other slices.

export interface LifetimeStats {
  highestQiRealm:     number;
  highestBodyRealm:   number;
  monstersDefeated:   number;
  breakthroughsTaken: number;
  lifespanFill:       number;
}

export interface Imprint {
  techniqueId:    string;
  preservedLevel: number;
}

export interface ReincarnationSummary extends LifetimeStats {
  lifeNumber:      number;
  echoesEarned:    number;
  imprintsEarned:  Imprint[];
}

export interface EchoShopPerk {
  id:           string;
  name:         string;
  description:  string;
  cost:         number;
  maxPurchases: number;
}
