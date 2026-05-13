// Ten monsters in ascending difficulty order.
// HP and attack are small integers — never inflate past ~500 by design.
// bodyFill is the fraction added to body.fill on victory (0.0 to 1.0).
// trials is a one-time reward — only granted the first time this monster is defeated.
// spiritStones is earned on every victory.

export interface MonsterDef {
  id:           string;
  name:         string;
  description:  string;
  difficulty:   number;   // 1–10, for display and unlock gating
  hp:           number;
  attack:       number;
  fillReward:   number;   // fill added to body.fill per victory
  trialsReward: number;   // one-time trial reward on first defeat
  spiritStones: number;   // spirit stones earned per victory
  unlockRealmIndex: number; // minimum Qi realmIndex before this monster appears
}

export const MONSTERS: MonsterDef[] = [
  {
    id:               'spirit_wisp',
    name:             'Spirit Wisp',
    description:      'A wandering fragment of ambient Qi. Barely conscious, barely dangerous.',
    difficulty:       1,
    hp:               30,
    attack:           3,
    fillReward:       0.02,
    trialsReward:     1,
    spiritStones:     5,
    unlockRealmIndex: 1,   // available from Qi Condensation onward
  },
  {
    id:               'forest_wolf',
    name:             'Forest Wolf',
    description:      'A beast that has absorbed ambient Qi over years. Its instincts are unnaturally sharp.',
    difficulty:       2,
    hp:               55,
    attack:           6,
    fillReward:       0.03,
    trialsReward:     1,
    spiritStones:     8,
    unlockRealmIndex: 1,
  },
  {
    id:               'earth_golem',
    name:             'Earth Golem',
    description:      'Animated stone given purpose by a long-dead formation array.',
    difficulty:       3,
    hp:               90,
    attack:           10,
    fillReward:       0.04,
    trialsReward:     2,
    spiritStones:     12,
    unlockRealmIndex: 2,   // Foundation Establishment
  },
  {
    id:               'fire_imp',
    name:             'Fire Imp',
    description:      'Small, spiteful, and perpetually on fire. More dangerous than it looks.',
    difficulty:       4,
    hp:               70,
    attack:           16,
    fillReward:       0.05,
    trialsReward:     2,
    spiritStones:     18,
    unlockRealmIndex: 2,
  },
  {
    id:               'shadow_stalker',
    name:             'Shadow Stalker',
    description:      'It does not hunt by sight. You will not hear it coming.',
    difficulty:       5,
    hp:               130,
    attack:           20,
    fillReward:       0.06,
    trialsReward:     3,
    spiritStones:     25,
    unlockRealmIndex: 3,   // Core Formation
  },
  {
    id:               'rock_elemental',
    name:             'Rock Elemental',
    description:      'A mountain given a bad temperament.',
    difficulty:       6,
    hp:               200,
    attack:           24,
    fillReward:       0.07,
    trialsReward:     3,
    spiritStones:     35,
    unlockRealmIndex: 3,
  },
  {
    id:               'wind_spirit',
    name:             'Wind Spirit',
    description:      'Strikes before you finish the thought of defending yourself.',
    difficulty:       7,
    hp:               160,
    attack:           34,
    fillReward:       0.08,
    trialsReward:     4,
    spiritStones:     45,
    unlockRealmIndex: 4,   // Nascent Soul
  },
  {
    id:               'ice_golem',
    name:             'Ice Golem',
    description:      'Slow, patient, and absolutely certain it will outlast you.',
    difficulty:       8,
    hp:               300,
    attack:           40,
    fillReward:       0.09,
    trialsReward:     4,
    spiritStones:     60,
    unlockRealmIndex: 4,
  },
  {
    id:               'thunder_beast',
    name:             'Thunder Beast',
    description:      'The sound of its approach is the sound of something going very wrong.',
    difficulty:       9,
    hp:               260,
    attack:           55,
    fillReward:       0.10,
    trialsReward:     5,
    spiritStones:     80,
    unlockRealmIndex: 5,   // Spirit Severing
  },
  {
    id:               'ancient_guardian',
    name:             'Ancient Guardian',
    description:      'It has been here longer than your sect. It will be here after.',
    difficulty:       10,
    hp:               450,
    attack:           70,
    fillReward:       0.12,
    trialsReward:     5,
    spiritStones:     120,
    unlockRealmIndex: 5,
  },
];