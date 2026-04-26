// src/middleware/auth.middleware.js
// Verifies the HTTP-only JWT cookie on protected routes.

import { verifyToken } from '../utils/jwt.js';
import { failure }     from '../utils/response.js';

/**
 * Attach decoded JWT payload to req.user.
 * Rejects with 401 if token is missing, invalid, or expired.
 */
export function authMiddleware(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return failure(res, 'Authentication required.', 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;   // { userId, role, iat, exp }
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in again.';
    return failure(res, message, 401);
  }
}

/**
 * Gate access by role.
 * Usage: router.get('/farmer-only', authMiddleware, requireRole('FARMER'), handler)
 * @param {...string} roles
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return failure(res, 'Insufficient permissions.', 403);
    }
    next();
  };
}
