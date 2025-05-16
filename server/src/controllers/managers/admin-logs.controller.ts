import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as adminLogService from '../../services/managers/admin-logs.service';
import { db } from '../../loaders/database.loader';

export const getAdminLogs = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const {
			id = '',
			adminId = '',
			action = '',
			entityType = '',
			entityId = '',
			details = '',
			page = 1, // Mặc định trang 1
			limit = 20, // Mặc định số sản phẩm trên mỗi trang là 20
		} = req.query;

		// Tính toán phạm vi phân trang
		const offset =
			(parseInt(page as string) - 1) * parseInt(limit as string);
		const pageLimit = parseInt(limit as string);

		const filters = {
			id: id ? Number(id) : undefined,
			adminId: adminId ? Number(adminId) : undefined,
			action: action as string,
			entityType: entityType as string,
			entityId: entityId ? Number(entityId) : undefined,
			details: details as string,
			offset,
			page: parseInt(page as string),
			limit: pageLimit,
		};

		const [rows, count] = await adminLogService.getAdminLogs(
			filters,
			transaction,
		);
		await transaction.commit();
		return res
			.status(200)
			.json(
				new ResOk().formatResponse(
					rows,
					'Admin logs retrieved successfully',
					200,
					filters.limit,
					filters.page,
					count as any,
				),
			);
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
