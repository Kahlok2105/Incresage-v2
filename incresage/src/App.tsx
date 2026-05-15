import { QiPanel} from "./features/cultivation/QiPanel";
import { BodyPanel} from "./features/cultivation/BodyPanel";
import { useGameLoop } from "./hooks/useGameLoop";
import { TechniquePanel } from "./features/cultivation/TechniquePanel";
import { MonsterList } from "./features/combat/MonsterList";
import { CombatTarget } from "./features/combat/CombatTarget";
import { PlayerPanel } from "./features/player/PlayerPanel";
import { CombatLog } from "./features/combat/CombatLog";

export default function App(){
  const {
    state, 
    attemptQiBreakthrough,
    attemptBodyBreakthrough, 
    selectTechnique,
    selectMonster,
  } = useGameLoop();

  return (
  <div className="app">
    <h1>Incresage</h1>
    <PlayerPanel state={state} />
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
      <CombatTarget state={state}/>
      <CombatLog state={state} />
      <MonsterList
        state={state}
        onSelectMonster={selectMonster}
      />

  </div>
 
)}