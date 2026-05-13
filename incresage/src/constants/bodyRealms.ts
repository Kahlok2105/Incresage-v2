import type { RealmDef } from '../types/realms';

// Body realms mirror Qi realm structure but are funded differently —
// body.fill comes from combat, not meditation time.
// fillRate here represents body fill gained per combat victory,
// not per second. The patience gate is therefore combat volume,
// not real time. The preparation gate (trials + sparks) runs in parallel.
//
// Body cultivation intentionally lags behind Qi cultivation —
// the player needs Qi breakthroughs to generate Sparks before
// body breakthroughs are even possible.

export const BODY_REALMS: RealmDef[] = [
  {
    id: 'body_mortal',
    name: 'Mortal Body',
    stages: [
      { label: 'Early',  fillRate: 0.12, baseBreakRate: 0.88, lifespanYears: 80   },
      { label: 'Middle', fillRate: 0.09, baseBreakRate: 0.78, lifespanYears: 90   },
      { label: 'Late',   fillRate: 0.06, baseBreakRate: 0.58, lifespanYears: 100  },
    ],
  },
  {
    id: 'body_refining',
    name: 'Body Refining',
    stages: [
      { label: 'Early',  fillRate: 0.09, baseBreakRate: 0.83, lifespanYears: 150  },
      { label: 'Middle', fillRate: 0.07, baseBreakRate: 0.73, lifespanYears: 200  },
      { label: 'Late',   fillRate: 0.05, baseBreakRate: 0.53, lifespanYears: 250  },
    ],
  },
  {
    id: 'bone_forging',
    name: 'Bone Forging',
    stages: [
      { label: 'Early',  fillRate: 0.07, baseBreakRate: 0.78, lifespanYears: 300  },
      { label: 'Middle', fillRate: 0.05, baseBreakRate: 0.68, lifespanYears: 400  },
      { label: 'Late',   fillRate: 0.04, baseBreakRate: 0.48, lifespanYears: 500  },
    ],
  },
  {
    id: 'meridian_opening',
    name: 'Meridian Opening',
    stages: [
      { label: 'Early',  fillRate: 0.05, baseBreakRate: 0.73, lifespanYears: 750  },
      { label: 'Middle', fillRate: 0.04, baseBreakRate: 0.63, lifespanYears: 1000 },
      { label: 'Late',   fillRate: 0.03, baseBreakRate: 0.43, lifespanYears: 1200 },
    ],
  },
  {
    id: 'flesh_sanctification',
    name: 'Flesh Sanctification',
    stages: [
      { label: 'Early',  fillRate: 0.030, baseBreakRate: 0.68, lifespanYears: 2000 },
      { label: 'Middle', fillRate: 0.020, baseBreakRate: 0.58, lifespanYears: 3500 },
      { label: 'Late',   fillRate: 0.015, baseBreakRate: 0.38, lifespanYears: 5000 },
    ],
  },
  {
    id: 'golden_body',
    name: 'Golden Body',
    stages: [
      { label: 'Early',  fillRate: 0.012, baseBreakRate: 0.63, lifespanYears: 10000 },
      { label: 'Middle', fillRate: 0.008, baseBreakRate: 0.53, lifespanYears: 12000 },
      { label: 'Late',   fillRate: 0.005, baseBreakRate: 0.28, lifespanYears: 15000 },
    ],
  },
];

// Same gate structure as Qi realms — total technique level sum required
// before a Late body breakthrough can be attempted.
// Slightly lower thresholds than Qi since body cultivation
// already has the Sparks + Trials preparation gate on top.
export const BODY_LATE_BREAKTHROUGH_LEVEL_GATES: Record<string, number> = {
  body_mortal:          2,
  body_refining:        5,
  bone_forging:         8,
  meridian_opening:     15,
  flesh_sanctification: 25,
  golden_body:          60,
};