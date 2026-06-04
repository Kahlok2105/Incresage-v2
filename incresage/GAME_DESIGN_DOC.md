# Incresage — Game Design Document

> **Incresage** is an idle/incremental cultivation game built with React + TypeScript. The player progresses through two parallel cultivation paths — Qi (spiritual) and Body (physical) — while managing lifespan, combat, gear, and reincarnation across multiple lives.

---

## Table of Contents

1. [Overview](#1-overview)
2. [State Architecture](#2-state-architecture)
3. [Core Systems](#3-core-systems)
   - [Qi Cultivation](#31-qi-cultivation)
   - [Body Cultivation](#32-body-cultivation)
   - [Meditation Techniques](#33-meditation-techniques)
   - [Battle Techniques](#34-battle-techniques)
   - [Combat System](#35-combat-system)
   - [Inventory & Equipment](#36-inventory--equipment)
   - [Life & Lifespan](#37-life--lifespan)
   - [Legacy & Reincarnation](#38-legacy--reincarnation--future--stub)
4. [Game Constants & Data](#4-game-constants--data)
   - [Qi Realms](#41-qi-realms)
   - [Body Realms](#42-body-realms)
   - [Monsters](#43-monsters)
   - [Items](#44-items)
   - [Meditation Techniques](#45-meditation-techniques)
   - [Battle Techniques](#46-battle-techniques)
   - [Initial State](#47-initial-state)
5. [Game Loop & Tick System](#5-game-loop--tick-system)
6. [UI Components](#6-ui-components)
7. [Technical Architecture](#7-technical-architecture)
8. [Glossary](#8-glossary)

---

## 1. Overview

Incresage is an incremental idle game set in a Xianxia (cultivation) fantasy world. The player embodies a cultivator who must:

- **Meditate** to advance their Qi cultivation realm
- **Hunt monsters** to advance their Body cultivation realm
- **Learn techniques** to accelerate progress
- **Equip gear** dropped from monsters to boost combat stats
- **Manage lifespan** — when it runs out, the player reincarnates, retaining some progress via the Legacy system

The game uses a **0.5-second game tick** for meditation and a **2-second combat tick** for auto-battling monsters. State is persisted in `localStorage`.

---

## 2. State Architecture

The entire game state is a single `PlayerState` object structured into six slices:

### `PlayerState` (interface)
```
PlayerState
├── qi:          QiState        — Qi cultivation progress
├── body:        BodyState      — Body cultivation progress
├── combat:      CombatStats    — Combat state
├── life:        LifeState      — Lifespan tracking
├── legacy:      LegacyState    — Cross-life persistence
└── systems:     SystemsState   — Inventory, currency, features
```

### `QiState`
| Field | Type | Description |
|---|---|---|
| `fill` | `number` | Current fill ratio (0.0–1.0) toward stage completion |
| `realmIndex` | `number` | 0–5 (Mortal → Spirit Severing) |
| `stage` | `number` | 0 = Early, 1 = Middle, 2 = Late |
| `insight` | `number` | Cumulative insight stat (capped per realm) |
| `techniques` | `Technique[]` | Array of unlocked meditation techniques |
| `activeTechniqueId` | `string \| null` | Currently active technique |

### `BodyState`
| Field | Type | Description |
|---|---|---|
| `fill` | `number` | Current fill ratio (0.0–1.0) toward stage completion |
| `realmIndex` | `number` | 0–5 (Mortal Body → Golden Body) |
| `stage` | `number` | 0 = Early, 1 = Middle, 2 = Late |
| `trials` | `number` | Accumulated trials earned from first-time monster defeats |
| `trialsMax` | `number` | Cap on trials (starts at 8) |
| `sparks` | `number` | Body sparks (generated on Qi breakthroughs) |
| `battleTechniques` | `BattleTechnique[]` | Array of battle techniques (start at tier 0) |

### `CombatStats`
| Field | Type | Description |
|---|---|---|
| `vitalityFill` | `number` | Current vitality ratio (0.0–1.0) |
| `spiritFill` | `number` | Current spirit ratio (0.0–1.0) |
| `attackPower` | `number` | Base attack power |
| `defensePower` | `number` | Base defense power |
| `defeatedMonsters` | `string[]` | IDs of monsters defeated at least once |
| `equippedItems` | `string[]` | Instance IDs of equipped gear |
| `selectedMonsterId` | `string \| null` | Currently selected monster |
| `monsterHp` | `number` | Current HP of the engaged monster |
| `combatLog` | `CombatLogEntry[]` | Array of combat log entries (max 50) |

### `CombatLogEntry`
| Field | Type | Description |
|---|---|---|
| `id` | `string` | UUID |
| `timestamp` | `string` | HH:MM:SS format |
| `message` | `string` | Log message text |
| `count` | `number` | Consecutive duplicate count |
| `drops?` | `CombatLogDrop[]` | Items dropped on this kill |
| `salvagedDrops?` | `CombatLogDrop[]` | Items lost to full inventory, salvaged |

### `CombatLogDrop`
| Field | Type | Description |
|---|---|---|
| `name` | `string` | Item display name |
| `rarity` | `ItemRarity` | Rarity tier |

### `LifeState`
| Field | Type | Description |
|---|---|---|
| `lifespanFill` | `number` | Ratio of lifespan consumed (0.0–1.0) |
| `maxLifespan` | `number` | Max lifespan in years (from current realm stage) |
| `lastUpdate` | `number` | Timestamp of last tick (for offline calculation) |
| `lastActive` | `number` | Timestamp of last player activity |
| `lifetimeStats` | `LifetimeStats` | Aggregate stats for this life |

### `LifetimeStats`
| Field | Type | Description |
|---|---|---|
| `highestQiRealm` | `number` | Highest qi realm index achieved |
| `highestBodyRealm` | `number` | Highest body realm index achieved |
| `monstersDefeated` | `number` | Total monsters defeated in this life |
| `breakthroughsTaken` | `number` | Total breakthrough attempts in this life |
| `lifespanFill` | `number` | Total lifespan consumed |

### `LegacyState`
| Field | Type | Description |
|---|---|---|
| `echoes` | `number` | Echo currency (earned on reincarnation) |
| `imprints` | `Imprint[]` | Preserved technique levels across lives |
| `reincarnationCount` | `number` | Number of reincarnations |
| `pendingSummary` | `ReincarnationSummary \| null` | Summary shown after reincarnation |

### `Imprint`
| Field | Type | Description |
|---|---|---|
| `techniqueId` | `string` | Technique that was imprinted |
| `preservedLevel` | `number` | Level preserved into next life |

### `ReincarnationSummary` (extends `LifetimeStats`)
| Field | Type | Description |
|---|---|---|
| `lifeNumber` | `number` | Which life number this was |
| `echoesEarned` | `number` | Echoes awarded for this life |
| `imprintsEarned` | `Imprint[]` | Imprints earned this life |
| *(inherits all LifetimeStats fields)* | | |

### `SystemsState`
| Field | Type | Description |
|---|---|---|
| `unlockedFeatures` | `Feature[]` | Array of unlocked feature flags |
| `inventory` | `InventoryItem[]` | Array of inventory items |
| `spiritStones` | `number` | Spirit stone currency |

### `Feature`
```typescript
type Feature = 'combat' | 'alchemy' | 'bodyCultivation';
```

---

## 3. Core Systems

### 3.1 Qi Cultivation

Qi cultivation is the primary progression path. It advances automatically through meditation (idle game tick).

**Flow:**
1. Every tick (1 second), `computeQiFillRate()` calculates fill gain
2. Fill accumulates in `qi.fill` (0.0–1.0)
3. At ≥75% fill, the player may attempt a **Qi Breakthrough**
4. Success advances `qi.stage` or `qi.realmIndex`
5. On success, the player gains 1 **Body Spark**

**Qi Breakthrough Formula:**
```
chance = baseBreakRate * min(1, qi.fill / 0.95)
```
- `baseBreakRate` comes from the current stage definition
- Failure reduces fill by 50%
- Success resets fill to 0 and advances position

**Qi Fill Rate Formula:**
```
fillRate = stage.fillRate * (1 + insight * 0.001) * techniqueMultiplier
```
Where `techniqueMultiplier` = `1 + activeTechnique.level * 0.02` if the active technique has `qi_focus` trait, otherwise 1.

**Insight:**
- Gained automatically if the active technique has `insight_deep` trait
- Gain rate: `0.05 * technique.level` per tick
- Cap: `10 * (qi.realmIndex + 1)`
- Insight boosts Qi fill rate (0.1% per point)

**Late Stage Gates:**
- Late stage breakthroughs require a minimum sum of all technique levels
- Defined in `LATE_BREAKTHROUGH_LEVEL_GATES`

| Realm | Required Technique Level Sum |
|---|---|
| Mortal | 3 |
| Qi Condensation | 6 |
| Foundation Establishment | 10 |
| Core Formation | 20 |
| Nascent Soul | 35 |
| Spirit Severing | 80 |

**Realm Unlocks:**
- Reaching Core Formation (realmIndex 3) unlocks the **Soul Searching** technique
- Reaching Nascent Soul (realmIndex 4) unlocks the **Life Pondering** technique

### 3.2 Body Cultivation

Body cultivation advances through combat rather than passive meditation.

**Flow:**
1. Defeating monsters fills `body.fill` based on the monster's `fillReward`
2. First-time monster defeats grant **Trials** (used as cost for breakthroughs)
3. Qi breakthroughs generate **Sparks** (also required for body breakthroughs)
4. At ≥75% fill and sufficient Sparks + Trials, player may attempt a **Body Breakthrough**

**Body Breakthrough Formula:**
```
chance = baseBreakRate * min(1, body.fill / 0.95)
```
- `baseBreakRate` comes from the current body stage definition
- Failure reduces fill by 60% and loses 1 Trial
- Success costs: `2 + floor(totalStageIndex / 3)` Trials + 1 Spark
- On success: body fill resets to 0, Qi fill gains +15%

**Body Trial Cost Formula:**
```
trialCost = 2 + floor((realmIndex * 3 + stage) / 3)
```

**Late Stage Gates (Body):**
Defined in `BODY_LATE_BREAKTHROUGH_LEVEL_GATES`

| Realm | Required Technique Level Sum |
|---|---|
| Mortal Body | 2 |
| Body Refining | 5 |
| Bone Forging | 8 |
| Meridian Opening | 15 |
| Flesh Sanctification | 25 |
| Golden Body | 60 |

**Key Design:**
- Body cultivation intentionally lags behind Qi (needs Sparks from Qi breakthroughs)
- Fill rate on body realms represents fill gained per combat victory, not per second

### 3.3 Meditation Techniques

Techniques provide passive bonuses when active. Only one technique can be active at a time.

**Technique Traits:**
| Trait | Effect |
|---|---|
| `qi_focus` | Qi fill rate +2% per technique level |
| `body_resilience` | Reduces body breakthrough failure penalty (future) |
| `insight_deep` | Insight gain of 0.05/tick per technique level |
| `combat_edge` | Improves attack and defense stats (passive) |
| `lifespan_extend` | Lifespan depletes more slowly (future) |
| `magicfind_rate` | Increases chance of better item drops (future) |

**Technique Leveling:**
- Max level: 50
- Active technique gains 1 XP per tick
- XP to next level: `level * 15`
- Level-up reduces XP by required amount, increments level
- Fully leveling all techniques to 50 requires ~5.3 hours of active use per technique

**Technique Experience Formula:**
```
techExpToNextLevel(level) = level * 15
```

**addTechniqueExp Algorithm:**
```
1. If at level cap (50), return unchanged
2. Add exp gained to technique.exp
3. While level < 50 AND exp >= expToNextLevel(level):
   a. Subtract expToNextLevel(level) from exp
   b. Increment level
4. Return updated technique
```

### 3.4 Battle Techniques

Battle techniques are permanent upgrades purchased with Spirit Stones. Unlike meditation techniques, all battle techniques are active simultaneously.

**Four Battle Techniques:**
| ID | Name | Trait | Bonus per Tier |
|---|---|---|---|
| `tiger_breath` | Tiger's Breath | `attack` | +0/3/6/10/15/20 Attack |
| `iron_skin_mantra` | Iron Skin Mantra | `defense` | +0/3/6/10/15/20 Defense |
| `boundless_heart` | Boundless Heart | `vitality` | +0/45/90/150/225/300 Vitality Cap |
| `spirit_refinement` | Spirit Refinement | `spirit` | +0/45/90/150/225/300 Spirit Cap |

**Tier Costs** (same for all four):
| Tier Upgrade | Cost |
|---|---|
| 0→1 | 10 spirit stones |
| 1→2 | 30 spirit stones |
| 2→3 | 70 spirit stones |
| 3→4 | 150 spirit stones |
| 4→5 | 300 spirit stones |

**Gating:**
- Each tier upgrade requires the player's body realm index to be ≥ (target tier - 1)
- Max tier: 5

### 3.5 Combat System

Combat is an auto-battle system. Once a monster is selected, the game automatically fights it.

**Combat Tick:** Every 2 seconds

**Combat Flow:**
1. Player deals `attackPower` damage to monster HP
2. Monster deals `max(1, monster.attack - defensePower)` damage to player vitality
3. Vitality damage ratio = `monsterDamage / vitalityCap`
4. After each tick without a monster, vitality recovers at +0.02/tick

**Monster Defeat:**
- Monster HP ≤ 0 → victory
- Rewards: body fill, spirit stones, potential item drops, trials (first defeat only)
- Monster HP resets to full after defeat (respawning)
- Drops are rolled per the monster's `drops` array with individual percentage chances

**Player Defeat:**
- Vitality Fill ≤ 0 → defeat
- Monster selection cleared, vitality resets to 0
- Player must recover vitality (0.02/tick) before engaging again

**Stats Calculation:**

```
attackPower = baseAttackPower + gearAttackBonus + battleTechniqueBonus(attack)
defensePower = baseDefensePower + gearDefenseBonus + battleTechniqueBonus(defense)

vitalityCap = (qi.realmIndex + 1) * (body.realmIndex + 1) * 20 + vitalityTechniqueBonus * 15
spiritCap = 50 + qi.realmIndex * 25 + spiritTechniqueBonus * 15

currentVitality = round(vitalityFill * vitalityCap)
currentSpirit = round(spiritFill * spiritCap)
```

**Combat Log:**
- Stores up to 50 entries, newest first
- Consecutive duplicate messages increment a count instead of creating new entries
- Drop information shown per kill
- Items lost to full inventory are salvaged for spirit stones

### 3.6 Inventory & Equipment

**Inventory System:**
- Max size: 60 items (`MAX_INVENTORY_SIZE = 60`)
- Items can be stacked if `stackable` (currently no stackable items exist)
- Filter options: All, Gear, Weapons, Accessories, Equipped
- Sort options: Newest, Rarity, Name

**Item Types:**
| Type | Description |
|---|---|
| `material` | Crafting material (future) |
| `pill` | Consumable (future) |
| `gear` | Equipment with stat bonuses |

**Gear Slots:** `weapon`, `accessory`

**Rarity Tiers & Multipliers:**
| Rarity | Probability | Stat Multiplier |
|---|---|---|
| Common | 65% | 1.0× |
| Exquisite | 20% | 1.5× |
| Rare | 10% | 2.0× |
| Epic | 4% | 3.0× |
| Legendary | 1% | 5.0× |

**Equipping:**
- Equipping an item auto-unequips any other item in the same slot
- `equippedItems` in CombatStats tracks current equipped instance IDs
- Gear bonuses scale by rarity (see `scaleGearBonus`)

**Drop Salvaging:**
- If inventory is full, excess items are salvaged
- Salvage value: `monster.spiritStones * getSalvageMultiplier(rarity)`
- Salvage multipliers: Common=1.1×, Exquisite=1.5×, Rare=2×, Epic=3×, Legendary=5×

### 3.7 Life & Lifespan

Lifespan is the timer on each life. When lifespan runs out, the player dies and can reincarnate.

- `maxLifespan` is determined by the current Qi realm stage's `lifespanYears`
- `lifespanFill` tracks how much of the max lifespan has been consumed (0.0–1.0)
- When `lifespanFill >= 1.0`, the current life ends (feature TBD in UI — reincarnation currently stubbed)

**Lifespan values per Qi Realm Stage:**

| Realm | Early | Middle | Late |
|---|---|---|---|
| Mortal | 80 | 90 | 100 |
| Qi Condensation | 150 | 200 | 250 |
| Foundation Establishment | 300 | 400 | 500 |
| Core Formation | 750 | 1000 | 1200 |
| Nascent Soul | 2000 | 3500 | 5000 |
| Spirit Severing | 10000 | 12000 | 15000 |

### 3.8 Legacy & Reincarnation (Future / Stub)

**Echo Shop Perks:**
```typescript
interface EchoShopPerk {
  id: string;
  name: string;
  description: string;
  cost: number;       // Echoes cost
  maxPurchases: number;
}
```
- Echoes are earned on reincarnation
- Used to purchase permanent upgrades across lives
- Imprints preserve technique levels into the next life

---

## 4. Game Constants & Data

### 4.1 Qi Realms (`QI_REALMS`)

Six realms, each with three stages (Early, Middle, Late).

| Index | Realm ID | Realm Name | Stage | Fill Rate | Base Break Rate | Lifespan (yrs) |
|---|---|---|---|---|---|---|
| 0 | `mortal` | Mortal | Early | 0.050 | 90% | 80 |
| | | | Middle | 0.020 | 80% | 90 |
| | | | Late | 0.010 | 60% | 100 |
| 1 | `qi_condensation` | Qi Condensation | Early | 0.007 | 85% | 150 |
| | | | Middle | 0.006 | 75% | 200 |
| | | | Late | 0.005 | 55% | 250 |
| 2 | `foundation_establishment` | Foundation Establishment | Early | 0.006 | 80% | 300 |
| | | | Middle | 0.005 | 70% | 400 |
| | | | Late | 0.004 | 50% | 500 |
| 3 | `core_formation` | Core Formation | Early | 0.005 | 75% | 750 |
| | | | Middle | 0.004 | 65% | 1000 |
| | | | Late | 0.003 | 45% | 1200 |
| 4 | `nascent_soul` | Nascent Soul | Early | 0.0020 | 70% | 2000 |
| | | | Middle | 0.0015 | 60% | 3500 |
| | | | Late | 0.0010 | 40% | 5000 |
| 5 | `spirit_severing` | Spirit Severing | Early | 0.0008 | 65% | 10000 |
| | | | Middle | 0.0005 | 55% | 12000 |
| | | | Late | 0.0001 | 30% | 15000 |

### 4.2 Body Realms (`BODY_REALMS`)

Six body realms, each with three stages.

| Index | Realm ID | Realm Name | Stage | Fill Rate | Base Break Rate | Lifespan (yrs) |
|---|---|---|---|---|---|---|
| 0 | `body_mortal` | Mortal Body | Early | 0.12 | 88% | 80 |
| | | | Middle | 0.09 | 78% | 90 |
| | | | Late | 0.06 | 58% | 100 |
| 1 | `body_refining` | Body Refining | Early | 0.09 | 83% | 150 |
| | | | Middle | 0.07 | 73% | 200 |
| | | | Late | 0.05 | 53% | 250 |
| 2 | `bone_forging` | Bone Forging | Early | 0.07 | 78% | 300 |
| | | | Middle | 0.05 | 68% | 400 |
| | | | Late | 0.04 | 48% | 500 |
| 3 | `meridian_opening` | Meridian Opening | Early | 0.05 | 73% | 750 |
| | | | Middle | 0.04 | 63% | 1000 |
| | | | Late | 0.03 | 43% | 1200 |
| 4 | `flesh_sanctification` | Flesh Sanctification | Early | 0.030 | 68% | 2000 |
| | | | Middle | 0.020 | 58% | 3500 |
| | | | Late | 0.015 | 38% | 5000 |
| 5 | `golden_body` | Golden Body | Early | 0.012 | 63% | 10000 |
| | | | Middle | 0.008 | 53% | 12000 |
| | | | Late | 0.005 | 28% | 15000 |

### 4.3 Monsters (`MONSTERS`)

Ten monsters in ascending difficulty. Available based on Qi realm index.

| # | ID | Name | HP | ATK | Diff | Fill Reward | Trials | Stones | Unlock Realm | Drops |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `spirit_wisp` | Spirit Wisp | 30 | 3 | 1 | 0.02 | 1 | 5 | Qi Condensation (1) | Rusty Sword (20%), Woven Guard Charm (20%) |
| 2 | `forest_wolf` | Forest Wolf | 55 | 6 | 2 | 0.03 | 1 | 8 | Qi Condensation (1) | Wolf Fang Blade (15%) |
| 3 | `earth_golem` | Earth Golem | 90 | 10 | 3 | 0.04 | 2 | 12 | Foundation Est. (2) | Stoneheart Bead (10%), Woven Guard Charm (10%) |
| 4 | `fire_imp` | Fire Imp | 70 | 16 | 4 | 0.05 | 2 | 18 | Foundation Est. (2) | None |
| 5 | `shadow_stalker` | Shadow Stalker | 130 | 20 | 5 | 0.06 | 3 | 25 | Core Formation (3) | None |
| 6 | `rock_elemental` | Rock Elemental | 200 | 24 | 6 | 0.07 | 3 | 35 | Core Formation (3) | None |
| 7 | `wind_spirit` | Wind Spirit | 160 | 34 | 7 | 0.08 | 4 | 45 | Nascent Soul (4) | None |
| 8 | `ice_golem` | Ice Golem | 300 | 40 | 8 | 0.09 | 4 | 60 | Nascent Soul (4) | None |
| 9 | `thunder_beast` | Thunder Beast | 260 | 55 | 9 | 0.10 | 5 | 80 | Spirit Severing (5) | None |
| 10 | `ancient_guardian` | Ancient Guardian | 450 | 70 | 10 | 0.12 | 5 | 120 | Spirit Severing (5) | None |

### 4.4 Items (`ITEM_TEMPLATES`)

| ID | Type | Name | Rarity | Slot | Bonus |
|---|---|---|---|---|---|
| `rusty_sword` | gear | Rusty Sword | common | weapon | Attack +2 |
| `wolf_fang_blade` | gear | Wolf Fang Blade | exquisite | weapon | Attack +5 |
| `woven_guard_charm` | gear | Woven Guard Charm | common | accessory | Defense +2 |
| `stoneheart_bead` | gear | Stoneheart Bead | exquisite | accessory | Defense +5 |

### 4.5 Meditation Techniques (`TECHNIQUES`)

| ID | Name | Traits | Unlock |
|---|---|---|---|
| `stillwater_breathing` | Stillwater Breathing | `qi_focus`, `insight_deep` | Starting |
| `iron_will_tempering` | Iron Will Tempering | `body_resilience`, `insight_deep` | Starting |
| `predators_instinct` | Predator's Instinct | `combat_edge`, `lifespan_extend` | Starting |
| `soul_searching` | Soul Searching | `qi_focus`, `lifespan_extend`, `magicfind_rate` | Core Formation (realmIndex 3) |
| `life_pondering` | Life Pondering | `lifespan_extend`, `insight_deep` | Nascent Soul (realmIndex 4) |

### 4.6 Battle Techniques (`BATTLE_TECHNIQUES`)

| ID | Name | Trait | Tier Costs |
|---|---|---|---|
| `tiger_breath` | Tiger's Breath | attack | [10, 30, 70, 150, 300] |
| `iron_skin_mantra` | Iron Skin Mantra | defense | [10, 30, 70, 150, 300] |
| `boundless_heart` | Boundless Heart | vitality | [10, 30, 70, 150, 300] |
| `spirit_refinement` | Spirit Refinement | spirit | [10, 30, 70, 150, 300] |

### 4.7 Initial State

- **Qi:** Mortal, Early stage, fill=0, insight=0, techniques=[stillwater_breathing, iron_will_tempering, predators_instinct], active=stillwater_breathing
- **Body:** Mortal Body, Early stage, fill=0, trials=0, trialsMax=8, sparks=0, all battle techniques at tier 0
- **Combat:** vitalityFill=1, spiritFill=1, attackPower=10, defensePower=10, no monsters defeated, empty inventory/equipment
- **Life:** lifespanFill=0, maxLifespan=80 (Mortal Early), lifetimeStats all zero
- **Legacy:** echoes=0, no imprints, reincarnationCount=0, no pending summary
- **Systems:** unlockedFeatures=[], inventory=[], spiritStones=0

---

## 5. Game Loop & Tick System

The game runs two independent intervals:

### Game Tick (1000ms / 1 second)
Managed by `useGameTick` hook:
1. Computes Qi fill rate via `computeQiFillRate(state)`
2. Adds fill to `qi.fill` (capped at 1.0)
3. Adds 1 XP to the active technique via `addTechniqueExp()`
4. Computes insight gain via `computeInsightGainPerTick(state)` and adds to `qi.insight` (capped by `getInsightCap`)

### Combat Tick (2000ms / 2 seconds)
Managed by `useCombat` hook:
1. If no monster selected: recover vitality by +0.02/tick
2. If monster selected: resolve one round of combat
3. Handle monster defeat (rewards, drops, salvaging)
4. Handle player defeat (reset vitality, deselect monster)

### State Persistence
- `useGameState` hook handles load/save
- Uses lazy initializer (`useState(() => loadSavedState())`) to avoid parsing on every render
- Saves to localStorage on every state change via `useEffect`
- Save key: `'incresage-v2-player-state'`
- Falls back to `INITIAL_PLAYER_STATE` if no save exists or parsing fails

---

## 6. UI Components

### App Structure (`App.tsx`)
```
<App>
  <PlayerPanel />      — Attack, Defense, Vitality, Spirit, Spirit Stones, Echoes
  <InventoryPanel />   — Filterable/sortable gear list with equip/delete actions
  <EquipmentPanel />   — Weapon & Accessory slots display
  <QiPanel />          — Qi realm progress, breakthrough button, insight, sparks
  <BodyPanel />        — Body realm progress, breakthrough button, trials
  <TechniquePanel />   — Meditation technique cards with level/exp/traits
  <BattleTechPanel />  — Battle technique upgrade cards with costs
  <CombatTarget />     — Active combat display (stats, monster HP, vitality/spirit)
  <CombatLog />        — Scrollable combat event log
  <MonsterList />      — Available monster buttons
</App>
```

### Reusable Components
- **`FillBar`** — Generic progress bar showing 0–100%, used for Qi fill, Body fill, technique XP, vitality, monster HP, etc.

### Panel Registers (CSS classes)
- `.panel` — Generic panel container
- `.fill-bar` / `.fill-bar__inner` / `.fill-bar__label`
- `.technique-list` / `.technique-card` / `.technique-card--active` / `.technique-card__progress`
- `.monster-list` / `.monster-button` / `.monster-button--selected` / `.monster-rewards`
- `.combat-target` / `.combat-stats` / `.combat-log` / `.combat-log__time` / `.combat-log__count`
- `.inventory-controls` / `.inventory-list` / `.inventory-item` / `.inventory-item__icon` / `.inventory-item__content` / `.inventory-item__actions`
- `.equipment-grid` / `.equipment-slot` / `.equipment-slot__label`
- `.battle-tech-grid` / `.battle-tech-card` / `.battle-tech-card__header` / `.battle-tech-card__details` / `.tech-maxed`
- `.player-stat-grid`
- `.action-row`
- `.rarity-common` / `.rarity-exquisite` / `.rarity-rare` / `.rarity-epic` / `.rarity-legendary`
- `.rarity-text-common` / `.rarity-text-exquisite` / `.rarity-text-rare` / `.rarity-text-epic` / `.rarity-text-legendary`

---

## 7. Technical Architecture

### Tech Stack
- **Framework:** React 19 (StrictMode)
- **Language:** TypeScript
- **Build:** Vite
- **State Management:** React `useState` with `useReducer` pattern (functional state updates)
- **Persistence:** localStorage
- **No external state libraries** (custom hooks pass `setState` via props)

### Project Structure
```
incresage/src/
├── App.tsx                  — Root component, orchestrates all panels
├── main.tsx                 — Entry point (ReactDOM render)
├── index.css                — Global styles
├── components/
│   └── FillBar.tsx          — Reusable progress bar
├── constants/
│   ├── qiRealms.ts          — 6 Qi realm definitions
│   ├── bodyRealms.ts        — 6 Body realm definitions + late stage gates
│   ├── techniques.ts        — 5 meditation techniques + unlock requirements + level gates + XP formula
│   ├── battleTech.ts        — 4 battle technique definitions
│   ├── monsters.ts          — 10 monster definitions
│   ├── items.ts             — 4 item templates
│   └── initialState.ts      — Starting game state
├── types/
│   ├── state.ts             — PlayerState and sub-state interfaces
│   ├── realms.ts            — RealmDef, StageDef interfaces
│   ├── technique.ts         — Technique, BattleTechnique, TechniqueTrait types
│   ├── inventory.ts         — ItemTemplate, InventoryItem, GearBonus, etc.
│   └── legacy.ts            — LifetimeStats, Imprint, ReincarnationSummary, EchoShopPerk
├── utils/
│   ├── fillRate.ts          — computeQiFillRate
│   ├── realmUtils.ts        — Realm/stage getters and position calculators
│   ├── breakthroughCalc.ts  — Breakthrough can-attempt checks and chance calculations
│   ├── techniqueUtils.ts    — Technique active selection, trait checks, XP management
│   ├── combatUtils.ts       — Combat stats, vitality/spirit caps, attack/defense, log
│   ├── inventoryUtils.ts    — Item creation, drops, rarity, gear scaling, inventory management
│   ├── insightUtils.ts      — Insight cap and gain calculations
│   └── upgradeUtils.ts      — Battle technique tier costs, bonuses, effect text
├── hooks/
│   ├── useGameState.ts      — State initialization + localStorage persistence
│   ├── useGameLoop.ts       — Central hook combining all sub-hooks
│   ├── useGameTick.ts       — 1-second passive game tick (Qi fill, XP, insight)
│   ├── useBreakthrough.ts   — Qi and Body breakthrough logic
│   ├── useTechnique.ts      — Technique selection
│   ├── useCombat.ts         — 2-second combat tick, monster selection, defeat/victory
│   ├── useUpgrades.ts       — Battle technique upgrades
│   └── useInventory.ts      — Equip, unequip, delete items
└── features/
    ├── cultivation/
    │   ├── QiPanel.tsx       — Qi cultivation UI
    │   ├── BodyPanel.tsx     — Body cultivation UI
    │   └── TechniquePanel.tsx — Meditation technique cards
    ├── combat/
    │   ├── MonsterList.tsx   — Monster selection buttons
    │   ├── CombatTarget.tsx  — Active combat display
    │   └── CombatLog.tsx     — Combat event log
    ├── player/
    │   ├── PlayerPanel.tsx   — Player stats overview
    │   ├── InventoryPanel.tsx — Inventory with filter/sort
    │   └── EquipmentPanel.tsx — Equipment slot display
    └── upgrades/
        └── BattleTechPanel.tsx — Battle technique upgrade UI
```

### Key Architectural Decisions

1. **No external state management** — The game is simple enough that React's built-in state with functional updates suffices. State is passed via `setState` dispatch functions through hooks.

2. **Pure utility functions** — All game calculations live in utility functions that take `PlayerState` as input and return computed values. This makes them testable and deterministic.

3. **Functional state updates** — All state mutations use the `setState((previous) => {...})` pattern to avoid stale closures.

4. **`useGameLoop` as orchestrator** — A single hook creates all sub-hooks and returns their combined actions. `App.tsx` only calls `useGameLoop()` and distributes the returned values.

5. **RealmUtils as a bridge** — `realmUtils.ts` handles all positional logic for both Qi and Body realms, encoding the rules for advancing through stages and realms.

---

## 8. Glossary

| Term | Definition |
|---|---|
| **Qi** | Spiritual energy; primary cultivation path progressed through meditation |
| **Body** | Physical cultivation path progressed through combat |
| **Fill** | Progress ratio (0.0–1.0) toward completing the current stage |
| **Breakthrough** | An attempt to advance to the next stage/realm, with a success chance |
| **Stage** | Early / Middle / Late — three sub-steps within each realm |
| **Realm** | A major tier of cultivation power (6 Qi realms, 6 Body realms) |
| **Insight** | Mental stat that boosts Qi fill rate; gained via insight_deep technique trait |
| **Technique** | Meditation method providing passive bonuses; 5 total, 1 active at a time |
| **Battle Technique** | Permanent upgrade purchased with spirit stones; all 4 active simultaneously |
| **Trials** | Resource earned from first-time monster defeats; consumed for Body breakthroughs |
| **Sparks** | Resource generated on successful Qi breakthroughs; consumed for Body breakthroughs |
| **Vitality** | Player's health resource in combat; depletes when fighting |
| **Spirit** | Secondary resource (currently displayed but not used in combat calculations) |
| **Spirit Stones** | Currency earned from defeating monsters; used to upgrade battle techniques |
| **Echoes** | Premium currency earned on reincarnation; used in Echo Shop (future) |
| **Imprint** | Technique level preserved across reincarnations |
| **Reincarnation** | Starting a new life after death, retaining echoes and imprints |
| **Tick** | A single update cycle (1000ms for passive, 2000ms for combat) |
| **Fill Rate** | Amount of fill added per tick (Qi) or per combat victory (Body) |
| **Break Rate** | Base success chance percentage for breakthrough attempts |
| **Salvaging** | Converting items lost to a full inventory into spirit stones |

---

*Generated from source code analysis — v1.0*