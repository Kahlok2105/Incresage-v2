import type { Technique } from '../../types/technique';
import type { PlayerState } from '../../types/state';
import { techExpToNextLevel } from '../../constants/techniques';

interface TechniquePanelProps {
  state: PlayerState;
  onSelectTechnique: (techniqueId: string) => void;
}

export function TechniquePanel({ state, onSelectTechnique }: TechniquePanelProps) {
  return (
    <section className="panel">
      <h2>Meditation Techniques</h2>

      <div className="technique-list">
        {state.qi.techniques.map((technique) => (
          <TechniqueCard
            key={technique.id}
            technique={technique}
            isActive={technique.id === state.qi.activeTechniqueId}
            onSelect={() => onSelectTechnique(technique.id)}
          />
        ))}
      </div>
    </section>
  );
}

interface TechniqueCardProps {
  technique: Technique;
  isActive: boolean;
  onSelect: () => void;
}

function TechniqueCard({ technique, isActive, onSelect }: TechniqueCardProps) {
  const expNeeded = techExpToNextLevel(technique.level);
  const expPercent = Math.round((technique.exp / expNeeded) * 100);

  return (
    <button
      type="button"
      className={`technique-card ${isActive ? 'technique-card--active' : ''}`}
      onClick={onSelect}
    >
      <strong>{technique.name}</strong>
      <span>Level {technique.level}</span>
      <span>EXP {technique.exp} / {expNeeded}</span>
      <span>{expPercent}%</span>
      <small>{technique.traits.join(', ')}</small>
    </button>
  );
}