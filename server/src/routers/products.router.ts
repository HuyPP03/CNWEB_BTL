import express from 'express';
import * as productsManagers from "../controllers/managers/products.controller";
import * as productsCustomers from "../controllers/customers/products.controller";
import { upload } from '../utility/media.util';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';
import { authorization , RoleManager } from '../middleware/manager.middleware';

const router = express.Router();

// Router cho customers (lấy ra sản phẩm)
router.get('/', productsCustomers.getProducts);

router.use(isManager)
router.use(verifyToken);

// Router cho managers
router.post('/', authorization([RoleManager.manager, RoleManager.staff]), upload.any(), productsManagers.createProduct);
router.put('/:id', authorization([RoleManager.manager, RoleManager.staff]), upload.any(), productsManagers.updateProduct);
router.delete('/:id', authorization([RoleManager.manager, RoleManager.staff]), productsManagers.deleteProduct);

export default router;
