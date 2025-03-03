import { Router } from 'express';

import authRoute from './auth.router';

const router = Router();

router.use('/auth', authRoute);

router.use('/health', (req, res) => {
	return res.send('Server starting');
});

export { router };
