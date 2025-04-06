import { Router } from 'express';
import { verifyToken } from '../middleware/authenticate.middleware';

const router = Router();

router.use(verifyToken);

//cart

//product

//order

export default router;
