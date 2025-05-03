import express  from 'express'
import * as imageController from '../controllers/managers/product-images.controller'

const router = express.Router()

// Route để upload ảnh cho sản phẩm
router.post('/:productId', imageController.uploadProductImageController);

// Route để lấy danh sách ảnh của sản phẩm
router.get('/:productId', imageController.getProductImagesController);

// Route để xóa ảnh sản phẩm
router.delete('/image/:id', imageController.deleteProductImageController);

// Route để thiết lập ảnh chính cho sản phẩm
router.put('/:productId/image/:imageId/primary', imageController.setPrimaryImageController);

export default router;