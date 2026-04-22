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

import { useEffect, useState } from 'react';
import { useAuth }     from '../../context/AuthContext.jsx';
import { useMyOrders } from '../../hooks/useOrders.js';
import { savedFarmers } from '../../services/farmers.service.js';
import TrackStep       from '../../components/dashboard/TrackStep.jsx';

const STATUS_STEP = { PENDING:1, PACKED:2, DISPATCHED:3, DELIVERED:4, CANCELLED:0 };

function getSteps(status) {
  const current = STATUS_STEP[status] ?? 1;
  return [
    { label:'Ordered',    state: current >= 1 ? 'done' : 'pending' },
    { label:'Packed',     state: current >= 2 ? 'done' : current === 1 ? 'active' : 'pending', icon:'⏳' },
    { label:'Dispatched', state: current >= 3 ? 'done' : current === 2 ? 'active' : 'pending', icon:'🚚' },
    { label:'Delivered',  state: current >= 4 ? 'done' : current === 3 ? 'active' : 'pending', icon:'📦' },
  ];
}

const STATUS_BADGE = {
  PENDING:   's-pending',
  PACKED:    's-packed',
  DISPATCHED:'s-packed',
  DELIVERED: 's-delivered',
  CANCELLED: 's-pending',
};

export default function ConsumerDashboardPage() {
  const { user }                          = useAuth();
  const { orders, isLoading: ordLoading } = useMyOrders();
  const [farmers,  setFarmers]            = useState([]);
  const [farmersLoading, setFL]           = useState(true);

  useEffect(() => {
    savedFarmers()
      .then(r => setFarmers(Array.isArray(r) ? r : []))
      .catch(()  => setFarmers([]))
      .finally(() => setFL(false));
  }, []);

  const identifier = user?.email ?? user?.phone ?? 'Consumer';

  return (
    <div className="consumer-dash">
      <div className="dash-header">
        <div>
          <div className="dash-greeting">👋 Hello, {identifier.split('@')[0]}!</div>
          <div className="dash-sub">Your FarmDirect account</div>
        </div>
      </div>

      {/* Order history */}
      <p className="section-tag" style={{ marginBottom:'0.75rem' }}>ORDER HISTORY</p>

      {ordLoading ? (
        <div className="order-history">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="history-card" style={{ height: 160, background: '#f5f0eb', borderRadius: 16 }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty"><span className="empty-icon">📦</span>No orders yet. Go browse some fresh produce!</div>
      ) : (
        <div className="order-history">
          {orders.map(order => {
            const emojis = order.items?.map(() => '🌾').slice(0, 4) ?? ['📦'];
            const farmer = order.items?.[0]?.product?.farmer;
            const farmerLabel = farmer?.email ?? farmer?.phone ?? 'Farmer';
            const steps = getSteps(order.status);
            return (
              <div key={order.id} className="history-card">
                <div className="history-card-top">
                  <span className="history-id">Order #{order.id.slice(0,8)}</span>
                  <span className={`status-badge ${STATUS_BADGE[order.status] ?? 's-pending'}`}>
                    {order.status}
                  </span>
                  <span className="history-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="history-body">
                  <div className="history-items">{emojis.join(' ')}</div>
                  <div className="history-farmer">
                    From <strong>{farmerLabel}</strong>
                  </div>
                  <div className="history-total">₹{order.totalRs}</div>
                </div>
                <div className="tracking-bar">
                  <div className="track-steps">
                    {steps.map(s => <TrackStep key={s.label} {...s} />)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Saved farmers */}
      <div style={{ marginTop:'2.5rem' }}>
        <p className="section-tag" style={{ marginBottom:'0.75rem' }}>SAVED FARMERS</p>
        {farmersLoading ? (
          <div className="saved-farmers">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="farmer-card" style={{ height: 160, background: '#f5f0eb' }} />
            ))}
          </div>
        ) : farmers.length === 0 ? (
          <div className="empty" style={{ padding:'1.5rem 0' }}>
            <span className="empty-icon" style={{ fontSize:'2rem' }}>👨‍🌾</span>
            No saved farmers yet. Browse produce and save your favourites!
          </div>
        ) : (
          <div className="saved-farmers">
            {farmers.map(f => (
              <div key={f.id} className="farmer-card">
                <div className="farmer-avatar">👨‍🌾</div>
                <div className="farmer-name">{f.email ?? f.phone}</div>
                <div className="farmer-loc">📍 {f.districts?.[0] ?? 'Karnataka'}</div>
                {f.avgRating && (
                  <div className="farmer-rating">
                    {'⭐'.repeat(Math.round(f.avgRating))} {f.avgRating}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}