import { Router } from 'express';
import * as promotionManager from '../controllers/managers/promotions.controller';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';

const router = Router();
router.use(verifyToken);
router.use(isManager);

router.get('/', promotionManager.getPromotion);
router.post('/', promotionManager.createPromotion);
router.put('/:id', promotionManager.updatePromotion);
router.delete('/:id', promotionManager.deletePromotion);
