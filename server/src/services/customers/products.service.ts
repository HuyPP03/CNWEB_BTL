import { Op } from 'sequelize';
import { db } from '../../loaders/database.loader';

// Lấy tất cả sản phẩm
export const getAllProducts = () => db.products.findAll();

// Lấy sản phẩm theo ID
export const getProductById = (id: string) => db.products.findByPk(id);

// Lấy sản phẩm theo tên gần đúng (LIKE)
export const getProductsByName = (name: string) =>
	db.products.findAll({
		where: {
			name: {
				[Op.like]: `%${name}%`,
			},
		},
	});

// Lấy sản phẩm theo brandId
export const getProductsByBrand = (brandId: string) =>
	db.products.findAll({
		where: { brandId },
	});

// Lấy sản phẩm theo categoryId
export const getProductsByCategory = (categoryId: string) =>
	db.products.findAll({
		where: { categoryId },
	});

// Lấy sản phẩm theo khoảng giá
export const getProductsByPriceRange = (min: number, max: number) =>
	db.products.findAll({
		where: {
			basePrice: {
				[Op.between]: [min, max],
			},
		},
	});

// Tìm kiếm sản phẩm nâng cao (lọc theo nhiều điều kiện)
export const filterProducts = async (filters: {
	name?: string;
	brandId?: string;
	categoryId?: string;
	minPrice?: string;
	maxPrice?: string;
}) => {
	const conditions: any = {};

	if (filters.name) {
		conditions.name = { [Op.like]: `%${filters.name}%` };
	}

	if (filters.brandId) {
		conditions.brandId = filters.brandId;
	}

	if (filters.categoryId) {
		conditions.categoryId = filters.categoryId;
	}

	if (filters.minPrice || filters.maxPrice) {
		conditions.basePrice = {};
		if (filters.minPrice) {
			conditions.basePrice[Op.gte] = parseFloat(filters.minPrice);
		}
		if (filters.maxPrice) {
			conditions.basePrice[Op.lte] = parseFloat(filters.maxPrice);
		}
	}

	return db.products.findAll({ where: conditions });
};
