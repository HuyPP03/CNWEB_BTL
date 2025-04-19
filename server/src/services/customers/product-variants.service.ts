import { Op } from 'sequelize';
import { db } from '../../loaders/database.loader';

// Lấy tất cả biến thể sản phẩm
export const getAllVariants = () => db.productVariants.findAll();

// Lấy biến thể sản phẩm theo ID
export const getVariantById = (id: string) => db.productVariants.findByPk(id);

// Lấy biến thể sản phẩm theo tên gần đúng (LIKE)
export const getVariantsByName = (name: string) =>
    db.products.findAll({
        where: {
            name: {
                [Op.like]: `%${name}%`,
            },
        },
    });

// Lấy biến thể sản phẩm theo productId (sản phẩm mẹ)
export const getVariantsByProductId = (productId: string) =>
    db.productVariants.findAll({
        where: { productId },
    });

// Lấy biến thể sản phẩm theo brandId
export const getVariantsByBrand = (brandId: string) =>
    db.productVariants.findAll({
        include: [
            {
                model: db.products,
                where: { brandId },
                required: true,
            },
        ],
    });

// Lấy biến thể sản phẩm theo categoryId
export const getVariantsByCategory = (categoryId: string) =>
    db.productVariants.findAll({
        include: [
            {
                model: db.products,
                where: { categoryId },
                required: true,
            },
        ],
    });

// Lấy biến thể sản phẩm theo khoảng giá
export const getVariantsByPriceRange = (min: number, max: number) =>
    db.productVariants.findAll({
        where: {
            price: {
                [Op.between]: [min, max],
            },
        },
    });

// Tìm kiếm biến thể sản phẩm nâng cao (lọc theo nhiều điều kiện)
export const filterVariants = async (filters: {
    name?: string;
    brandId?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    productId?: string;
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

    if (filters.productId) {
        conditions.productId = filters.productId;
    }

    if (filters.minPrice || filters.maxPrice) {
        conditions.price = {};
        if (filters.minPrice) {
            conditions.price[Op.gte] = parseFloat(filters.minPrice);
        }
        if (filters.maxPrice) {
            conditions.price[Op.lte] = parseFloat(filters.maxPrice);
        }
    }

    return db.productVariants.findAll({ where: conditions });
};
