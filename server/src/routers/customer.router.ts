import { Router } from 'express';
import { verifyToken } from '../middleware/authenticate.middleware';
import { getMe } from '../controllers/auth.controller';
import { updateProfile } from '../controllers/customers/customer.controller';
const router = Router();

router.use(verifyToken);

router.get('/me', getMe);

router.put('/me', updateProfile);

//cart

//product

//order

export default router;
