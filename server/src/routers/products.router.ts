import express from 'express';
import * as productsManagers from "../controllers/managers/products.controller";
import * as productsCustomers from "../controllers/customers/products.controller";
import { upload } from '../utility/media.util';
import { verifyToken } from '../middleware/authenticate.middleware';

const router = express.Router();
router.use(verifyToken);

// Router cho managers
router.post('/', upload.any(), productsManagers.createProduct);
router.put('/:id', productsManagers.updateProduct);
router.delete('/:id', productsManagers.deleteProduct);

// Router cho customers (lấy ra sản phẩm)
router.get('/', productsCustomers.getProducts);

export default router;
