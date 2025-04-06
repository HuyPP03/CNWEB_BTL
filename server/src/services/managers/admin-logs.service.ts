import { Transaction } from 'sequelize';
import { db } from '../../loaders/database.loader';

export const CreateAdminLog = async (
	adminId: number,
	action: string,
	entityId: number,
	entityType: string,
	data: any,
	transaction?: Transaction,
) => {
	const details = JSON.stringify(data);
	await db.adminLogs.create(
		{ adminId, action, entityId, entityType, details },
		{ transaction },
	);
};
