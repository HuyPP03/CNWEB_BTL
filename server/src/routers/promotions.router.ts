import { Router } from 'express';
import * as promotionManager from '../controllers/managers/promotions.controller';

const router = Router();

router.get('/product-promotions', promotionManager.getPromotion);
router.post('/product-promotions', promotionManager.createPromotion);
router.put('/product-promotions/:productId/:promotionId', promotionManager.updatePromotion);
router.delete('/product-promotions/:productId/:promotionId', promotionManager.deletePromotion);
