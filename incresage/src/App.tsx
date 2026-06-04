import { useEffect, useRef } from "react";
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
import { EquipmentPanel } from "./features/player/EquipmentPanel";
import { LifePanel } from "./features/player/LifePanel";
import { NotificationPanel } from "./features/ui/NotificationPanel";
import { ReincarnationModal } from "./features/legacy/ReincarnationModal";
import { EchoShopPanel } from "./features/legacy/EchoShopPanel";
import { isFeatureUnlocked } from "./utils/unlockUtils";
import { DebugPanel } from "./features/debug/DebugPanel";

export default function App(){
  const {
    state, 
    setState,
    notifications,
    dismissNotification,
    attemptQiBreakthrough,
    attemptBodyBreakthrough, 
    selectTechnique,
    selectMonster,
    upgradeBattleTechnique,
    equipItem,
    unequipItem,
    deleteItem,
    processOfflineProgress,
    attemptReincarnation,
    purchasePerk,
  } = useGameLoop();

  // Process offline progress on mount
  const hasProcessedOffline = useRef(false);
  useEffect(() => {
    if (!hasProcessedOffline.current) {
      hasProcessedOffline.current = true;
      processOfflineProgress();
    }
  }, [processOfflineProgress]);

  // Show reincarnation modal when pendingSummary exists
  const showReincarnation = state.legacy.pendingSummary !== null;

  return (
  <div className="app">
    <NotificationPanel
      notifications={notifications}
      onDismiss={dismissNotification}
    />

    {showReincarnation && (
      <ReincarnationModal
        state={state}
        onReincarnate={attemptReincarnation}
      />
    )}

    <h1>Incresage</h1>
    <PlayerPanel state={state} />
    <DebugPanel setState={setState} />
    <LifePanel state={state} />
    
    <EchoShopPanel
      state={state}
      onPurchasePerk={purchasePerk}
    />
    
    <InventoryPanel 
      state={state} 
      onEquipItem={equipItem}
      onUnequipItem={unequipItem}
      onDeleteItem={deleteItem}
    />
    <EquipmentPanel 
      state={state} 
      onUnequipItem={unequipItem}
    />
    <div className="cultivation-grid">
      <QiPanel
        state={state}
        onAttemptBreakthrough={attemptQiBreakthrough}
      />

      {isFeatureUnlocked(state, 'bodyCultivation') && (
        <BodyPanel
          state={state}
          onAttemptBreakthrough={attemptBodyBreakthrough}
        />
      )}
      </div>

      <TechniquePanel
        state={state}
        onSelectTechnique={selectTechnique}
      />

      <BattleTechPanel
        state={state}
        onUpgradeBattleTechnique={upgradeBattleTechnique}
      />
      
      {isFeatureUnlocked(state, 'combat') && (
        <>
          <CombatTarget state={state}/>
          <MonsterList
            state={state}
            onSelectMonster={selectMonster}
          />
        </>
      )}
      
      <CombatLog state={state} />

      

  </div>
 
)}
