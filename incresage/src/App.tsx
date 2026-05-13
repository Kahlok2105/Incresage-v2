import {QiPanel} from "./features/cultivation/QiPanel";
import { useGameLoop } from "./hooks/useGameLoop";

export default function App(){
  const {state, attemptQiBreakthrough} = useGameLoop();

  return (
    <div className = "app">
      <h1>Incresage</h1>
      <QiPanel 
       state={state}
       onAttemptBreakthrough={attemptQiBreakthrough} />
    </div>
  )
}