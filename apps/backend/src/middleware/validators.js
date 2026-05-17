// src/middleware/validators.js
// express-validator chains for each route.

import { body } from 'express-validator';

const isEmail  = (v) => v.includes('@');
const isPhone  = (v) => /^\+?[0-9]{7,15}$/.test(v.replace(/\s/g, ''));

function identifierValidator() {
  return body('identifier')
    .trim()
    .notEmpty().withMessage('Email or phone is required.')
    .custom((value) => {
      if (!isEmail(value) && !isPhone(value)) {
        throw new Error('Must be a valid email address or phone number.');
      }
      return true;
    });
}

export const validateSignup = [
  identifierValidator(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.'),
];

export const validateLogin = [
  identifierValidator(),
  body('password').notEmpty().withMessage('Password is required.'),
];

export const validateRequestOtp = [
  identifierValidator(),
];

export const validateVerifyOtp = [
  identifierValidator(),
  body('otp')
    .trim()
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.')
    .isNumeric().withMessage('OTP must be numeric.'),
  body('context')
    .isIn(['signup', 'login']).withMessage('Context must be "signup" or "login".'),
];

export const validateSelectRole = [
  body('role')
    .isIn(['FARMER', 'CONSUMER']).withMessage('Role must be FARMER or CONSUMER.'),
];

export const validateProfileUpdate = [
  body('displayName').optional().trim().isLength({ min: 2, max: 60 })
    .withMessage('Display name must be 2–60 characters.'),
  body('bio').optional().trim().isLength({ max: 500 })
    .withMessage('Bio must be under 500 characters.'),
  body('pincode').optional().matches(/^\d{6}$/)
    .withMessage('Pincode must be 6 digits.'),
  body('latitude').optional().isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90.'),
  body('longitude').optional().isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180.'),
  body('landSizeHa').optional().isFloat({ min: 0 })
    .withMessage('Land size must be a positive number.'),
];

const CERT_TYPES = [
  'ORGANIC_NPOP', 'ORGANIC_PGS', 'FSSAI', 'APEDA',
  'GOOD_AGRICULTURAL_PRACTICE', 'ISO_22000', 'OTHER',
];

export const validateCertification = [
  body('certType').isIn(CERT_TYPES)
    .withMessage(`certType must be one of: ${CERT_TYPES.join(', ')}`),
  body('certName').notEmpty().trim().isLength({ max: 120 })
    .withMessage('Certificate name is required (max 120 chars).'),
  body('documentUrl').notEmpty().isURL()
    .withMessage('A valid document URL is required.'),
  body('expiresAt').optional().isISO8601()
    .withMessage('expiresAt must be a valid ISO 8601 date.'),
  body('issuedAt').optional().isISO8601()
    .withMessage('issuedAt must be a valid ISO 8601 date.'),
];
