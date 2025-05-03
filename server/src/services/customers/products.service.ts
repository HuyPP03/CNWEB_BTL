import { Op } from 'sequelize';
import { db } from '../../loaders/database.loader';

export const filterProducts = async (filters: any) => {
	const where: any = {};
	const include: any[] = [];

	if (filters.name) {
		where.name = { [Op.like]: `%${filters.name}%` };
	}
	if (filters.brandId) {
		where.brandId = filters.brandId;
	}
	if (filters.categoryId) {
		where.categoryId = filters.categoryId;
	}
	if (filters.priceRange.min || filters.priceRange.max) {
		where.price = {};
		if (filters.priceRange.min) where.price[Op.gte] = filters.priceRange.min;
		if (filters.priceRange.max) where.price[Op.lte] = filters.priceRange.max;
	}

	if (filters.include?.includes('brand')) {
		include.push({ model: db.brands });
	}
	if (filters.include?.includes('category')) {
		include.push({ model: db.categories });
	}

	const products = await db.products.findAll({
		where,
		include
	});
	return products;
};
