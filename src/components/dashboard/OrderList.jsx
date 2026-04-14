export default function OrderList() {
  return (
    <div className="dash-panel">
      <div className="panel-header">
        <span className="panel-title">Recent Orders</span>
      </div>

      <div className="order-list">
        <div className="order-row">
          🍅 Tomatoes × 10kg — ₹280
        </div>

        <div className="order-row">
          🥦 Broccoli × 3kg — ₹390
        </div>
      </div>
    </div>
  );
}