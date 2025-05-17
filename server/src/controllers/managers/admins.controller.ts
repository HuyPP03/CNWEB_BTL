import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as adminService from '../../services/managers/admins.service';
import { db } from '../../loaders/database.loader';
import { Admins } from '../../models/admins.model';
import * as adminLogService from '../../services/managers/admin-logs.service';

export const getAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const {
			id = '',
			username = '',
			fullName = '',
			email = '',
			phone = '',
			role = '',
			page = 1, // Mặc định trang 1
			limit = 20, // Mặc định số sản phẩm trên mỗi trang là 20
		} = req.query;

		// Tính toán phạm vi phân trang
		const offset =
			(parseInt(page as string) - 1) * parseInt(limit as string);
		const pageLimit = parseInt(limit as string);

		const filters = {
			id: id ? Number(id) : undefined,
			username: username as string,
			fullName: fullName as string,
			email: email as string,
			phone: phone as string,
			role: role as string,
			offset,
			page: parseInt(page as string),
			limit: pageLimit,
		};

		const [rows, count] = await adminService.getAdmin(filters, transaction);
		await transaction.commit();
		return res
			.status(200)
			.json(
				new ResOk().formatResponse(
					rows,
					'Account admin retrieved successfully',
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

export const createAccount = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const account = await adminService.createAccount(req.body, transaction);

		await adminLogService.CreateAdminLog(
			(req.user as Admins).id,
			'Create',
			account.id,
			'Account',
			req.body,
			transaction,
		);

		await transaction.commit();
		return res.status(200).json(new ResOk().formatResponse(account));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const updateAccount = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const account = await adminService.updateAccount(
			Number(req.params.id),
			req.body,
			transaction,
		);

		await adminLogService.CreateAdminLog(
			(req.user as Admins).id,
			'Update',
			account.id,
			'Account',
			req.body,
			transaction,
		);

		await transaction.commit();
		return res.status(200).json(new ResOk().formatResponse(account));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const deleteAccount = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const account = await adminService.deleteAccount(
			Number(req.params.id),
			transaction,
		);

		await adminLogService.CreateAdminLog(
			(req.user as Admins).id,
			'Delete',
			Number(req.params.id),
			'Account',
			req.body,
			transaction,
		);

		await transaction.commit();
		return res.status(200).json(new ResOk().formatResponse(account));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};
