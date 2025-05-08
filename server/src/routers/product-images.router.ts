import express  from 'express'
import * as imageController from '../controllers/managers/product-images.controller'
import { upload } from '../utility/media.util';
import { verifyToken } from '../middleware/authenticate.middleware';

const router = express.Router()
router.use(verifyToken);

// Route để upload ảnh cho sản phẩm
router.post('/:productId',upload.single('image'), imageController.uploadProductImageController);

// Route để lấy danh sách ảnh của sản phẩm
router.get('/:productId', imageController.getProductImagesController);

// Route để xóa ảnh sản phẩm
router.delete('/image/:id', imageController.deleteProductImageController);

// Route để thiết lập ảnh chính cho sản phẩm
router.put('/:productId/image/:imageId/primary', imageController.setPrimaryImageController);

export default router;