/**
 * src/components/dashboard/OrderList.jsx
 *
 * Panel wrapper that renders a list of OrderCard rows.
 * Data will come from GET /api/farmer/:id/orders when backend is live.
 *
 * @param {{ orders: Array, title?: string }} props
 */

import OrderCard from './OrderCard';

/** Static seed — replace with API response */
const SEED_ORDERS = [
  { id: 1, emoji: '🍅', name: 'Tomatoes × 10 kg',  detail: 'Priya Sharma · Bengaluru · 2 hrs ago',  status: 'pending',   amount: '₹280'   },
  { id: 2, emoji: '🥦', name: 'Broccoli × 3 kg',   detail: 'Amit Verma · Mysuru · 5 hrs ago',        status: 'packed',    amount: '₹390'   },
  { id: 3, emoji: '🌾', name: 'Ragi × 25 kg',       detail: 'Sunita Rao · Tumkur · Yesterday',        status: 'delivered', amount: '₹1,250' },
  { id: 4, emoji: '🧅', name: 'Onions × 20 kg',    detail: 'Ramesh K · Hassan · Yesterday',           status: 'delivered', amount: '₹700'   },
  { id: 5, emoji: '🥕', name: 'Carrots × 8 kg',    detail: 'Meena Iyer · Bengaluru · 2 days ago',    status: 'delivered', amount: '₹560'   },
];

export default function OrderList({ orders = SEED_ORDERS, title = 'Recent Orders' }) {
  return (
    <div className="dash-panel">
      <div className="panel-header">
        <span className="panel-title">{title}</span>
        <span className="panel-action">View All →</span>
      </div>
      <div className="order-list">
        {orders.map(order => (
          <OrderCard key={order.id} {...order} />
        ))}
      </div>
    </div>
  );
}
