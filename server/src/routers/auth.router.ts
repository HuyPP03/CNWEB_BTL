import { Router } from 'express';

import * as auth from '../controllers/auth.controller';
import { validateBody } from '../middleware/validation.middleware';
import { loginSchema } from '../validators';
import {
	forgotPasswordSchema,
	registerSchema,
	verifySchema,
} from '../validators/auth.validator';

const router = Router();

router.post('/customers/login', validateBody(loginSchema), auth.login);
router.post('/managers/login', validateBody(loginSchema), auth.loginManager);
router.post('/register', validateBody(registerSchema), auth.register);
router.post('/verify', validateBody(verifySchema), auth.verify);
// router.post('/forgot', validateBody(forgotPasswordSchema), auth.login);

export default router;
