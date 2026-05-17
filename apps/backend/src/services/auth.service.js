// src/services/auth.service.js
// All auth business logic lives here. Controllers are thin wrappers.

import bcrypt from 'bcryptjs';
import prisma               from '../config/prisma.js';
import { dispatchOtp }      from '../config/otp-delivery.js';
import { generateOtp, hashOtp, verifyOtp, otpExpiresAt } from '../utils/otp.js';

const BCRYPT_ROUNDS = 12;

/* ── helpers ───────────────────────────────────────────────────── */

/** Normalise identifier: trim and lowercase email, strip spaces from phone */
function normalise(identifier) {
  return identifier.includes('@')
    ? identifier.trim().toLowerCase()
    : identifier.replace(/\s+/g, '');
}

/** Determine if identifier is email or phone */
function identifierField(identifier) {
  return identifier.includes('@') ? 'email' : 'phone';
}

/** Find user by email or phone */
async function findUser(identifier) {
  const field = identifierField(identifier);
  return prisma.user.findUnique({ where: { [field]: identifier } });
}

/* ── Signup ─────────────────────────────────────────────────────── */

/**
 * Stage 1 of signup: validate uniqueness, hash password, send OTP.
 * User row is NOT created yet — created only after OTP verification.
 *
 * @param {{ identifier: string, password: string }} params
 */
export async function initiateSignup({ identifier, password }) {
  const id = normalise(identifier);

  // Check duplicate
  const existing = await findUser(id);
  if (existing?.isVerified) {
    throw Object.assign(new Error('An account with this email/phone already exists.'), { status: 409 });
  }
  // If unverified stub exists, delete it so the user can retry
  if (existing && !existing.isVerified) {
    await prisma.user.delete({ where: { id: existing.id } });
  }

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const field  = identifierField(id);

  // Create unverified user stub
  await prisma.user.create({
    data: {
      [field]:   id,
      password:  hashed,
      isVerified: false,
    },
  });

  await issueAndSendOtp(id);
}

/* ── Login ──────────────────────────────────────────────────────── */

/**
 * Step 1 of login: validate credentials, send OTP.
 * @param {{ identifier: string, password: string }} params
 */
export async function initiateLogin({ identifier, password }) {
  const id   = normalise(identifier);
  const user = await findUser(id);

  if (!user) {
    throw Object.assign(new Error('Invalid credentials.'), { status: 401 });
  }
  if (!user.isVerified) {
    throw Object.assign(new Error('Account not verified. Please sign up again.'), { status: 403 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw Object.assign(new Error('Invalid credentials.'), { status: 401 });
  }

  await issueAndSendOtp(id);
  return { userId: user.id };
}

/* ── OTP ────────────────────────────────────────────────────────── */

/**
 * Generate a new OTP, persist it (hashed), and dispatch to user.
 * Deletes any existing OTP for this identifier first.
 */
export async function issueAndSendOtp(identifier) {
  // Delete any previous OTP for this identifier
  await prisma.otp.deleteMany({ where: { identifier } });

  const plain     = generateOtp();
  const hashed    = await hashOtp(plain);
  const expiresAt = otpExpiresAt();

  await prisma.otp.create({ data: { identifier, otp: hashed, expiresAt } });
  await dispatchOtp(identifier, plain);
}

/**
 * Verify OTP for signup flow — marks user as verified on success.
 * @param {{ identifier: string, otp: string }} params
 * @returns {{ userId: string, role: string|null }}
 */
export async function verifySignupOtp({ identifier, otp }) {
  const id     = normalise(identifier);
  const record = await validateOtpRecord(id, otp);

  // Cleanup OTP
  await prisma.otp.delete({ where: { id: record.id } });

  // Mark user verified
  const user = await prisma.user.update({
    where: identifierField(id) === 'email'
      ? { email: id }
      : { phone: id },
    data: { isVerified: true },
  });

  return { userId: user.id, role: user.role };
}

/**
 * Verify OTP for login flow — does NOT change user state.
 * @param {{ identifier: string, otp: string }} params
 * @returns {{ userId: string, role: string|null }}
 */
export async function verifyLoginOtp({ identifier, otp }) {
  const id     = normalise(identifier);
  const record = await validateOtpRecord(id, otp);

  await prisma.otp.delete({ where: { id: record.id } });

  const user = await findUser(id);
  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });

  return { userId: user.id, role: user.role };
}

/**
 * Shared OTP validation: finds record, checks expiry, verifies hash.
 * @throws on invalid / expired OTP
 */
async function validateOtpRecord(identifier, otp) {
  const record = await prisma.otp.findFirst({
    where: { identifier },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    throw Object.assign(new Error('OTP not found. Please request a new one.'), { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    await prisma.otp.delete({ where: { id: record.id } });
    throw Object.assign(new Error('OTP has expired. Please request a new one.'), { status: 410 });
  }

  const valid = await verifyOtp(otp, record.otp);
  if (!valid) {
    throw Object.assign(new Error('Invalid OTP.'), { status: 400 });
  }

  return record;
}

/* ── Role selection ─────────────────────────────────────────────── */

/**
 * Assign role to user. Only allowed once (idempotent for same role).
 * @param {{ userId: string, role: 'FARMER'|'CONSUMER' }} params
 * @returns {import('@prisma/client').User}
 */
export async function selectRole({ userId, role }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw Object.assign(new Error('User not found.'), { status: 404 });
  }
  if (user.role && user.role !== role) {
    throw Object.assign(new Error('Role already assigned and cannot be changed.'), { status: 409 });
  }

  return prisma.user.update({
    where: { id: userId },
    data:  { role },
  });
}

/* ── Me ─────────────────────────────────────────────────────────── */

/**
 * Fetch safe user profile (no password).
 * @param {string} userId
 */
export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: {
      id: true, email: true, phone: true, role: true,
      isVerified: true, createdAt: true,
      profile: true,
    },
  });

  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
  return user;
}
