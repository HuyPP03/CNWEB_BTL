import express from 'express';
import * as productsManagers from "../controllers/managers/products.controller";
import * as productsCustomers from "../controllers/customers/products.controller";
import { upload } from '../utility/media.util';
import { verifyToken } from '../middleware/authenticate.middleware';
import { authorization , RoleManager } from '../middleware/manager.middleware';

const router = express.Router();
router.use(verifyToken);

// Router cho managers
router.post('/', authorization([RoleManager.manager, RoleManager.staff]), upload.any(), productsManagers.createProduct);
router.put('/:id', authorization([RoleManager.manager, RoleManager.staff]), upload.any(), productsManagers.updateProduct);
router.delete('/:id', authorization([RoleManager.manager, RoleManager.staff]), productsManagers.deleteProduct);

// Router cho customers (lấy ra sản phẩm)
router.get('/', productsCustomers.getProducts);

export default router;
