import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as customerService from '../../services/managers/customers.service';
import { db } from '../../loaders/database.loader';
import { Admins } from '../../models/admins.model';
import * as adminLogService from '../../services/managers/admin-logs.service';

export const getCustomer = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const {
			id = '',
			fullName = '',
			email = '',
			phone = '',
			address = '',
			isActive,
			page = 1, // Mặc định trang 1
			limit = 20, // Mặc định số sản phẩm trên mỗi trang là 20
		} = req.query;

		// Tính toán phạm vi phân trang
		const offset =
			(parseInt(page as string) - 1) * parseInt(limit as string);
		const pageLimit = parseInt(limit as string);

		let isActiveBool: boolean | undefined = undefined;
		if (isActive === 'true') isActiveBool = true;
		else if (isActive === 'false') isActiveBool = false;

		const filters = {
			id: id ? Number(id) : undefined,
			fullName: fullName as string,
			email: email as string,
			phone: phone as string,
			address: address as string,
			isActive: isActiveBool,
			offset,
			page: parseInt(page as string),
			limit: pageLimit,
		};

		const [rows, count] = await customerService.getCustomer(
			filters,
			transaction,
		);
		await transaction.commit();
		return res
			.status(200)
			.json(
				new ResOk().formatResponse(
					rows,
					'Customers retrieved successfully',
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

export const blockCustomer = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const { customerId, isBlock } = req.body;

		// Kiểm tra dữ liệu đầu vào
		if (typeof customerId !== 'number' || typeof isBlock !== 'boolean') {
			throw new Error('Invalid request data');
		}

		const customer = await customerService.blockCustomer(
			customerId,
			isBlock,
			transaction,
		);

		await adminLogService.CreateAdminLog(
			(req.user as Admins).id,
			'Block',
			customerId,
			'Customer',
			req.body,
			transaction,
		);
		await transaction.commit();
		return res
			.status(200)
			.json(new ResOk().formatResponse(customer, 'Customer updated'));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};
