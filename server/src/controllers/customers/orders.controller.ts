import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util'
import * as ordersService from '../../services/customers/orders.service'
import * as ordersItemService from '../../services/customers/order-items.service'
import { db } from '../../loaders/database.loader';

// Tạo đơn hàng mới từ giỏ hàng
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
//    const t = await db.sequelize.transaction();
    try { 
        const {customerId, warehouseId, shippingAddress, paymentMethod } = req.body;

//        const cart = await db.carts.findOne({ where: { customerId }, transaction: t });
        const cart = await db.carts.findOne({ where: { customerId } });

        if (!cart) throw new Error('Không tìm thấy giỏ hàng');

//        const cartItems = await db.cartItems.findAll({ where: { cartId: cart.id }, transaction: t });
        const cartItems = await db.cartItems.findAll({ where: { cartId: cart.id } });
        if (cartItems.length === 0) throw new Error('Giỏ hàng trống');

        // Lấy thông tin các variantId trong cart
        const variantIds = cartItems.map(item => item.variantId);
        const variants = await db.productVariants.findAll({
            where: { id: variantIds },
//            transaction: t
        });

        // Map variantId -> price
        const variantPriceMap = new Map<number, number>();
        variants.forEach(v => {
            variantPriceMap.set(v.id, Number(v.price));
        });

        // Tính tổng tiền từ variant price
        const totalAmount = cartItems.reduce((sum, item) => {
            const price = variantPriceMap.get(item.variantId) || 0;
            return sum + (price * item.quantity);
        }, 0);

        const orderData = {
            customerId,
            warehouseId,
            shippingAddress,
            paymentMethod,
            totalAmount,
        };
//        const newOrder = await db.orders.create(orderData as any, { transaction: t });
        const newOrder = await db.orders.create(orderData as any);

        const orderItemsData = cartItems.map(item => ({
            orderId: newOrder.id,
            variantId: item.variantId, 
            quantity: item.quantity,
            priceAtTime: variantPriceMap.get(item.variantId) || 0,
        }));        

        await ordersItemService.createOrderItem(orderItemsData);

        // await db.cartItems.destroy({ where: { cartId: cart.id }, transaction: t });
        // await db.carts.destroy({ where: { id: cart.id }, transaction: t });
        await db.cartItems.destroy({ where: { cartId: cart.id } });
        await db.carts.destroy({ where: { id: cart.id } });

//        await t.commit();
        return res.status(201).json(new ResOk().formatResponse(newOrder, 'Tạo đơn hàng thành công từ giỏ hàng!'));
    } catch (error) {
//        await t.rollback();
        next(error);
    }
};



// Cập nhật đơn hàng theo ID
export const updateOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const orderData = req.body;
        const updatedOrder = await ordersService.updateOrderById(id, orderData);
        return res.status(200).json(new ResOk().formatResponse(updatedOrder));
    } catch (error) {
        next(error);
    }
}

// Xóa đơn hàng theo ID
export const deleteOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await ordersService.deleteOrderById(id);
        return res.status(200).json(new ResOk().formatResponse(null, 'Xóa đơn hàng thành công!'));
    } catch (error) {
        next(error);
    }
}

// Lấy tất cả đơn hàng
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await ordersService.getAllOrders();
        return res.status(200).json(new ResOk().formatResponse(orders, 'Lấy tất cả đơn hàng thành công!'));
    } catch (error) {
        next(error);
    }
}

// Lấy đơn hàng theo ID
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const order = await ordersService.getOrderById(id);
        return res.status(200).json(new ResOk().formatResponse(order, 'Lấy đơn hàng theo ID thành công!'));
    } catch (error) {
        next(error);
    }
}

// Lấy đơn hàng theo customerId
export const getOrdersByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customerId } = req.params;
        const orders = await ordersService.getOrdersByCustomerId(customerId);
        return res.status(200).json(new ResOk().formatResponse(orders, 'Lấy đơn hàng theo customerId thành công!'));
    } catch (error) {
        next(error);
    }
}

// Lấy đơn hàng theo trạng thái
export const getOrdersByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.params;
        const orders = await ordersService.getOrdersByStatus(status);
        return res.status(200).json(new ResOk().formatResponse(orders, 'Lấy đơn hàng theo trạng thái thành công!'));
    } catch (error) {
        next(error);
    }
}

// Lấy danh sách order items theo orderId
export const getOrderItemsByOrderId = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    try {
        const orderItems = await ordersService.getOrderItemsByOrderId(orderId);

        if (!orderItems || orderItems.length === 0) {
            return res.status(404).json(new ResOk().formatResponse([], 'Không tìm thấy order items.'));
        }

        return res.status(200).json(new ResOk().formatResponse(orderItems, 'Lấy danh sách order items thành công.'));
    } catch (error) {
        next(error);
    }
};