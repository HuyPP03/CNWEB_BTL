import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util'
import * as ordersService from '../../services/customers/orders.service'
import * as ordersItemService from '../../services/customers/order-items.service'
import { db } from '../../loaders/database.loader';

// Tạo đơn hàng mới từ giỏ hàng
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId = parseInt(req.params.customerId, 10);
        const {warehouseId, shippingAddress, paymentMethod} = req.body;
        const newOrder = await ordersService.createOrderFromCart(customerId, warehouseId, shippingAddress, paymentMethod);
        return res.status(201).json(new ResOk().formatResponse(newOrder, 'Tạo đơn hàng thành công từ giỏ hàng!'));
    } catch (error) {
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
// Lấy đơn hàng
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            id,
            customerId,
            status,
            startDate,
            endDate,
            minTotalAmount,
            maxTotalAmount,
            paymentMethod,
        } = req.query;

        const filters = {
            id: id ? Number(id) : undefined,
            customerId: customerId ? Number(customerId) : undefined,
            status: status as string,
            startDate: startDate as string,
            endDate: endDate as string,
            minTotalAmount: minTotalAmount ? Number(minTotalAmount) : undefined,
            maxTotalAmount: maxTotalAmount ? Number(maxTotalAmount) : undefined,
            paymentMethod: req.query.paymentMethod as string,
        };

        const orders = await ordersService.getOrders(filters);

        return res
            .status(200)
            .json(new ResOk().formatResponse(orders, 'Lấy danh sách đơn hàng thành công!'));
    } catch (error) {
        next(error);
    }
};