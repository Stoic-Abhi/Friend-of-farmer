import OrderCard from "../../components/dashboard/OrderCard";

export default function ConsumerDashboardPage() {
  return (
    <div className="consumer-dash">
      <div className="dash-header">
        <div>
          <div className="dash-greeting">👋 Hello, Priya!</div>
          <div className="dash-sub">
            Bengaluru · Joined January 2024
          </div>
        </div>
      </div>

      <div className="section-tag">ORDER HISTORY</div>

      <div className="order-history">
        <OrderCard
          id="FD-20481"
          status="Delivered"
          items="🍅 🥦 🧅"
          farmer="Raju Gowda"
          total="₹670"
        />

        <OrderCard
          id="FD-20612"
          status="Out for Delivery"
          items="🌾 🥬"
          farmer="Kavitha Devi"
          total="₹920"
        />
      </div>
    </div>
  );
}