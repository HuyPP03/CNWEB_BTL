import express from 'express';
import * as products from "../controllers/managers/products.controller";

const router = express.Router();

router.get('/products/', products.getAllProducts);
router.get('/products/:id', products.getProductById);
router.post('/products/', products.createProduct);
router.put('/products/:id', products.updateProduct);
router.delete('/products/:id', products.deleteProduct);

export default router;
