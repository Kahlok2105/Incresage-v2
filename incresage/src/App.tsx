import { QiPanel} from "./features/cultivation/QiPanel";
import { BodyPanel} from "./features/cultivation/BodyPanel";
import { useGameLoop } from "./hooks/useGameLoop";
import { TechniquePanel } from "./features/cultivation/TechniquePanel";
import { MonsterList } from "./features/combat/MonsterList";
import { CombatTarget } from "./features/combat/CombatTarget";
import { PlayerPanel } from "./features/player/PlayerPanel";
import { CombatLog } from "./features/combat/CombatLog";
import { BattleTechPanel } from "./features/upgrades/BattleTechPanel";
import { InventoryPanel } from "./features/player/InventoryPanel";

export default function App(){
  const {
    state, 
    attemptQiBreakthrough,
    attemptBodyBreakthrough, 
    selectTechnique,
    selectMonster,
    upgradeBattleTechnique,
    equipItem,
    unequipItem,
    deleteItem,
  } = useGameLoop();

  return (
  <div className="app">
    <h1>Incresage</h1>
    <PlayerPanel state={state} />
    <InventoryPanel 
      state={state} 
      onEquipItem={equipItem}
      onUnequipItem={unequipItem}
      onDeleteItem={deleteItem}
    />
    <div className="cultivation-grid">
      <QiPanel
        state={state}
        onAttemptBreakthrough={attemptQiBreakthrough}
      />

      <BodyPanel
        state={state}
        onAttemptBreakthrough={attemptBodyBreakthrough}
      />
      </div>

      <TechniquePanel
        state={state}
        onSelectTechnique={selectTechnique}
      />

      <BattleTechPanel
        state={state}
        onUpgradeBattleTechnique={upgradeBattleTechnique}
      />
      
      <CombatTarget state={state}/>
      <CombatLog state={state} />
      <MonsterList
        state={state}
        onSelectMonster={selectMonster}
      />

  </div>
 
)}