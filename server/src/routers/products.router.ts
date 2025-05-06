import express from 'express';
import * as productsManagers from "../controllers/managers/products.controller";
import * as productsCustomers from "../controllers/customers/products.controller";
import { upload } from '../utility/media.util';

const router = express.Router();

// Router cho managers
router.post('/managers/', upload.any(), productsManagers.createProduct);
router.put('/managers/:id', productsManagers.updateProduct);
router.delete('/managers/:id', productsManagers.deleteProduct);

// Router cho customers (lấy ra sản phẩm)
router.get('/customers', productsCustomers.getProducts);

export default router;
