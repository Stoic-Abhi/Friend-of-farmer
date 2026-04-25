// src/controllers/auth.controller.js
// Controllers are thin: validate → call service → set cookie → respond.

import { validationResult } from 'express-validator';
import * as authService     from '../services/auth.service.js';
import { signToken, COOKIE_OPTIONS } from '../utils/jwt.js';
import { success, failure }          from '../utils/response.js';

/* ── helper: extract & respond with validation errors ── */
function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    failure(res, 'Validation failed', 422, errors.array());
    return true;
  }
  return false;
}

/* ── helper: issue cookie + respond ── */
function issueTokenResponse(res, payload, message, statusCode = 200) {
  const token = signToken(payload);
  res.cookie('token', token, COOKIE_OPTIONS);
  return success(res, payload, message, statusCode);
}

/* ──────────────────────────────────────────────────────────────── */

/**
 * POST /auth/signup
 * Body: { identifier, password }
 */
export async function signup(req, res) {
  if (checkValidation(req, res)) return;

  try {
    const { identifier, password } = req.body;
    await authService.initiateSignup({ identifier, password });
    return success(res, { identifier }, 'OTP sent. Please verify your account.', 201);
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

/**
 * POST /auth/login
 * Body: { identifier, password }
 * Step 1 of 2FA — verifies credentials, sends OTP.
 */
export async function login(req, res) {
  if (checkValidation(req, res)) return;

  try {
    const { identifier, password } = req.body;
    const { userId } = await authService.initiateLogin({ identifier, password });
    return success(res, { userId, identifier }, 'OTP sent to your registered contact.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

/**
 * POST /auth/request-otp
 * Body: { identifier }
 * Re-sends OTP (resend button / expired OTP).
 */
export async function requestOtp(req, res) {
  if (checkValidation(req, res)) return;

  try {
    const { identifier } = req.body;
    await authService.issueAndSendOtp(identifier);
    return success(res, {}, 'OTP sent.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

/**
 * POST /auth/verify-otp
 * Body: { identifier, otp, context: 'signup' | 'login' }
 * On success: issues JWT cookie.
 */
export async function verifyOtp(req, res) {
  if (checkValidation(req, res)) return;

  try {
    const { identifier, otp, context } = req.body;

    const result =
      context === 'signup'
        ? await authService.verifySignupOtp({ identifier, otp })
        : await authService.verifyLoginOtp({ identifier, otp });

    return issueTokenResponse(
      res,
      { userId: result.userId, role: result.role },
      'OTP verified successfully.'
    );
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

/**
 * POST /auth/select-role
 * Body: { role: 'FARMER' | 'CONSUMER' }
 * Protected — requires valid JWT cookie.
 */
export async function selectRole(req, res) {
  if (checkValidation(req, res)) return;

  try {
    const { role }  = req.body;
    const { userId } = req.user;         // set by authMiddleware

    const user = await authService.selectRole({ userId, role });

    // Re-issue token with updated role
    return issueTokenResponse(
      res,
      { userId: user.id, role: user.role },
      'Role selected successfully.'
    );
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

/**
 * GET /auth/me
 * Protected — returns current user profile.
 */
export async function me(req, res) {
  try {
    const user = await authService.getMe(req.user.userId);
    return success(res, user, 'User profile fetched.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

/**
 * POST /auth/logout
 * Clears the HTTP-only cookie.
 */
export async function logout(req, res) {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  return success(res, {}, 'Logged out successfully.');
}
