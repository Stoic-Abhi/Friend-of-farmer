/**
 * src/context/AuthContext.jsx
 *
 * Global authentication state via React Context + useReducer.
 *
 * State machine:
 *   mount → GET /auth/me → BOOTSTRAP_DONE(user|null)
 *   OTP verified → finishOtpVerification() → GET /auth/me → LOGIN_SUCCESS(user)
 *   role selected → setRole(role) → POST /auth/select-role + GET /auth/me → LOGIN_SUCCESS(user)
 *   logout → POST /auth/logout → LOGOUT
 *
 * Exposes: { user, isLoggedIn, isLoading, finishOtpVerification, setRole, logout }
 */

import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import * as authService from '../services/auth.service.js';

/* ── State shape ── */
const initialState = {
  user:       null,   // { id, email, phone, role, isVerified, createdAt }
  isLoggedIn: false,
  isLoading:  true,   // true until initial GET /auth/me resolves
};

/* ── Actions ── */
const BOOTSTRAP_DONE = 'BOOTSTRAP_DONE';
const LOGIN_SUCCESS  = 'LOGIN_SUCCESS';
const LOGOUT         = 'LOGOUT';

function authReducer(state, action) {
  switch (action.type) {
    case BOOTSTRAP_DONE:
      return {
        ...state,
        user:       action.user,
        isLoggedIn: !!action.user,
        isLoading:  false,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        user:       action.user,
        isLoggedIn: true,
        isLoading:  false,
      };

    case LOGOUT:
      return {
        ...state,
        user:       null,
        isLoggedIn: false,
        isLoading:  false,
      };

    default:
      return state;
  }
}

/* ── Context ── */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Bootstrap: check if user already has a valid session cookie
  useEffect(() => {
    authService.getMe()
      .then(user  => dispatch({ type: BOOTSTRAP_DONE, user }))
      .catch(()   => dispatch({ type: BOOTSTRAP_DONE, user: null }));
  }, []);

  /**
   * Called after OTP verification succeeds (cookie is now set by backend).
   * Fetches full user profile and updates state.
   * @returns {Promise<object>} user object
   */
  const finishOtpVerification = useCallback(async () => {
    const user = await authService.getMe();
    dispatch({ type: LOGIN_SUCCESS, user });
    return user;
  }, []);

  /**
   * Assign a role to the current user.
   * Re-fetches profile after role is set to get the updated token/cookie.
   * @param {'FARMER'|'CONSUMER'} role
   * @returns {Promise<object>} user object with role
   */
  const setRole = useCallback(async (role) => {
    await authService.selectRole({ role });
    const user = await authService.getMe();
    dispatch({ type: LOGIN_SUCCESS, user });
    return user;
  }, []);

  /**
   * Log out: clear session cookie + reset state.
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore errors during logout (e.g. expired token)
    }
    dispatch({ type: LOGOUT });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user:       state.user,
        isLoggedIn: state.isLoggedIn,
        isLoading:  state.isLoading,
        finishOtpVerification,
        setRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
