import { Router } from 'express';

import authRoute from './auth.router';
import publicRoute from './public.router';
import product from './products.router';
import productVariant from './product-variants.router';
import carts from './carts.router';

const router = Router();

router.use('/auth', authRoute);
router.use('/public', publicRoute);
router.use('/products', product);
router.use('/product-variant', productVariant);
router.use('/carts', carts);

router.use('/health', (req, res) => {
	return res.send('Server starting');
});

export { router };
