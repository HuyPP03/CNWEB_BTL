import { db } from '../../loaders/database.loader';
import { Transaction, Op } from 'sequelize';

export const getPromotion = async (data: any, transaction?: Transaction) => {
	// Tạo đối tượng điều kiện where để lọc
	const whereClause: any = {};

	if (data.id !== undefined) whereClause.id = data.id;
	if (data.name !== undefined) whereClause.name = data.name;
	if (data.discountPercent !== undefined)
		whereClause.discountPercent = data.discountPercent;
	if (data.discountAmount !== undefined)
		whereClause.discountAmount = data.discountAmount;
	if (data.minimumPurchaseAmount !== undefined)
		whereClause.minimumPurchaseAmount = data.minimumPurchaseAmount;
	if (data.maximumDiscountAmount !== undefined)
		whereClause.maximumDiscountAmount = data.maximumDiscountAmount;
	if (data.discountCode !== undefined)
		whereClause.discountCode = data.discountCode;
	if (data.usageLimit !== undefined) whereClause.usageLimit = data.usageLimit;
	if (data.usageCount !== undefined) whereClause.usageCount = data.usageCount;
	if (data.usageLimitPerCustomer !== undefined)
		whereClause.usageLimitPerCustomer = data.usageLimitPerCustomer;
	if (data.isActive !== undefined) whereClause.isActive = data.isActive;
	if (data.isDeleted !== undefined) whereClause.isDeleted = data.isDeleted;
	if (data.isExpired !== undefined) whereClause.isExpired = data.isExpired;
	if (data.startDate !== undefined)
		whereClause.startDate = { [Op.gte]: data.startDate };
	if (data.endDate !== undefined)
		whereClause.endDate = { [Op.lte]: data.endDate };

	// Truy vấn khuyến mãi
	const promotion = await db.promotions.findOne({
		where: whereClause,
		transaction,
	});

	// Nếu có `promotion`, thì tìm tiếp productPromotions liên quan (nếu cần)
	if (!promotion) return null;

	const productPromotion = await db.productPromotions.findOne({
		where: { promotionId: promotion.id },
		transaction,
	});

	// Trả về cả 2 nếu cần, hoặc có thể trả về promotion thôi
	return {
		promotion,
		productPromotion,
	};
};

export const createProductPromotion = async (
	data: any,
	transaction?: Transaction,
) => {
	await db.promotions.create(data, { transaction });
	return db.productPromotions.create(data, { transaction });
};
export const updateProductPromotion = async (
	promotionId: number,
	data: any,
	transaction?: Transaction,
) => {
	const productPromotion = await db.productPromotions.findByPk(promotionId, {
		transaction,
	});
	if (!productPromotion) return null;

	await productPromotion.update(data, { transaction });
	return productPromotion;
};

export const deleteProductPromotion = async (
	id: number,
	transaction?: Transaction,
) => {
	return db.productPromotions.destroy({
		where: { promotionId: id },
		transaction,
	});
};
