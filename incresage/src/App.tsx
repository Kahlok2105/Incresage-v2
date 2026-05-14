import {QiPanel} from "./features/cultivation/QiPanel";
import {BodyPanel} from "./features/cultivation/BodyPanel";
import { useGameLoop } from "./hooks/useGameLoop";

export default function App(){
  const {
    state, 
    attemptQiBreakthrough,
    attemptBodyBreakthrough, 
    trainBodyForTesting,
  } = useGameLoop();

  return (
  <div className="app">
    <h1>Incresage</h1>

    <div className="cultivation-grid">
      <QiPanel
        state={state}
        onAttemptBreakthrough={attemptQiBreakthrough}
      />

      <BodyPanel
        state={state}
        onAttemptBreakthrough={attemptBodyBreakthrough}
        onTrainForTesting = {trainBodyForTesting}
      />
    </div>
  </div>
)}