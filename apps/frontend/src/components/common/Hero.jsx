/**
 * src/components/common/Hero.jsx
 *
 * Full-width hero banner shown at the top of the Browse page.
 */

const STATS = [
  { icon: '🌾', num: '2,840', label: 'Active Farmers' },
  { icon: '🏘️', num: '180+',  label: 'Districts Covered' },
  { icon: '📦', num: '1.2L',  label: 'Orders Delivered' },
  { icon: '⭐', num: '4.8',   label: 'Avg. Rating' },
];

/**
 * @param {{ onShopNow: () => void, onSellHarvest: () => void }} props
 */
export default function Hero({ onShopNow, onSellHarvest }) {
  return (
    <section className="hero">
      {/* Left: copy */}
      <div className="hero-text">
        <p className="hero-eyebrow">Direct from Indian Farms</p>
        <h1 className="hero-title">
          Fresh Produce,<br />
          <em>No Middlemen,</em><br />
          Fair Prices.
        </h1>
        <p className="hero-sub">
          Connect directly with local farmers. Get harvest-fresh vegetables,
          fruits &amp; grains delivered from field to your table.
        </p>
        <div className="hero-ctas">
          <button className="cta-big cta-green" onClick={onShopNow}>
            🛒 Shop Now
          </button>
          <button className="cta-big cta-ghost" onClick={onSellHarvest}>
            🌾 Sell Your Harvest
          </button>
        </div>
      </div>

      {/* Right: stat cards */}
      <div className="hero-visual">
        <div className="hero-stats">
          {STATS.map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
