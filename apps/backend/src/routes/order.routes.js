// src/routes/order.routes.js
// IMPORTANT: literal paths (/mine, /incoming) MUST come before param routes (/:id)
import { Router } from 'express';
import * as ctrl from '../controllers/order.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/',            authMiddleware, requireRole('CONSUMER'), ctrl.placeOrder);
router.get('/mine',         authMiddleware, requireRole('CONSUMER'), ctrl.myOrders);
router.get('/incoming',     authMiddleware, requireRole('FARMER'),   ctrl.farmerOrders);    // before /:id
router.patch('/:id/status', authMiddleware, requireRole('FARMER'),   ctrl.updateStatus);
router.get('/:id',          authMiddleware,                          ctrl.getOrder);        // last

export default router;
