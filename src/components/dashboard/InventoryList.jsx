export default function InventoryList() {
  return (
    <div className="dash-panel">
      <div className="panel-header">
        <span className="panel-title">Inventory Status</span>
      </div>

      <div className="inventory-list">
        <div className="inv-row">🍅 Tomatoes — 75kg</div>
        <div className="inv-row">🧅 Onions — 40kg</div>
      </div>
    </div>
  );
}