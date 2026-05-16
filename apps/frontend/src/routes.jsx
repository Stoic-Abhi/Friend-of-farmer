/**
 * src/routes.jsx
 *
 * Central route registry using React Router v6 createBrowserRouter.
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

// Profile pages
import ProfileSetupPage from './pages/Profile/ProfileSetupPage.jsx';
import AccountPage      from './pages/Profile/AccountPage.jsx';

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

  // Profile setup (needs login + role, but profile not yet complete)
  {
    path: '/profile/setup',
    element: (
      <PrivateRoute>
        <ProfileSetupPage />
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
      {
        path: 'account',
        element: <AccountPage />,
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
