// src/utils/otp.js

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const OTP_LENGTH  = Number(process.env.OTP_LENGTH ?? 6);
const OTP_EXPIRY  = Number(process.env.OTP_EXPIRY_MINUTES ?? 5);
const BCRYPT_ROUNDS = 10;

/**
 * Generate a cryptographically random numeric OTP.
 * @returns {string} e.g. "483920"
 */
export function generateOtp() {
  const max    = 10 ** OTP_LENGTH;
  const random = crypto.randomInt(0, max);
  return random.toString().padStart(OTP_LENGTH, '0');
}

/**
 * Hash an OTP for safe storage.
 * @param {string} otp plain-text OTP
 * @returns {Promise<string>} bcrypt hash
 */
export function hashOtp(otp) {
  return bcrypt.hash(otp, BCRYPT_ROUNDS);
}

/**
 * Compare a plain OTP against its stored hash.
 * @param {string} otp       plain-text OTP from user
 * @param {string} hash      stored bcrypt hash
 * @returns {Promise<boolean>}
 */
export function verifyOtp(otp, hash) {
  return bcrypt.compare(otp, hash);
}

/**
 * Compute the OTP expiry timestamp.
 * @returns {Date}
 */
export function otpExpiresAt() {
  return new Date(Date.now() + OTP_EXPIRY * 60 * 1000);
}
