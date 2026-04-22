/**
 * src/components/layout/Navbar.jsx
 *
 * Sticky top navigation bar.
 * Receives `onNavigate` and `onCartOpen` to stay decoupled from router.
 * When react-router is added, replace `onNavigate` calls with <Link> or useNavigate().
 */

import { useCart } from '../../context/CartContext';

export default function Navbar({ onNavigate, onCartOpen }) {
  const { totalCount } = useCart();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="nav-logo" onClick={() => onNavigate('browse')} style={{ cursor: 'pointer' }}>
        🌾 Farm<span>Direct</span>
      </div>

      {/* Links */}
      <div className="nav-links">
        <button onClick={() => onNavigate('browse')}>Browse</button>
        <button onClick={() => onNavigate('farmer-dash')}>Farmer Dashboard</button>
        <button onClick={() => onNavigate('consumer-dash')}>My Orders</button>
        <button onClick={() => onNavigate('list-product')}>List Produce</button>
      </div>

      {/* Actions */}
      <div className="nav-actions">
        <button className="btn-outline" onClick={onCartOpen}>
          🛒 Cart
          {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
        </button>
        <button className="btn-primary">Sign In</button>
      </div>
    </nav>
  );
}
