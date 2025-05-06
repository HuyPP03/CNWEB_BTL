import { db } from '../../loaders/database.loader';
import { Op } from 'sequelize';

// Tao đơn hàng mới
export const createOrder = (orderData: any) => db.orders.create(orderData);

// Cập nhật đơn hàng theo ID
export const updateOrderById = (id: string, orderData: any) =>
    db.orders.update(orderData, { where: { id } });

// Xóa đơn hàng theo ID
export const deleteOrderById = (id: string) => db.orders.destroy({ where: { id } });

// Lấy tất cả đơn hàng
export const getOrders = async (filters: any) => {
    const where: any = {};
	const include: any[] = [
		{ model: db.orderItems,
            include: [{ model: db.productVariants }]  },
	];

	// Điều kiện lọc theo id sản phẩm
	if (filters.id) {
		where.id = filters.id;
	}
	
	// Điều kiện lọc theo id khách hàng
	if (filters.customerId) {
		where.customerId = filters.customerId;
	}

    // Điều kiện lọc theo trạng thái đơn hàng
    if (filters.status) {
        where.status = filters.status;
    }

    // Điều kiện lọc theo khoảng thời gian tạo đơn hàng
    if (filters.startDate && filters.endDate) {
        where.createdAt = {
            [Op.between]: [new Date(filters.startDate), new Date(filters.endDate)],
        };
    } else if (filters.startDate) {
        where.createdAt = {
            [Op.gte]: new Date(filters.startDate),
        };
    } else if (filters.endDate) {
        where.createdAt = {
            [Op.lte]: new Date(filters.endDate),
        };
    }

    // Điều kiện lọc theo phương thức thanh toán
    if (filters.paymentMethod) {
        where.paymentMethod = filters.paymentMethod;
    }

	// Truy vấn đơn hàng
    const orders = await db.orders.findAll({
        where,
        include,
        order: [['createdAt', 'DESC']],
    });
	
	return orders;
}
