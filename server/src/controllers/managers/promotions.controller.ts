import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as promotionService from '../../services/managers/product-promotions.service';
import { db } from '../../loaders/database.loader';

// Lấy promotion (có thể lọc theo productId, promotionId)
export const getPromotion = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const data = await promotionService.getPromotion(req.body, transaction);
		await transaction.commit();
		return res.status(200).json(new ResOk().formatResponse(data));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

// Tạo mới promotion
export const createPromotion = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const created = await promotionService.createProductPromotion(
			req.body,
			transaction,
		);
		return res.status(201).json(new ResOk().formatResponse(created));
	} catch (error) {
		next(error);
	}
};

// Cập nhật promotion theo productId + promotionId
export const updatePromotion = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const promotionId = parseInt((req as any).params);

		const updated = await promotionService.updateProductPromotion(
			promotionId,
			req.body,
		);
		if (!updated) {
			return res
				.status(404)
				.json({ message: 'Product-Promotion not found' });
		}
		return res.status(200).json(new ResOk().formatResponse(updated));
	} catch (error) {
		next(error);
	}
};

// Xoá promotion theo productId + promotionId
export const deletePromotion = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const promotionId = parseInt((req as any).params);

		const deleted = await promotionService.deleteProductPromotion(
			promotionId,
		);
		if (!deleted) {
			return res
				.status(404)
				.json({ message: 'Product-Promotion not found' });
		}
		return res.status(200).json(new ResOk().formatResponse({ deleted }));
	} catch (error) {
		next(error);
	}
};
