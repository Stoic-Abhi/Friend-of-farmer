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
