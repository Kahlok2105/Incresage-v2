import type { PlayerState } from '../../types/state';

interface ReincarnationModalProps {
  state: PlayerState;
  onReincarnate: () => void;
}

export function ReincarnationModal({
  state,
  onReincarnate,
}: ReincarnationModalProps) {
  const summary = state.legacy.pendingSummary;

  if (!summary) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Your Journey Ends... For Now</h2>

        <p>
          Life #{summary.lifeNumber} has reached its end. The cycle of
          reincarnation awaits. Reflect on what you have achieved, and carry
          your wisdom into the next life.
        </p>

        <div className="modal__stats">
          <span>
            <span className="stat-label">Highest Qi Realm</span>
            <span className="stat-value">Stage {summary.highestQiRealm}</span>
          </span>
          <span>
            <span className="stat-label">Highest Body Realm</span>
            <span className="stat-value">Stage {summary.highestBodyRealm}</span>
          </span>
          <span>
            <span className="stat-label">Monsters Defeated</span>
            <span className="stat-value">{summary.monstersDefeated}</span>
          </span>
          <span>
            <span className="stat-label">Breakthroughs Taken</span>
            <span className="stat-value">{summary.breakthroughsTaken}</span>
          </span>
          <span>
            <span className="stat-label">Echoes Earned</span>
            <span className="stat-value">+{summary.echoesEarned}</span>
          </span>
          <span>
            <span className="stat-label">Total Echoes</span>
            <span className="stat-value">
              {state.legacy.echoes + summary.echoesEarned}
            </span>
          </span>
          {summary.imprintsEarned.length > 0 && (
            <span>
              <span className="stat-label">Imprints Preserved</span>
              <span className="stat-value">
                {summary.imprintsEarned.length} technique
                {summary.imprintsEarned.length > 1 ? 's' : ''}
              </span>
            </span>
          )}
        </div>

        {summary.imprintsEarned.length > 0 && (
          <div className="modal__stats">
            <span className="stat-label" style={{ color: '#c9c7b5' }}>
              Preserved Techniques:
            </span>
            {summary.imprintsEarned.map((imprint) => (
              <span key={imprint.techniqueId}>
                <span className="stat-label">{imprint.techniqueId}</span>
                <span className="stat-value">Level {imprint.preservedLevel}</span>
              </span>
            ))}
          </div>
        )}

        <button type="button" onClick={onReincarnate}>
          Reincarnate
        </button>
      </div>
    </div>
  );
}