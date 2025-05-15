import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import { CreateAdminLog } from '../../services/managers/admin-logs.service';
import { db } from '../../loaders/database.loader';

export const getAdminLogs = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const adminLogs = await db.adminLogs.findAll({ transaction });
		await transaction.commit();
		return res.status(200).json(new ResOk().formatResponse(adminLogs));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const deleteAdminLogs = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const id = Number(req.params.id);
		const adminLog = await db.adminLogs.findByPk(id, { transaction });
		if (!adminLog) {
			await transaction.rollback();
			return res.status(404).json({ message: 'admin-log not found' });
		}
		await adminLog.destroy({ transaction });
		await transaction.commit();
		return res
			.status(200)
			.json(
				new ResOk().formatResponse({ message: 'Deleted successfully' }),
			);
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};
