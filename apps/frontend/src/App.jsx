/**
 * src/App.jsx
 *
 * Root application shell.
 *
 * Responsibilities:
 *   - Renders Navbar + RoleTabs (persistent layout)
 *   - Owns the active-view state (manual router until react-router added)
 *   - Renders CartDrawer (global, always mounted)
 *   - Delegates page rendering to ROUTES config
 *
 * ── Adding React Router ────────────────────────────────────────
 * See src/routes.jsx for the upgrade path.
 * Once added, `activeView` + `handleNavigate` are replaced by
 * <BrowserRouter> and the browser's URL bar.
 * ─────────────────────────────────────────────────────────────
 */

// src/App.jsx — authenticated shell layout
import { useState }    from 'react';
import { Outlet }      from 'react-router-dom';
import { useAuth }     from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Navbar           from './components/layout/Navbar.jsx';
import RoleTabs         from './components/layout/RoleTabs.jsx';
import CartDrawer       from './components/cart/CartDrawer.jsx';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { user }  = useAuth();

  return (
    <CartProvider>
      <ToastProvider>
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <RoleTabs />
        <main>
          <Outlet />
        </main>
        {/* Only mount cart drawer for consumers */}
        {user?.role === 'CONSUMER' && (
          <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        )}
      </ToastProvider>
    </CartProvider>
  );
}

