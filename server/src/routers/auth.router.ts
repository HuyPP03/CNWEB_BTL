import { Router } from 'express';

import * as auth from '../controllers/auth.controller';
import { validateBody } from '../middleware/validation.middleware';
import { loginSchema } from '../validators';
import { forgotPasswordSchema, registerSchema, verifySchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validateBody(loginSchema), auth.login);
router.post('/register', validateBody(registerSchema), auth.register);
router.post('/forgot', validateBody(forgotPasswordSchema), auth.login);
router.post('/verify', validateBody(verifySchema), auth.verify);

export default router;
