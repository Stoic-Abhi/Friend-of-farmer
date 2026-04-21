/**
 * src/routes.jsx
 *
 * Central route registry.
 *
 * Currently used as a config map for the manual view switcher in App.jsx.
 *
 * ── Upgrading to React Router v6 ──────────────────────────────
 * When you install react-router-dom, replace App.jsx's manual switcher
 * with <BrowserRouter> + <Routes> and use the `path` field below:
 *
 *   import { BrowserRouter, Routes, Route } from 'react-router-dom';
 *
 *   <BrowserRouter>
 *     <Routes>
 *       {ROUTES.map(r => (
 *         <Route key={r.id} path={r.path} element={<r.component />} />
 *       ))}
 *     </Routes>
 *   </BrowserRouter>
 *
 * Then replace every `onNavigate(id)` call with `useNavigate()(path)`.
 * ─────────────────────────────────────────────────────────────
 */

import BrowsePage             from './pages/Browse/BrowsePage';
import FarmerDashboardPage    from './pages/FarmerDashboard/FarmerDashboardPage';
import ListProductPage        from './pages/ListProduct/ListProductPage';
import ConsumerDashboardPage  from './pages/ConsumerDashboard/ConsumerDashboardPage';

/**
 * @typedef {{
 *   id:        string,
 *   path:      string,
 *   label:     string,
 *   component: React.ComponentType<any>,
 * }} RouteConfig
 */

/** @type {RouteConfig[]} */
export const ROUTES = [
  {
    id:        'browse',
    path:      '/',
    label:     'Browse',
    component: BrowsePage,
  },
  {
    id:        'farmer-dash',
    path:      '/farmer/dashboard',
    label:     'Farmer Dashboard',
    component: FarmerDashboardPage,
  },
  {
    id:        'list-product',
    path:      '/farmer/list',
    label:     'List Produce',
    component: ListProductPage,
  },
  {
    id:        'consumer-dash',
    path:      '/orders',
    label:     'My Orders',
    component: ConsumerDashboardPage,
  },
];

export const DEFAULT_ROUTE_ID = 'browse';
