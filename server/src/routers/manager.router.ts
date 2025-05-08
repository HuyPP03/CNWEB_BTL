import { Router } from 'express';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';
import { authorization, RoleManager } from '../middleware/manager.middleware';
import { upload } from '../utility/media.util';
import * as productController from '../controllers/managers/products.controller';

const router = Router();

router.use(isManager);
router.use(verifyToken);

export default router;
