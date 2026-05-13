// Techniques are the player's meditation methods.
// Each has a set of traits — the engine resolves trait effects each tick.
// Actual technique data lives in src/constants/techniques.ts

// Describes what a technique does — resolved in useGameTick
export type TechniqueTrait =
  | 'qi_focus'         // improves Qi fill rate
  | 'body_resilience'  // reduces body breakthrough failure penalty
  | 'insight_deep'     // boosts Insight gain per second
  | 'combat_edge'      // improves attack and defense
  | 'lifespan_extend' // lifespan fills more slowly (live longer)
  | 'magicfind_rate'; // increases chance of better item drops from monsters

export interface Technique {
  id:          string;
  name:        string;
  description: string;
  level:       number;       // 1 to 50
  exp:         number;       // current exp toward next level
  traits:      TechniqueTrait[];
}

export interface BattleTechnique {
  id:        string;
  name:      string;
  trait:     'attack' | 'defense' | 'vitality' | 'spirit';
  tier:      number;      // 1 to 5
  tierCosts: number[];    // cumulative spirit stone cost per tier, e.g. [10, 30, 70, 150, 300]
}