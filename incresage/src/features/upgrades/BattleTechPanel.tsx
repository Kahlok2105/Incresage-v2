import type { PlayerState } from '../../types/state';
import { getBattleTechniqueEffectTextAtTier, getBattleTechniqueEffectText, getNextTierCost } from '../../utils/upgradeUtils';

interface BattleTechPanelProps {
  state: PlayerState;
  onUpgradeBattleTechnique: (techniqueId: string) => void;
}

export function BattleTechPanel({
  state,
  onUpgradeBattleTechnique,
}: BattleTechPanelProps) {
  return (
    <section className="panel">
      <h2>Battle Techniques</h2>

      <div className="battle-tech-grid">
        {state.body.battleTechniques.map((technique) => {
          const nextTierCost = getNextTierCost(technique);
          const nextTier = technique.tier + 1;
          const requiredRealmIndex = nextTier - 1;
          const hasRealmAccess = state.body.realmIndex >= requiredRealmIndex;
          const canAfford = nextTierCost !== null && state.systems.spiritStones >= nextTierCost;
          const isMaxed = nextTierCost === null;
          const isLocked = !isMaxed && !hasRealmAccess;

          const nextEffectText = isMaxed
            ? null
            : getBattleTechniqueEffectTextAtTier(technique, nextTier);

          const buttonLabel = isMaxed
            ? 'Maxed'
            : isLocked
              ? `Requires Body Realm ${requiredRealmIndex + 1}`
              : !canAfford
                ? `Need ${nextTierCost} Stones`
                : `Upgrade to Tier ${nextTier}`;

          return (
            <div key={technique.id} className="battle-tech-card">
              <div className="battle-tech-card__header">
                <h3>{technique.name}</h3>
                <span>Tier {technique.tier} / 5</span>
              </div>

              <div className="battle-tech-card__details">
                <p>Current: {getBattleTechniqueEffectText(technique)}</p>

                {nextEffectText ? (
                  <p>Next: {nextEffectText}</p>
                ) : (
                  <p className="tech-maxed">Maximum tier reached</p>
                )}

                {!isMaxed && (
                  <p>Cost: {nextTierCost} spirit stones</p>
                )}
              </div>

              <button
                type="button"
                disabled={isMaxed || !canAfford || isLocked}
                onClick={() => onUpgradeBattleTechnique(technique.id)}
              >
                {buttonLabel}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}