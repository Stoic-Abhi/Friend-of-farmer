/**
 * src/components/layout/RoleTabs.jsx
 *
 * Horizontal role-selector tab bar below the Navbar.
 * Driven by a config array so adding a new tab is a one-liner.
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const FARMER_TABS = [
  { path: '/farmer/dashboard', label: '🚜 Dashboard' },
  { path: '/list-product',     label: '📋 List Produce' },
  { path: '/browse',           label: '🌿 Browse Market' },
];

const CONSUMER_TABS = [
  { path: '/browse',  label: '🌿 Browse Produce' },
  { path: '/orders',  label: '📦 My Orders' },
];

export default function RoleTabs() {
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  const tabs = user?.role === 'FARMER' ? FARMER_TABS
             : user?.role === 'CONSUMER' ? CONSUMER_TABS
             : [];

  if (!tabs.length) return null;

  return (
    <div className="role-bar">
      {tabs.map(tab => (
        <button
          key={tab.path}
          className={`role-tab${pathname === tab.path ? ' active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
