export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-logo">
        🌾 Farm<span>Direct</span>
      </div>

      <div className="nav-links">
        <a>Browse</a>
        <a>Farmer Dashboard</a>
        <a>My Orders</a>
        <a>List Produce</a>
      </div>

      <div className="nav-actions">
        <button className="btn-outline">🛒 Cart</button>
        <button className="btn-primary">Sign In</button>
      </div>
    </nav>
  );
}