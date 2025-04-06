import { NextFunction, Request, Response } from 'express';
import { db } from '../../loaders/database.loader';
import { ResOk } from '../../utility/response.util';

export const getAttributeByCategoryId = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const categoryId = parseInt(req.params.categoryId, 10) || 0;
		const attributeTypes = await db.attributeTypes.findAll({
			where: {
				categoryId,
			},
			include: [
				{
					model: db.attributeTypes,
					required: false,
					as: 'subAttributes',
				},
			],
		});
		return res.status(200).json(new ResOk().formatResponse(attributeTypes));
	} catch (e) {
		next(e);
	}
};
