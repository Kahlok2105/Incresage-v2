import type { RealmDef } from '../types/realms';

// fillRate drops significantly at higher realms — this is the patience gate.
// A player cannot rush Spirit Severing through luck alone; the bar physically
// moves too slowly. The preparation gate (technique level sum) runs in parallel.
// Both must be satisfied before a Late breakthrough can be attempted.

export const QI_REALMS: RealmDef[] = [
  {
    id: 'mortal',
    name: 'Mortal',
    stages: [
      { label: 'Early',  fillRate: 0.050, baseBreakRate: 0.90, lifespanYears: 80  },
      { label: 'Middle', fillRate: 0.020, baseBreakRate: 0.80, lifespanYears: 90  },
      { label: 'Late',   fillRate: 0.010, baseBreakRate: 0.60, lifespanYears: 100  },
    ],
  },
  {
    id: 'qi_condensation',
    name: 'Qi Condensation',
    stages: [
      { label: 'Early',  fillRate: 0.007, baseBreakRate: 0.85, lifespanYears: 150  },
      { label: 'Middle', fillRate: 0.006, baseBreakRate: 0.75, lifespanYears: 200  },
      { label: 'Late',   fillRate: 0.005, baseBreakRate: 0.55, lifespanYears: 250  },
    ],
  },
  {
    id: 'foundation_establishment',
    name: 'Foundation Establishment',
    stages: [
      { label: 'Early',  fillRate: 0.006, baseBreakRate: 0.80, lifespanYears: 300  },
      { label: 'Middle', fillRate: 0.005, baseBreakRate: 0.70, lifespanYears: 400  },
      { label: 'Late',   fillRate: 0.004, baseBreakRate: 0.50, lifespanYears: 500  },
    ],
  },
  {
    id: 'core_formation',
    name: 'Core Formation',
    stages: [
      { label: 'Early',  fillRate: 0.005, baseBreakRate: 0.75, lifespanYears: 750 },
      { label: 'Middle', fillRate: 0.004, baseBreakRate: 0.65, lifespanYears: 1000 },
      { label: 'Late',   fillRate: 0.003, baseBreakRate: 0.45, lifespanYears: 1200 },
    ],
  },
  {
    id: 'nascent_soul',
    name: 'Nascent Soul',
    stages: [
      { label: 'Early',  fillRate: 0.0020, baseBreakRate: 0.70, lifespanYears: 2000 },
      { label: 'Middle', fillRate: 0.0015, baseBreakRate: 0.60, lifespanYears: 3500 },
      { label: 'Late',   fillRate: 0.0010, baseBreakRate: 0.40, lifespanYears: 5000 },
    ],
  },
  {
    id: 'spirit_severing',
    name: 'Spirit Severing',
    stages: [
      { label: 'Early',  fillRate: 0.0008, baseBreakRate: 0.65, lifespanYears: 10000 },
      { label: 'Middle', fillRate: 0.0005, baseBreakRate: 0.55, lifespanYears: 12000 },
      { label: 'Late',   fillRate: 0.0001, baseBreakRate: 0.30, lifespanYears: 15000 },
    ],
  },
];