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
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth }  from './context/AuthContext.jsx';
import App          from './App.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';

// Auth pages
import LoginPage      from './pages/auth/LoginPage.jsx';
import SignupPage     from './pages/auth/SignupPage.jsx';
import VerifyOtpPage  from './pages/auth/VerifyOtpPage.jsx';
import SelectRolePage from './pages/auth/SelectRolePage.jsx';

// App pages
import BrowsePage            from './pages/Browse/BrowsePage.jsx';
import FarmerDashboardPage   from './pages/FarmerDashboard/FarmerDashboardPage.jsx';
import ConsumerDashboardPage from './pages/ConsumerDashboard/ConsumerDashboardPage.jsx';
import ListProductPage       from './pages/ListProduct/ListProductPage.jsx';

function DashboardRedirect() {
  const { user } = useAuth();
  if (user?.role === 'FARMER')   return <Navigate to="/farmer/dashboard" replace />;
  if (user?.role === 'CONSUMER') return <Navigate to="/browse" replace />;
  return <Navigate to="/select-role" replace />;
}

export const router = createBrowserRouter([
  // Public auth
  { path: '/login',      element: <LoginPage /> },
  { path: '/signup',     element: <SignupPage /> },
  { path: '/verify-otp', element: <VerifyOtpPage /> },

  // Needs login but no role yet
  {
    path: '/select-role',
    element: (
      <PrivateRoute skipRoleCheck>
        <SelectRolePage />
      </PrivateRoute>
    ),
  },

  // Protected app shell
  {
    path: '/',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      { index: true,         element: <DashboardRedirect /> },
      { path: 'dashboard',   element: <DashboardRedirect /> },
      { path: 'browse',      element: <BrowsePage /> },
      {
        path: 'farmer/dashboard',
        element: (
          <PrivateRoute requireRole="FARMER">
            <FarmerDashboardPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'list-product',
        element: (
          <PrivateRoute requireRole="FARMER">
            <ListProductPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <PrivateRoute requireRole="CONSUMER">
            <ConsumerDashboardPage />
          </PrivateRoute>
        ),
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
