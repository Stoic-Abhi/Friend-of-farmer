// src/routes/farmer.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/farmer.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole }   from '../middleware/auth.middleware.js';

const router = Router();

router.get('/',              ctrl.listFarmers);
router.get('/saved',         authMiddleware, requireRole('CONSUMER'), ctrl.savedFarmers);
router.get('/inventory',     authMiddleware, requireRole('FARMER'),   ctrl.inventory);
router.get('/:id',           ctrl.getProfile);
router.post('/:id/save',     authMiddleware, requireRole('CONSUMER'), ctrl.saveFarmer);
router.delete('/:id/save',   authMiddleware, requireRole('CONSUMER'), ctrl.unsaveFarmer);

export default router;
