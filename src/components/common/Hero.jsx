export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-left">
        <div className="hero-eyebrow">
          DIRECT FROM INDIAN FARMS
        </div>

        <h1>
          Fresh Produce,<br />
          <span>No Middlemen,</span><br />
          Fair Prices.
        </h1>

        <p>
          Connect directly with local farmers. Get harvest-fresh
          vegetables, fruits & grains delivered from field to your table.
        </p>

        <div className="hero-buttons">
          <button className="shop-btn">🛒 Shop Now</button>
          <button className="sell-btn">🌾 Sell Your Harvest</button>
        </div>
      </div>

      <div className="hero-right">
        <Stat num="2,840" label="Active Farmers" />
        <Stat num="180+" label="Districts Covered" />
        <Stat num="1.2L" label="Orders Delivered" />
        <Stat num="4.8" label="Avg. Rating" />
      </div>
    </div>
  );
}

function Stat({ num, label }) {
  return (
    <div className="stat-card">
      <div className="stat-num">{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}