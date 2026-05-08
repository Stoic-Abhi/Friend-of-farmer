// src/utils/jwt.js

import jwt from 'jsonwebtoken';

const SECRET  = process.env.JWT_SECRET;
const EXPIRY  = process.env.JWT_EXPIRY ?? '7d';

if (!SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

/**
 * Sign a JWT with userId and role.
 * @param {{ userId: string, role: string|null }} payload
 * @returns {string} signed token
 */
export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY });
}

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {{ userId: string, role: string|null }} decoded payload
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

/**
 * Cookie options — HTTP-only, Secure in production.
 */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.COOKIE_SAME_SITE ?? 'lax',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days in ms
};
