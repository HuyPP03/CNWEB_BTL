import { Op , Transaction } from 'sequelize';
import { db } from '../../loaders/database.loader';

// Lấy tất cả biến thể sản phẩm
export const getVariants = async (filters: any) => {
    const where: any = {};
    const include: any[] = [
        { model: db.productImages },
        { model: db.variantAttributes, include: [{ model: db.attributeValues }] },

    ];

    // Điều kiện lọc theo id biến thể sản phẩm
    if (filters.id) {
        where.id = filters.id;
    }
    
    // Điều kiện lọc theo id sản phẩm
    if (filters.productId) {
        where.productId = filters.productId;
    }

    // Điều kiện lọc nếu còn hàng
    if (filters.stock !== undefined) {
        where.stock = { [Op.gte]: filters.stock };
    }    

    // Điều kiện lọc theo khoảng giá
	if (filters.priceRange.min || filters.priceRange.max) {
		where.price = {};
		if (filters.priceRange.min) where.price[Op.gte] = filters.priceRange.min;
		if (filters.priceRange.max) where.price[Op.lte] = filters.priceRange.max;
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
