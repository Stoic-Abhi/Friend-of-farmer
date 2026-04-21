/**
 * src/pages/ConsumerDashboard/ConsumerDashboardPage.jsx
 *
 * Consumer's personal dashboard: order history + saved farmers.
 *
 * Future wiring:
 *   - Replace SEED_ORDERS with GET /api/consumer/:id/orders
 *   - Replace SEED_FARMERS with GET /api/consumer/:id/saved-farmers
 *   - Each history card gets a real-time status from WebSocket / polling
 *   - Wrap in <RequireAuth role="consumer"> guard
 */

import TrackStep from '../../components/dashboard/TrackStep';

/* ── Seed data ──────────────────────────────────────────────── */

/** @typedef {'done'|'active'|'pending'} StepState */

/**
 * @typedef {{ label: string, state: StepState, icon?: string }} Step
 * @typedef {{ id: string, emoji: string[], farmer: string, loc: string, total: string, date: string, statusLabel: string, statusCls: string, steps: Step[] }} Order
 */

const STEPS_DELIVERED = [
  { label: 'Ordered',    state: 'done' },
  { label: 'Packed',     state: 'done' },
  { label: 'Dispatched', state: 'done' },
  { label: 'Delivered',  state: 'done' },
];

/** @type {Order[]} */
const SEED_ORDERS = [
  {
    id: '#FD-20481', emoji: ['🍅','🥦','🧅'],
    farmer: 'Raju Gowda', loc: 'Tumkur',
    total: '₹670', date: '22 Mar 2026',
    statusLabel: 'Delivered', statusCls: 's-delivered',
    steps: STEPS_DELIVERED,
  },
  {
    id: '#FD-20612', emoji: ['🌾','🥬'],
    farmer: 'Kavitha Devi', loc: 'Hassan',
    total: '₹920', date: '25 Mar 2026',
    statusLabel: 'Out for Delivery', statusCls: 's-packed',
    steps: [
      { label: 'Ordered',    state: 'done' },
      { label: 'Packed',     state: 'done' },
      { label: 'Dispatched', state: 'active', icon: '🚚' },
      { label: 'Delivered',  state: 'pending' },
    ],
  },
  {
    id: '#FD-20788', emoji: ['🥕','🫑','🍆'],
    farmer: 'Murali Raj', loc: 'Kolar',
    total: '₹480', date: '26 Mar 2026',
    statusLabel: 'Pending', statusCls: 's-pending',
    steps: [
      { label: 'Ordered',    state: 'done' },
      { label: 'Packed',     state: 'active', icon: '⏳' },
      { label: 'Dispatched', state: 'pending' },
      { label: 'Delivered',  state: 'pending' },
    ],
  },
];

/** @typedef {{ id: number, avatar: string, name: string, loc: string, rating: string, badge: string }} SavedFarmer */

/** @type {SavedFarmer[]} */
const SEED_FARMERS = [
  { id: 101, avatar: '👨‍🌾', name: 'Raju Gowda',   loc: 'Tumkur, Karnataka',        rating: '⭐⭐⭐⭐⭐ 4.9', badge: '🌿 Organic Certified' },
  { id: 102, avatar: '👩‍🌾', name: 'Kavitha Devi', loc: 'Hassan, Karnataka',         rating: '⭐⭐⭐⭐⭐ 4.8', badge: '🏷️ Certified Organic' },
  { id: 103, avatar: '👨‍🌾', name: 'Murali Raj',   loc: 'Kolar, Karnataka',          rating: '⭐⭐⭐⭐ 4.5',  badge: '🔬 Chemical-free' },
  { id: 104, avatar: '👩‍🌾', name: 'Lakshmi Bai',  loc: 'Mysuru, Karnataka',         rating: '⭐⭐⭐⭐⭐ 4.7', badge: '🌿 Organic Certified' },
];

/* ── Component ──────────────────────────────────────────────── */

export default function ConsumerDashboardPage() {
  return (
    <div className="consumer-dash">
      {/* Greeting */}
      <div className="dash-header">
        <div>
          <div className="dash-greeting">👋 Hello, Priya!</div>
          <div className="dash-sub">Bengaluru · Joined January 2024</div>
        </div>
      </div>

      {/* Order history */}
      <p className="section-tag" style={{ marginBottom: '0.75rem' }}>ORDER HISTORY</p>
      <div className="order-history">
        {SEED_ORDERS.map(order => (
          <div key={order.id} className="history-card">
            {/* Top row */}
            <div className="history-card-top">
              <span className="history-id">Order {order.id}</span>
              <span className={`status-badge ${order.statusCls}`}>{order.statusLabel}</span>
              <span className="history-date">{order.date}</span>
            </div>

            {/* Body */}
            <div className="history-body">
              <div className="history-items">{order.emoji.join(' ')}</div>
              <div className="history-farmer">
                From <strong>{order.farmer}</strong> · {order.loc}
              </div>
              <div className="history-total">{order.total}</div>
            </div>

            {/* Tracking */}
            <div className="tracking-bar">
              <div className="track-steps">
                {order.steps.map(step => (
                  <TrackStep
                    key={step.label}
                    label={step.label}
                    state={step.state}
                    icon={step.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Saved farmers */}
      <div style={{ marginTop: '2.5rem' }}>
        <p className="section-tag" style={{ marginBottom: '0.75rem' }}>SAVED FARMERS</p>
        <div className="saved-farmers">
          {SEED_FARMERS.map(f => (
            <div key={f.id} className="farmer-card">
              <div className="farmer-avatar">{f.avatar}</div>
              <div className="farmer-name">{f.name}</div>
              <div className="farmer-loc">📍 {f.loc}</div>
              <div className="farmer-rating">{f.rating}</div>
              <div className="farmer-badge">{f.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
