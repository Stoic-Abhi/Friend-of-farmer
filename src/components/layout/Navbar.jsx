import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();

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
        <button className="btn-outline">
          🛒 Cart <span className="cart-count">{cartCount}</span>
        </button>
        <button className="btn-primary">Sign In</button>
      </div>
    </nav>
  );
}