import { getItemTemplate } from '../../constants/items';
import type { PlayerState } from '../../types/state';
import { scaleGearBonus } from '../../utils/inventoryUtils';

interface InventoryPanelProps {
  state: PlayerState;
  onEquipItem: (instanceId: string) => void; // Required prop for equipping items
  onUnequipItem: (instanceId: string) => void; // Required prop for unequipping items
}

export function InventoryPanel({ 
    state, 
    onEquipItem, 
    onUnequipItem }: InventoryPanelProps) {
  return (
    <section className="panel">
      <h2>Inventory</h2>

      {state.systems.inventory.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <div className="inventory-list">
          {state.systems.inventory.map((item) => {
            const template = getItemTemplate(item.templateId);
            const scaledBonus = scaleGearBonus(template?.statBonus, item.rarity);
            const rarityClass = `rarity-${item.rarity}`;
            return (
              <div key={item.instanceId} className={`inventory-item ${rarityClass}`}>
                <div className="inventory-item__icon">
                    {template?.slot === 'weapon' ? 'WPN' : template?.slot === 'accessory' ? 'ACC' : 'ITM'}
                </div>
               <div className="inventory-item__content">
                    <strong>
                        {template?.name ?? item.templateId}
                        {item.isEquipped ? ' (Equipped)' : ''}
                    </strong>

                    <span>{item.rarity}</span>

                    <small>{template?.description ?? 'Missing item template.'}</small>

                    {template?.type === 'gear' && (
                        <small>
                        {[
                            scaledBonus.attackPower ? `Attack +${scaledBonus.attackPower}` : null,
                            scaledBonus.defensePower ? `Defense +${scaledBonus.defensePower}` : null,
                        ]
                            .filter(Boolean)
                            .join(', ')}
                        </small>
                    )}

                    {template?.type === 'gear' && (
                        <button
                        type="button"
                        onClick={() =>
                            item.isEquipped
                            ? onUnequipItem(item.instanceId)
                            : onEquipItem(item.instanceId)
                        }
                        >
                        {item.isEquipped ? 'Unequip' : 'Equip'}
                        </button>
                    )}
                    </div>
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
}