import type { PlayerState } from '../../types/state';
import { ECHO_SHOP_PERKS } from '../../constants/echoShopPerks';
import type { EchoShopPerk } from '../../types/legacy';

interface EchoShopPanelProps {
  state: PlayerState;
  onPurchasePerk: (perkId: string) => void;
}

export function EchoShopPanel({
  state,
  onPurchasePerk,
}: EchoShopPanelProps) {
  // Count current purchases for each perk from imprints
  function getPurchasedCount(perkId: string): number {
    return state.legacy.imprints.filter(
      (i) => i.techniqueId === `perk_${perkId}`,
    ).length;
  }

  if (ECHO_SHOP_PERKS.length === 0) {
    return (
      <section className="panel">
        <h2>Echo Shop</h2>
        <p>No perks available yet.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Echo Shop</h2>
      <p>
        Echoes: <strong>{state.legacy.echoes}</strong>
      </p>

      <div className="echo-shop-grid">
        {ECHO_SHOP_PERKS.map((perk) => {
          const purchased = getPurchasedCount(perk.id);
          const isMaxed = purchased >= perk.maxPurchases;
          const canAfford = state.legacy.echoes >= perk.cost;

          return (
            <EchoShopCard
              key={perk.id}
              perk={perk}
              purchased={purchased}
              isMaxed={isMaxed}
              canAfford={canAfford}
              onPurchase={() => onPurchasePerk(perk.id)}
            />
          );
        })}
      </div>
    </section>
  );
}

interface EchoShopCardProps {
  perk: EchoShopPerk;
  purchased: number;
  isMaxed: boolean;
  canAfford: boolean;
  onPurchase: () => void;
}

function EchoShopCard({
  perk,
  purchased,
  isMaxed,
  canAfford,
  onPurchase,
}: EchoShopCardProps) {
  const buttonLabel = isMaxed
    ? 'Maxed'
    : !canAfford
      ? `Need ${perk.cost} Echoes`
      : `Purchase (${perk.cost} Echoes)`;

  return (
    <div className="echo-shop-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        <h3>{perk.name}</h3>
        <span style={{ color: '#b6cf6d', fontSize: '0.9rem' }}>
          {purchased} / {perk.maxPurchases}
        </span>
      </div>

      <p>{perk.description}</p>

      <button
        type="button"
        disabled={isMaxed || !canAfford}
        onClick={onPurchase}
      >
        {buttonLabel}
      </button>
    </div>
  );
}