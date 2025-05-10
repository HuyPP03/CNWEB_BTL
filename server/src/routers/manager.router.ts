import { Router } from 'express';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';
import { authorization, RoleManager } from '../middleware/manager.middleware';
import { upload } from '../utility/media.util';
import * as productController from '../controllers/managers/products.controller';
import { getMe } from '../controllers/auth.controller';

const router = Router();

router.use(isManager);
router.use(verifyToken);

router.post(
	'/',
	authorization([RoleManager.staff]),
	upload.any(),
	productController.create,
);

router.get('/me', getMe);

export default router;
