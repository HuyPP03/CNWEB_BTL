import express from 'express';
import * as adminAccount from '../controllers/managers/admins.controller';
import * as customerAccount from '../controllers/managers/customers.controller';
import { isManager, verifyToken } from '../middleware/authenticate.middleware';
import { authorization, RoleManager } from '../middleware/manager.middleware';

const router = express.Router();
router.use(isManager);
router.use(verifyToken);

// Quản lý account của admin
router.get(
	'/admin/',
	authorization([RoleManager.super_admin]),
	adminAccount.getAdmin,
);
router.post(
	'/admin/',
	authorization([RoleManager.super_admin]),
	adminAccount.createAccount,
);
router.put(
	'/admin/:id',
	authorization([RoleManager.super_admin]),
	adminAccount.updateAccount,
);
router.delete(
	'/admin/:id',
	authorization([RoleManager.super_admin]),
	adminAccount.deleteAccount,
);

// Quản lý account của customers
router.get(
	'/customers/',
	authorization([RoleManager.super_admin, RoleManager.manager]),
	customerAccount.getCustomer,
);
router.put(
	'/customers/:id',
	authorization([RoleManager.super_admin, RoleManager.manager]),
	customerAccount.blockCustomer,
);
export default router;
