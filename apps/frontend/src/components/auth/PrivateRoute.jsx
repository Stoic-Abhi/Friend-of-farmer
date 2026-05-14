// src/components/auth/PrivateRoute.jsx
// Production-ready route guard with role + profile checking.

import { Navigate } from 'react-router-dom';
import { useAuth }  from '../../context/AuthContext.jsx';

/**
 * @param {{
 *   children:         React.ReactNode,
 *   requireRole?:     'FARMER' | 'CONSUMER',
 *   skipRoleCheck?:   boolean,   // allow access even without role (select-role page)
 *   requireProfile?:  boolean,   // redirect to /profile/setup if no displayName
 * }} props
 */
export default function PrivateRoute({
  children, requireRole, skipRoleCheck = false, requireProfile = false,
}) {
  const { isLoading, isLoggedIn, user } = useAuth();

  // Still hydrating from cookie — show nothing to prevent flash
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--cream)',
      }}>
        <div className="auth-spinner" style={{ width: 32, height: 32, borderWidth: 3,
          borderColor: 'rgba(74,124,63,0.2)', borderTopColor: 'var(--leaf)' }} />
      </div>
    );
  }

  // Not authenticated → login
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // Authenticated but no role (and role is required)
  if (!skipRoleCheck && !user?.role) return <Navigate to="/select-role" replace />;

  // Role mismatch
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Profile required but incomplete
  if (requireProfile && !user?.profile?.displayName) {
    return <Navigate to="/profile/setup" replace />;
  }

  return children;
}
