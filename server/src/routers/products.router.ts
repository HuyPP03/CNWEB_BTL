import express from 'express';
import * as productsManagers from '../controllers/managers/products.controller';
import * as productsCustomers from '../controllers/customers/products.controller';
import { upload } from '../utility/media.util';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';
import { authorization, RoleManager } from '../middleware/manager.middleware';
import * as wishlist from '../controllers/customers/wishlists.controller';

const router = express.Router();

// Router cho customers (lấy ra sản phẩm)
router.get('/', productsCustomers.getProducts);

router.use(verifyToken);

// Wishlist cho customer
router.get('/wishlist', wishlist.getAllWishlists);
router.post('/wishlist/:id', wishlist.createWishlist);
router.delete('/wishlist/:id', wishlist.deleteWishlist);

router.use(isManager);

// Router cho managers
router.post(
	'/',
	authorization([RoleManager.manager, RoleManager.staff]),
	upload.any(),
	productsManagers.createProduct,
);
router.put(
	'/:id',
	authorization([RoleManager.manager, RoleManager.staff]),
	upload.any(),
	productsManagers.updateProduct,
);
router.delete(
	'/:id',
	authorization([RoleManager.manager, RoleManager.staff]),
	productsManagers.deleteProduct,
);

export default router;
