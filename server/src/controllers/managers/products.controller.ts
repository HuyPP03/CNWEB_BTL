import { NextFunction, Request, Response } from 'express';
import { db } from '../../loaders/database.loader';
import { ResOk } from '../../utility/response.util';
import { Admins } from '../../models/admins.model';
import * as adminLogService from '../../services/managers/admin-logs.service';

export const create = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const data = req.body;
		const files = req.files;
		console.log(files);
		console.log(data);
		// const product = await db.products.create(data, {
		// 	transaction,
		// });

		// await adminLogService.CreateAdminLog(
		// 	(req.user as Admins).id,
		// 	'Create',
		// 	product.id,
		// 	'Product',
		// 	transaction,
		// );
		await transaction.commit();
		return res.status(200).json(new ResOk().formatResponse(null));
	} catch (e) {
		await transaction.rollback();
		next(e);
	}
};
