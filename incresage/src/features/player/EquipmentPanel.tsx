import { getItemTemplate } from '../../constants/items';
import type { GearSlot, InventoryItem } from '../../types/inventory';
import type { PlayerState } from '../../types/state';
import {
  getEquippedItemBySlot,
  scaleGearBonus,
} from '../../utils/inventoryUtils';

interface EquipmentPanelProps {
  state: PlayerState;
  onUnequipItem: (instanceId: string) => void;
}

export function EquipmentPanel({ state, onUnequipItem }: EquipmentPanelProps) {
  const weapon = getEquippedItemBySlot(state.systems.inventory, 'weapon');
  const accessory = getEquippedItemBySlot(state.systems.inventory, 'accessory');

  return (
    <section className="panel">
      <h2>Equipment</h2>

      <div className="equipment-grid">
        <EquipmentSlot
          label="Weapon"
          slot="weapon"
          item={weapon}
          onUnequipItem={onUnequipItem}
        />

        <EquipmentSlot
          label="Accessory"
          slot="accessory"
          item={accessory}
          onUnequipItem={onUnequipItem}
        />
      </div>
    </section>
  );
}

interface EquipmentSlotProps {
  label: string;
  slot: GearSlot;
  item: InventoryItem | null;
  onUnequipItem: (instanceId: string) => void;
}

function EquipmentSlot({
  label,
  slot,
  item,
  onUnequipItem,
}: EquipmentSlotProps) {
  const template = item ? getItemTemplate(item.templateId) : null;
  const scaledBonus = item ? scaleGearBonus(template?.statBonus, item.rarity) : null;

  return (
    <div className={`equipment-slot ${item ? `rarity-${item.rarity}` : ''}`}>
      <span className="equipment-slot__label">{label}</span>

      {item && template ? (
        <>
          <strong>{template.name}</strong>
          <span>{item.rarity}</span>
          <small>
            {[
              scaledBonus?.attackPower ? `Attack +${scaledBonus.attackPower}` : null,
              scaledBonus?.defensePower ? `Defense +${scaledBonus.defensePower}` : null,
            ]
              .filter(Boolean)
              .join(', ')}
          </small>

          <button
            type="button"
            onClick={() => onUnequipItem(item.instanceId)}
          >
            Unequip
          </button>
        </>
      ) : (
        <p>Empty {slot}</p>
      )}
    </div>
  );
}