/**
 * src/pages/FarmerDashboard/FarmerDashboardPage.jsx
 *
 * Farmer's personal dashboard: KPI stats, order list, inventory.
 *
 * Future wiring:
 *   - Replace SEED_ORDERS with GET /api/consumer/:id/orders
 *   - Replace SEED_FARMERS with GET /api/consumer/:id/saved-farmers
 *   - Each history card gets a real-time status from WebSocket / polling
 *   - Wrap in <RequireAuth role="consumer"> guard
 */

import { useNavigate }     from 'react-router-dom';
import { useAuth }         from '../../context/AuthContext.jsx';
import { useFarmerStats }  from '../../hooks/useFarmerStats.js';
import { useFarmerOrders } from '../../hooks/useOrders.js';
import KPIBox              from '../../components/dashboard/KPIBox.jsx';
import OrderList           from '../../components/dashboard/OrderList.jsx';
import InventoryList       from '../../components/dashboard/InventoryList.jsx';

export default function FarmerDashboardPage() {
  const navigate         = useNavigate();
  const { user }         = useAuth();
  const { stats, isLoading: statsLoading } = useFarmerStats();
  const { orders, isLoading: ordersLoading } = useFarmerOrders();

  const identifier = user?.email ?? user?.phone ?? 'Farmer';

  const kpis = stats
    ? [
        { icon:'💰', value:`₹${stats.totalEarningsRs?.toLocaleString('en-IN') ?? 0}`,
          label:'Total Earnings',     trend:'From delivered orders', trendUp: true,  accent:'green' },
        { icon:'📦', value:String(stats.totalOrders ?? 0),
          label:'Orders Received',    trend:`${orders.filter(o=>o.status==='PENDING').length} pending`,
          trendUp: true, accent:'default' },
        { icon:'🌿', value:String(stats.activeListings ?? 0),
          label:'Active Listings',    trend:'', accent:'clay' },
        { icon:'⭐', value:String(stats.avgRating ?? '—'),
          label:'Farmer Rating',      trend:`${stats.reviewCount ?? 0} reviews`, trendUp: true, accent:'blue' },
      ]
    : [];

  // Normalise order shape for OrderList
  const normalisedOrders = orders.map(o => ({
    id:     o.id,
    emoji:  '📦',
    name:   o.items?.map(i => i.product?.name).join(', ') ?? 'Order',
    detail: `${o.consumer?.email ?? ''} · ${new Date(o.createdAt).toLocaleDateString('en-IN')}`,
    status: o.status?.toLowerCase() ?? 'pending',
    amount: `₹${o.totalRs}`,
  }));

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <div className="dash-greeting">🙏 Namaskara, {identifier}</div>
          <div className="dash-sub">Farmer Dashboard</div>
        </div>
        <button className="submit-btn" onClick={() => navigate('/list-product')}>
          + Add Listing
        </button>
      </div>

      {statsLoading ? (
        <div className="kpi-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="kpi-card" style={{ minHeight: 110, background: '#f5f0eb' }} />
          ))}
        </div>
      ) : (
        <div className="kpi-grid">
          {kpis.map(k => <KPIBox key={k.label} {...k} />)}
        </div>
      )}

      <div className="dash-cols">
        <OrderList orders={normalisedOrders} isLoading={ordersLoading} />
        <InventoryList farmerId={user?.id} />
      </div>
    </div>
  );
}
