import { getItemTemplate } from '../../constants/items';
import type { PlayerState } from '../../types/state';
import { scaleGearBonus } from '../../utils/inventoryUtils';
import { useMemo, useState } from 'react';

type InventoryFilter = 'all' | 'gear' | 'weapon' | 'accessory' | 'equipped';
type InventorySort = 'newest' | 'rarity' | 'name';

interface InventoryPanelProps {
  state: PlayerState;
  onEquipItem: (instanceId: string) => void; // Required prop for equipping items
  onUnequipItem: (instanceId: string) => void; // Required prop for unequipping items
  onDeleteItem: (instanceId: string) => void; // Required prop for deleting items
}

export function InventoryPanel({ 
    state, 
    onEquipItem, 
    onUnequipItem,
    onDeleteItem,
   }: InventoryPanelProps) {

    const [filter, setFilter] = useState<InventoryFilter>('all');
    const [sort, setSort] = useState<InventorySort>('newest');

    const visibleInventory = useMemo(() => {
        const rarityRank = {
          common: 1,
          exquisite: 2,
          rare: 3,
          epic: 4,
          legendary: 5,
        };

        return state.systems.inventory
          .filter((item) => {
            const template = getItemTemplate(item.templateId);

            if (filter === 'all') return true;
            if (filter === 'equipped') return item.isEquipped;
            if (filter === 'gear') return template?.type === 'gear';
            if (filter === 'weapon') return template?.slot === 'weapon';
            if (filter === 'accessory') return template?.slot === 'accessory';

            return true;
          })
          .toSorted((a, b) => {
            const templateA = getItemTemplate(a.templateId);
            const templateB = getItemTemplate(b.templateId);

            if (sort === 'rarity') {
              return rarityRank[b.rarity] - rarityRank[a.rarity];
            }

            if (sort === 'name') {
              return (templateA?.name ?? a.templateId).localeCompare(
                templateB?.name ?? b.templateId,
              );
            }

            return 0;
          });
      }, [filter, sort, state.systems.inventory]);

  return (
    <section className="panel">
      <div className="inventory-controls">
        <label>
          Filter
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as InventoryFilter)}
          >
            <option value="all">All</option>
            <option value="gear">Gear</option>
            <option value="weapon">Weapons</option>
            <option value="accessory">Accessories</option>
            <option value="equipped">Equipped</option>
          </select>
        </label>

        <label>
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as InventorySort)}
          >
            <option value="newest">Newest</option>
            <option value="rarity">Rarity</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      <h2>Inventory</h2>

      {state.systems.inventory.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <div className="inventory-list">
          {visibleInventory.map((item) => {
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
                    
                    <div className="inventory-item__actions">
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

                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.instanceId)}
                      >
                        Delete
                      </button>
                    </div>
                    </div>
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
}