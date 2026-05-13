// Defines the structure of a cultivation realm and its three stages.
// Actual realm data (the 6 Qi realms, 6 Body realms) lives in src/constants/
// — these are just the shapes that data conforms to.

export interface StageDef {
  label:         string;   // "Early", "Middle", "Late"
  // For Qi realms: fill gained per second while meditating
  // For Body realms: multiplier applied to monster fillReward on victory
  fillRate:      number;
  baseBreakRate: number;   // Base breakthrough success chance (0.0 to 1.0)
  lifespanYears: number;   // Max lifespan while at this stage
}

export interface RealmDef {
  id:     string;    // e.g. "qi_condensation"
  name:   string;    // e.g. "Qi Condensation"
  stages: StageDef[];  // Always exactly 3 — Early, Middle, Late
}