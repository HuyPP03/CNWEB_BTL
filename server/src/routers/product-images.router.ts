import express from 'express';
import * as imageController from '../controllers/managers/product-images.controller';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';
import { authorization, RoleManager } from '../middleware/manager.middleware';
// import { upload } from '../utility/media.util';
import { upload } from '../utility/cloudinary.util';

const router = express.Router();

// Route để lấy danh sách ảnh của sản phẩm
router.get('/:productId', imageController.getProductImagesController);

router.use(isManager);
router.use(verifyToken);

// Route để upload ảnh cho sản phẩm
router.post(
	'/:productId',
	authorization([RoleManager.manager, RoleManager.staff]),
	upload.single('image'),
	imageController.uploadProductImageController,
);

// Route để xóa ảnh sản phẩm
router.delete(
	'/image/:id',
	authorization([RoleManager.manager, RoleManager.staff]),
	imageController.deleteProductImageController,
);

// Route để thiết lập ảnh chính cho sản phẩm
router.put(
	'/:productId/image/:imageId/primary',
	authorization([RoleManager.manager, RoleManager.staff]),
	imageController.setPrimaryImageController,
);

export default router;
