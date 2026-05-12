// src/routes/notification.routes.js

import { Router } from 'express';
import * as ctrl from '../controllers/notification.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All notification routes require authentication
router.get('/',              authMiddleware, ctrl.list);
router.patch('/:id/read',    authMiddleware, ctrl.markRead);
router.patch('/read-all',    authMiddleware, ctrl.markAllRead);

export default router;
