import { NextFunction, Request, Response } from 'express';
import { db } from '../../loaders/database.loader';
import { ResOk } from '../../utility/response.util';

export const getBrands = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const brands = await db.brands.findAll();
		return res.status(200).json(new ResOk().formatResponse(brands));
	} catch (e) {
		next(e);
	}
};
