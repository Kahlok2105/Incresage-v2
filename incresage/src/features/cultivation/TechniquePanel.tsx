import type { Technique } from '../../types/technique';
import type { PlayerState } from '../../types/state';
import { techExpToNextLevel } from '../../constants/techniques';
import { getTechniqueEffectText } from '../../utils/techniqueUtils';
import { FillBar } from '../../components/FillBar';

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
  const expRatio = technique.exp / expNeeded;

  return (
    <button
      type="button"
      className={`technique-card ${isActive ? 'technique-card--active' : ''}`}
      onClick={onSelect}
    >
      <strong>{technique.name}</strong>
      <span>Level {technique.level}</span>
      <div className = "technique-card__progress">
         <FillBar value={expRatio} />
         </div>
      <small>{getTechniqueEffectText(technique).join(', ')}</small>
    </button>
  );
}