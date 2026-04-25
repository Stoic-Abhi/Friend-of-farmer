// src/routes/auth.routes.js

import { Router } from 'express';
import * as ctrl  from '../controllers/auth.controller.js';
import { authMiddleware }  from '../middleware/auth.middleware.js';
import { authLimiter, otpLimiter } from '../middleware/rate-limit.middleware.js';
import {
  validateSignup,
  validateLogin,
  validateRequestOtp,
  validateVerifyOtp,
  validateSelectRole,
} from '../middleware/validators.js';

const router = Router();

// Public routes
router.post('/signup',      authLimiter, validateSignup,     ctrl.signup);
router.post('/login',       authLimiter, validateLogin,      ctrl.login);
router.post('/request-otp', otpLimiter,  validateRequestOtp, ctrl.requestOtp);
router.post('/verify-otp',  otpLimiter,  validateVerifyOtp,  ctrl.verifyOtp);
router.post('/logout',                                        ctrl.logout);

// Protected routes (require valid JWT cookie)
router.post('/select-role', authMiddleware, validateSelectRole, ctrl.selectRole);
router.get('/me',           authMiddleware,                     ctrl.me);

export default router;
