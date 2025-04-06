import express from 'express';
import {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/customers/products.controller";

const router = express.Router();

router.get('/protducts/', getAllProducts);
router.get('/protducts/:id', getProductById);
router.post('/protducts/', createProduct);
router.put('/protducts/:id', updateProduct);
router.delete('/protducts/:id', deleteProduct);

export default router;
