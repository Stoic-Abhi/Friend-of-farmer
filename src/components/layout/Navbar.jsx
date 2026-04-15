import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Navbar({ onCartClick }) {
  const { cartCount } = useCart();

  return (
    <nav className="nav">
      <div className="nav-left">
        <span className="logo-icon">🌾</span>
        <span className="logo-text">
          <strong>Farm</strong> <span>Direct</span>
        </span>
      </div>

      <div className="nav-links">
        <Link to="/">Browse</Link>
        <Link to="/farmer">Farmer Dashboard</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/list">List Produce</Link>
      </div>

      <div className="nav-actions">
        <button className="cart-btn" onClick={onCartClick}>
          🛒 Cart <span className="cart-count">{cartCount}</span>
        </button>
        <button className="sign-btn">Sign In</button>
      </div>
    </nav>
  );
}