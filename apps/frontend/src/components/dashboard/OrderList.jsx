/**
 * src/components/dashboard/OrderList.jsx
 *
 * Panel wrapper that renders a list of OrderCard rows.
 * Data will come from GET /api/farmer/:id/orders when backend is live.
 *
 * @param {{ orders: Array, title?: string }} props
 */

import OrderCard from './OrderCard.jsx';

export default function OrderList({ orders = [], isLoading, title = 'Recent Orders' }) {
  return (
    <div className="dash-panel">
      <div className="panel-header">
        <span className="panel-title">{title}</span>
        <span className="panel-action">View All →</span>
      </div>
      <div className="order-list">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="order-row" style={{ gap: '1rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0ebe5' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, background: '#f0ebe5', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 11, background: '#f5f0eb', borderRadius: 4, width: '60%' }} />
              </div>
            </div>
          ))
        ) : orders.length === 0 ? (
          <div className="empty" style={{ padding: '2rem' }}>
            <span className="empty-icon" style={{ fontSize: '2rem' }}>📦</span>
            No orders yet.
          </div>
        ) : (
          orders.map(order => <OrderCard key={order.id} {...order} />)
        )}
      </div>
    </div>
  );
}
