// src/routes/profile.routes.js

import { Router } from 'express';
import * as profileCtrl from '../controllers/profile.controller.js';
import * as certCtrl   from '../controllers/certification.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.middleware.js';
import { validateProfileUpdate, validateCertification } from '../middleware/validators.js';

const router = Router();

// ── Profile endpoints ──
router.get('/me',           authMiddleware,                              profileCtrl.getMyProfile);
router.patch('/me',         authMiddleware, validateProfileUpdate,        profileCtrl.updateMyProfile);
router.patch('/geolocation', authMiddleware,                              profileCtrl.updateGeolocation);
router.get('/:userId',                                                   profileCtrl.getPublicProfile);

// ── Certification endpoints (farmer only) ──
router.get('/certifications',       authMiddleware, requireRole('FARMER'),                         certCtrl.getMyCerts);
router.post('/certifications',      authMiddleware, requireRole('FARMER'), validateCertification,   certCtrl.addCert);
router.patch('/certifications/:id', authMiddleware, requireRole('FARMER'),                         certCtrl.updateCert);
router.delete('/certifications/:id', authMiddleware, requireRole('FARMER'),                        certCtrl.deleteCert);

export default router;
