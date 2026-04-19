/**
 * src/components/dashboard/InventoryList.jsx
 *
 * Inventory status panel with progress bars.
 * Data shape mirrors GET /api/farmer/:id/inventory response.
 *
 * @typedef {{ id: number, emoji: string, name: string, current: number, max: number }} InventoryItem
 */

/** Static seed — replace with API hook */
const SEED_INVENTORY = [
  { id: 1, emoji: '🍅', name: 'Tomatoes', current: 75,  max: 100 },
  { id: 2, emoji: '🧅', name: 'Onions',   current: 40,  max: 100 },
  { id: 3, emoji: '🥬', name: 'Spinach',  current: 6,   max: 50  },
  { id: 4, emoji: '🌾', name: 'Ragi',     current: 120, max: 200 },
  { id: 5, emoji: '🥕', name: 'Carrots',  current: 4,   max: 50  },
  { id: 6, emoji: '🫑', name: 'Capsicum', current: 44,  max: 50  },
];

/** Item is "low" when below 15 % of max */
const LOW_THRESHOLD = 0.15;

/**
 * @param {{ items?: InventoryItem[] }} props
 */
export default function InventoryList({ items = SEED_INVENTORY }) {
  return (
    <div className="dash-panel">
      <div className="panel-header">
        <span className="panel-title">Inventory Status</span>
        <span className="panel-action">Manage →</span>
      </div>
      <div className="inventory-list">
        {items.map(item => {
          const pct = Math.min(100, Math.round((item.current / item.max) * 100));
          const isLow = pct / 100 < LOW_THRESHOLD;
          return (
            <div key={item.id} className="inv-row">
              <div className="inv-emoji">{item.emoji}</div>
              <div className="inv-info">
                <div className="inv-name">{item.name}</div>
                <div className="inv-bar-wrap">
                  <div
                    className={`inv-bar${isLow ? ' low' : ''}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="inv-qty">
                {item.current} kg{isLow ? ' ⚠️' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
