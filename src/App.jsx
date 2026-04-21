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

import { useState } from 'react';

import { CartProvider }  from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import Navbar      from './components/layout/Navbar';
import RoleTabs    from './components/layout/RoleTabs';
import CartDrawer  from './components/cart/CartDrawer';

import { ROUTES, DEFAULT_ROUTE_ID } from './routes';

export default function App() {
  const [activeView,  setActiveView]  = useState(DEFAULT_ROUTE_ID);
  const [cartOpen,    setCartOpen]    = useState(false);

  /** Resolve the active route's page component */
  const ActivePage = ROUTES.find(r => r.id === activeView)?.component ?? ROUTES[0].component;

  return (
    <CartProvider>
      <ToastProvider>
        {/* ── Persistent layout ── */}
        <Navbar
          onNavigate={setActiveView}
          onCartOpen={() => setCartOpen(true)}
        />
        <RoleTabs
          activeView={activeView}
          onNavigate={setActiveView}
        />

        {/* ── Page area ── */}
        <main>
          {/*
            Pass onNavigate so pages can trigger cross-page navigation
            (e.g. Hero CTA → ListProductPage).
            With React Router this becomes useNavigate() inside each page.
          */}
          <ActivePage onNavigate={setActiveView} />
        </main>

        {/* ── Global cart drawer ── */}
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
        />
      </ToastProvider>
    </CartProvider>
  );
}
