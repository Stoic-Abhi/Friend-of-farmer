import KPIBox from "../../components/dashboard/KPIBox";
import OrderList from "../../components/dashboard/OrderList";
import InventoryList from "../../components/dashboard/InventoryList";

export default function FarmerDashboardPage() {
  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <div className="dash-greeting">🙏 Namaskara, Raju Gowda</div>
          <div className="dash-sub">
            Tumkur District · Member since March 2023
          </div>
        </div>

        <button className="submit-btn">+ Add New Listing</button>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <KPIBox title="Earnings This Month" value="₹48,320" />
        <KPIBox title="Orders Received" value="143" />
        <KPIBox title="Active Listings" value="8" />
        <KPIBox title="Farmer Rating" value="4.7" />
      </div>

      <div className="dash-cols">
        <OrderList />
        <InventoryList />
      </div>
    </div>
  );
}