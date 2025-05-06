import { Op , Transaction } from 'sequelize';
import { db } from '../../loaders/database.loader';

// Lấy tất cả biến thể sản phẩm
export const getVariants = async (filters: any) => {
    const where: any = {};
    const include: any[] = [
        { model: db.productImages },
    ];

    // Điều kiện lọc theo id biến thể sản phẩm
    if (filters.id) {
        where.id = filters.id;
    }
    
    // Điều kiện lọc theo id sản phẩm
    if (filters.productId) {
        where.productId = filters.productId;
    }

    // Điều kiện lọc theo brandId
    if (filters.brandId) {
        where.brandId = filters.brandId;
    }

    // Điều kiện lọc theo categoryId
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }

    // Điều kiện lọc nếu còn hàng
    if (filters.stock) {
        where.stock >= filters.stock;
    }

    // Điều kiện lọc theo khoảng giá
    if (filters.priceRange.min || filters.priceRange.max) {
        where.price = {};
        if (filters.priceRange.min) where.price[Op.gte] = filters.priceRange.min;
        if (filters.priceRange.max) where.price[Op.lte] = filters.priceRange.max;
    }

    // Thêm mối quan hệ với bảng brands nếu cần
    if (filters.include?.includes('brand')) {
        include.push({ model: db.brands });
    }

    // Thêm mối quan hệ với bảng categories nếu cần
    if (filters.include?.includes('category')) {
        include.push({ model: db.categories });
    }

    // Lấy dữ liệu từ cơ sở dữ liệu với phân trang
    const productVariants = await db.productVariants.findAll({
        where,
        include,
        limit: filters.limit,   // Số lượng sản phẩm mỗi trang
        offset: filters.offset  // Dịch chuyển dữ liệu, tính từ trang hiện tại
    });
    
    return productVariants;
};

// Tạo biến thể sản phẩm mới
export const createVariant = (data: any, transaction?: Transaction) => {
    return db.productVariants.create(data, { transaction });
};

// Cập nhật biến thể sản phẩm
export const updateVariant = async (
    id: string,
    data: any,
    transaction?: Transaction
) => {
    const variant = await db.productVariants.findByPk(id, { transaction });
    if (!variant) return null;

    await variant.update(data, { transaction });
    return variant;
};

// Xóa biến thể sản phẩm
export const deleteVariant = async (
    id: string,
    transaction?: Transaction
) => {
    return db.productVariants.destroy({ where: { id }, transaction });
};

export const addVariantAttributes = (data: any, transaction?: Transaction) => {
    return db.variantAttributes.create(data, { transaction });
}

export const updateAttribute = async (
    id: number,
    data: any,
    transaction?: Transaction
) => {
    const attr = await db.variantAttributes.findByPk(id);
    if (!attr) {
        throw new Error(`Attribute with id ${id} not found`);
    }
    return attr.update(data, { transaction });
};