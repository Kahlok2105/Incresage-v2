import type { PlayerState } from '../../types/state';
import { getBattleTechniqueEffectText, getNextTierCost } from '../../utils/upgradeUtils';

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

          return (
            <div key={technique.id} className="battle-tech-card">
              <h3>{technique.name}</h3>
              <p>{getBattleTechniqueEffectText(technique)}</p>
              <p>Tier: {technique.tier} / 5</p>

              {isMaxed ? (
                <p className="tech-maxed">MAXED</p>
              ) : (
                <p>
                  Next tier cost: {nextTierCost} spirit stones
                  {isLocked ? ` (requires Body Realm ${requiredRealmIndex + 1})` : ''}
                </p>
              )}

              <button
                type="button"
                disabled={isMaxed || !canAfford || isLocked}
                onClick={() => onUpgradeBattleTechnique(technique.id)}
              >
                {isMaxed ? 'MAX' : isLocked ? 'Locked' : `Upgrade to Tier ${nextTier}`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}