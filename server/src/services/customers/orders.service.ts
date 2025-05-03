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
export const getAllOrders = () => db.orders.findAll();

// Lấy đơn hàng theo ID
export const getOrderById = (id: string) => db.orders.findByPk(id);

// Lấy đơn hàng theo customerId
export const getOrdersByCustomerId = (customerId: string) =>
    db.orders.findAll({
        where: { customerId },
    });

// Lấy đơn hàng theo trạng thái
export const getOrdersByStatus = (status: string) =>    
    db.orders.findAll({
        where: { status },
    });

// Lấy các order-items theo orderId
export const getOrderItemsByOrderId = async (orderId: string) => {
    return db.orderItems.findAll({
        where: { orderId },
        include: [
            {
                model: db.productVariants,
                as: 'productVariant',
                attributes: ['id', 'sku', 'price'], // thêm các thuộc tính cần thiết
            },
        ],
    });
};