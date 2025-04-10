import { Router } from 'express';

import authRoute from './auth.router';
import publicRoute from './public.router';
import manegersProduct from './products.router';

const router = Router();

router.use('/auth', authRoute);
router.use('/public', publicRoute);
router.use('/managers', manegersProduct);

router.use('/health', (req, res) => {
	return res.send('Server starting');
});

export { router };
