import express from 'express';
import * as productsManagers from "../controllers/managers/products.controller";
import * as productsCustomers from "../controllers/customers/products.controller";

const router = express.Router();

// Router cho managers
router.get('/managers/', productsManagers.getAllProducts);
router.get('/managers/:id', productsManagers.getProductById);
router.post('/managers/', productsManagers.createProduct);
router.put('/managers/:id', productsManagers.updateProduct);
router.delete('/managers/:id', productsManagers.deleteProduct);

// Router cho customers
router.get('/customers', productsCustomers.getAllProducts);
router.get('/customers/:id', productsCustomers.getProductById);
router.get('/customers/search/name/:name', productsCustomers.getProductsByName);
router.get('/customers/search/brand/:brandId', productsCustomers.getProductsByBrand);
router.get('/customers/search/category/:categoryId', productsCustomers.getProductsByCategory);
router.get('/customers/search/price', productsCustomers.getProductsByPriceRange);
router.get('/customers/filter', productsCustomers.filterProducts);

export default router;
