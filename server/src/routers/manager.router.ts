import { Router } from 'express';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';
import { authorization, RoleManager } from '../middleware/manager.middleware';
import * as adminlog from '../controllers/managers/admin-logs.controller';
import { getMe } from '../controllers/auth.controller';

const router = Router();

router.use(isManager);
router.use(verifyToken);

router.get('/me', getMe);
router.get('/admin-log', adminlog.getAdminLogs);
router.delete('/admin-log/:id', adminlog.deleteAdminLogs);

export default router;
