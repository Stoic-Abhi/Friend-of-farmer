import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Navbar({ onCartClick }) {
  const { cartCount } = useCart();

  return (
    <nav className="nav">
      <div className="nav-logo">🌾 Farm<span>Direct</span></div>

      <div className="nav-links">
        <Link to="/">Browse</Link>
        <Link to="/farmer">Farmer Dashboard</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/list">List Produce</Link>
      </div>

      <button onClick={onCartClick}>
        🛒 {cartCount}
      </button>
    </nav>
  );
}