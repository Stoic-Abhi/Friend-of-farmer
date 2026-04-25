// src/routes/product.routes.js
// IMPORTANT: literal paths (/my, /stats) MUST come before param routes (/:id)
import { Router } from 'express';
import * as ctrl from '../controllers/product.controller.js';
import { authMiddleware, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/',             ctrl.list);
router.get('/my',           authMiddleware, requireRole('FARMER'),   ctrl.myProducts);   // before /:id
router.get('/stats',        authMiddleware, requireRole('FARMER'),   ctrl.stats);        // before /:id
router.get('/:id',          ctrl.getOne);
router.post('/',            authMiddleware, requireRole('FARMER'),   ctrl.create);
router.patch('/:id',        authMiddleware, requireRole('FARMER'),   ctrl.update);
router.delete('/:id',       authMiddleware, requireRole('FARMER'),   ctrl.remove);
router.post('/:id/review',  authMiddleware, requireRole('CONSUMER'), ctrl.addReview);

export default router;
