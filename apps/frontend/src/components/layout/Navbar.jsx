/**
 * src/components/layout/Navbar.jsx
 *
 * Sticky top navigation bar.
 * Receives `onNavigate` and `onCartOpen` to stay decoupled from router.
 * When react-router is added, replace `onNavigate` calls with <Link> or useNavigate().
 */
import { useNavigate } from 'react-router-dom';
import { useCart }          from '../../context/CartContext.jsx';
import { useAuth }          from '../../context/AuthContext.jsx';
import NotificationBell     from '../notifications/NotificationBell.jsx';

export default function Navbar({ onCartOpen }) {
  const { totalCount }         = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate               = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        🌾 Farm<span>Direct</span>
      </div>

      <div className="nav-links">
        <button onClick={() => navigate('/browse')}>Browse</button>
        {isLoggedIn && user?.role === 'FARMER' && (
          <>
            <button onClick={() => navigate('/farmer/dashboard')}>Dashboard</button>
            <button onClick={() => navigate('/list-product')}>List Produce</button>
          </>
        )}
        {isLoggedIn && user?.role === 'CONSUMER' && (
          <button onClick={() => navigate('/orders')}>My Orders</button>
        )}
      </div>

      <div className="nav-actions">
        {isLoggedIn && <NotificationBell />}
        {isLoggedIn && user?.role === 'CONSUMER' && (
          <button className="btn-outline" onClick={onCartOpen}>
            🛒 Cart
            {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
          </button>
        )}

        {isLoggedIn ? (
          <button className="btn-outline" onClick={logout}>Sign Out</button>
        ) : (
          <>
            <button className="btn-outline" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}