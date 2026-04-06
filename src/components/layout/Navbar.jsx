import { useCart } from "../../context/CartContext";

export default function Navbar({ onCartClick }) {
  const { cartCount } = useCart();

  return (
    <nav className="nav">
      <div className="nav-logo">
        🌾 Farm<span>Direct</span>
      </div>

      <div className="nav-actions">
        <button className="btn-outline" onClick={onCartClick}>
          🛒 Cart <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}