export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-text">
        <div className="hero-eyebrow">Direct from Indian Farms</div>

        <h1 className="hero-title">
          Fresh Produce,<br />
          <em>No Middlemen,</em><br />
          Fair Prices.
        </h1>

        <p className="hero-sub">
          Connect directly with local farmers. Get harvest-fresh
          vegetables, fruits & grains delivered from field to your table.
        </p>

        <div className="hero-ctas">
          <button className="cta-big cta-green">🛒 Shop Now</button>
          <button className="cta-big cta-ghost">🌾 Sell Your Harvest</button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-stats">
          <Stat icon="🌾" num="2,840" label="Active Farmers" />
          <Stat icon="🏘️" num="180+" label="Districts Covered" />
          <Stat icon="📦" num="1.2L" label="Orders Delivered" />
          <Stat icon="⭐" num="4.8" label="Avg. Rating" />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, num, label }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-num">{num}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}