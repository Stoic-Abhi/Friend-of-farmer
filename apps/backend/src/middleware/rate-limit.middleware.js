// src/middleware/rate-limit.middleware.js
// Per-route rate limiting to prevent brute-force and OTP spam.

import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV === 'development';

/** Generic limiter factory */
function limiter({ windowMinutes, max, message }) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max:      isDev ? 1000 : max,          // relaxed in dev
    message:  { ok: false, message },
    standardHeaders: true,
    legacyHeaders:   false,
  });
}

/** 5 signup/login attempts per 15 min per IP */
export const authLimiter = limiter({
  windowMinutes: 15,
  max: 5,
  message: 'Too many attempts. Please try again in 15 minutes.',
});

/** 3 OTP requests per 10 min per IP */
export const otpLimiter = limiter({
  windowMinutes: 10,
  max: 3,
  message: 'Too many OTP requests. Please wait before requesting again.',
});
