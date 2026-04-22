/**
 * src/components/dashboard/InventoryList.jsx
 *
 * Inventory status panel with progress bars.
 * Data shape mirrors GET /api/farmer/:id/inventory response.
 *
 * @typedef {{ id: number, emoji: string, name: string, current: number, max: number }} InventoryItem
 */

/** Static seed — replace with API hook */
// Fetches live inventory from GET /farmers/inventory
import { useEffect, useState } from 'react';
import { getInventory } from '../../services/farmers.service.js';

const LOW_THRESHOLD = 0.15;

// Seed fallback for when API isn't up yet
const SEED = [
  { id:1, emoji:'🍅', name:'Tomatoes', quantityKg: 75,  maxKg: 100 },
  { id:2, emoji:'🧅', name:'Onions',   quantityKg: 40,  maxKg: 100 },
  { id:3, emoji:'🥬', name:'Spinach',  quantityKg: 6,   maxKg: 50  },
  { id:4, emoji:'🌾', name:'Ragi',     quantityKg: 120, maxKg: 200 },
  { id:5, emoji:'🥕', name:'Carrots',  quantityKg: 4,   maxKg: 50  },
];

const CAT_EMOJI = { VEG:'🥬', FRUIT:'🍅', GRAIN:'🌾', HERB:'🌿', DAIRY:'🥛' };

export default function InventoryList({ farmerId }) {
  const [items,     setItems]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!farmerId) { setIsLoading(false); return; }
    getInventory()
      .then(res => setItems(res.data))
      .catch(()  => setItems(null))
      .finally(() => setIsLoading(false));
  }, [farmerId]);

  const displayItems = items ?? SEED;
  // For API items that don't have a maxKg, derive one
  const normalised = displayItems.map(item => ({
    ...item,
    emoji: item.emoji ?? CAT_EMOJI[item.category?.toUpperCase()] ?? '🌾',
    maxKg: item.maxKg ?? Math.max(item.quantityKg * 1.5, 10),
  }));

  return (
    <div className="dash-panel">
      <div className="panel-header">
        <span className="panel-title">Inventory Status</span>
        <span className="panel-action">Manage →</span>
      </div>
      <div className="inventory-list">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="inv-row">
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#f0ebe5' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 13, background: '#f0ebe5', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 5,  background: '#f5f0eb', borderRadius: 3 }} />
              </div>
            </div>
          ))
        ) : normalised.map(item => {
          const pct   = Math.min(100, Math.round((item.quantityKg / item.maxKg) * 100));
          const isLow = pct / 100 < LOW_THRESHOLD;
          return (
            <div key={item.id} className="inv-row">
              <div className="inv-emoji">{item.emoji}</div>
              <div className="inv-info">
                <div className="inv-name">{item.name}</div>
                <div className="inv-bar-wrap">
                  <div className={`inv-bar${isLow ? ' low' : ''}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="inv-qty">{item.quantityKg} kg{isLow ? ' ⚠️' : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}