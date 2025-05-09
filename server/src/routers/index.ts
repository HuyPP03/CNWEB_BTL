import { Router } from 'express';

import authRoute from './auth.router';
import publicRoute from './public.router';
import managerRoute from './manager.router';
import customerRoute from './customer.router';
import paymentRoute from './payment.router';

const router = Router();

router.use('/auth', authRoute);
router.use('/public', publicRoute);
router.use('/manager', managerRoute);
router.use('/customer', customerRoute);
router.use('/payments', paymentRoute);

router.use('/health', (req, res) => {
	return res.send('Server starting');
});

export { router };
