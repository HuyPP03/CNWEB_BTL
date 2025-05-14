import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as promotionService from '../../services/managers/product-promotions.service';
import { db } from '../../loaders/database.loader';
import { transcode } from 'buffer';

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

// Tạo mới promotion cho nhiều sản phẩm
export const createPromotion = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const productIds = await req.body.productIds;
		const created = await promotionService.createProductPromotion(
			productIds,
			req.body,
			transaction,
		);
		await transaction.commit();
		return res.status(201).json(new ResOk().formatResponse(created));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

// Thêm promotion đã có cho sản phẩm
export const productPromotion = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const promotionId = req.body.promotionId;
		const productIds = req.body.productIds;

		// 1. Kiểm tra promotion tồn tại
		const promotion = await db.promotions.findByPk(promotionId);

		if (!promotion) {
			await transaction.rollback();
			return res.status(404).json({ message: 'Promotion not found' });
		}

		// 2. Kiểm tra promotion còn hiệu lực (nếu có startDate / endDate)
		const now = new Date();
		if (
			(promotion.startDate && new Date(promotion.startDate) > now) ||
			(promotion.endDate && new Date(promotion.endDate) < now)
		) {
			await transaction.rollback();
			return res
				.status(400)
				.json({ message: 'Promotion is not currently active' });
		}
		for (let productId of productIds) {
			// 3. Kiểm tra sản phẩm tồn tại
			const product = await db.products.findByPk(productId, {
				transaction,
			});
			if (!product) {
				await transaction.rollback();
				return res.status(404).json({ message: 'Product not found' });
			}

			// 4. (Optional) Kiểm tra đã gán chưa
			const exists = await db.productPromotions.findOne({
				where: { productId, promotionId },
				transaction,
			});
			if (exists) {
				await transaction.rollback();
				return res
					.status(409)
					.json({ message: 'Product already has this promotion' });
			}

			// Tạo mới
			const resProductPromotion = await db.productPromotions.create(
				{ productId, promotionId },
				{
					include: [{ model: db.promotions }, { model: db.products }],
					transaction,
				},
			);
		}

		const promo = await db.promotions.findByPk(promotionId, {
			include: [
				{
					model: db.productPromotions,
					include: [
						{
							model: db.products,
						},
					],
				},
			],
			transaction: transaction,
		});

		await transaction.commit();
		return res.status(201).json(new ResOk().formatResponse(promo));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

// Cập nhật promotion theo productId + promotionId
export const updatePromotion = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const promotionId = Number((req as any).params.id);

		const updated = await promotionService.updatePromotion(
			promotionId,
			req.body,
			transaction,
		);
		if (!updated) {
			return res
				.status(404)
				.json({ message: 'Product-Promotion not found' });
		}
		const resultPromotion = await db.promotions.findByPk(promotionId, {
			include: [
				{
					model: db.productPromotions,
					include: [{ model: db.products }],
				},
			],
			transaction,
		});
		await transaction.commit();
		return res
			.status(200)
			.json(new ResOk().formatResponse(resultPromotion));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const detachProductFromPromotion = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const { productIds, promotionId } = req.body; // Không cần await

		// Xử lý xóa tất cả sản phẩm khỏi promotion đồng thời
		await Promise.all(
			productIds.map((productId: number) =>
				db.productPromotions.destroy({
					where: {
						productId,
						promotionId,
					},
					transaction,
				}),
			),
		);

		await transaction.commit();
		return res
			.status(201)
			.json(
				new ResOk().formatResponse({ message: 'Deleted successfully' }),
			);
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

// Xoá promotion theo productId + promotionId
export const deletePromotion = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const promotionId = Number(req.params.id);

		const deleted = await promotionService.deleteProductPromotion(
			promotionId,
		);
		if (!deleted) {
			return res
				.status(404)
				.json({ message: 'Product-Promotion not found' });
		}
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
