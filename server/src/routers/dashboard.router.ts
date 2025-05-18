import express from 'express';
import * as dashboard from '../controllers/managers/dashboard.controller';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';

const router = express.Router();

// Manager xem và xóa phản hồi
router.get('/', isManager, verifyToken, dashboard.getAllDashboard);

export default router;
