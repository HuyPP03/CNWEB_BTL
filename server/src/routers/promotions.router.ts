import { Router } from 'express';
import * as promotionManager from '../controllers/managers/promotions.controller';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';

const router = Router();

//Lấy ra các khuyến mãi (có filter)
router.get('/', promotionManager.getPromotion);

router.use(verifyToken);
router.use(isManager);

router.post('/', promotionManager.createPromotion); // Tạo khuyến mãi mới
router.post('/product-promotion', promotionManager.createPromotion); // Thêm khuyến mãi vào các sản phẩm
router.put('/:id', promotionManager.updatePromotion); // Chỉnh sửa khuyến mãi
router.delete('/:id', promotionManager.deletePromotion); // Xóa khuyến mãi

export default router;
