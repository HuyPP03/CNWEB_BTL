import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as ordersService from '../../services/customers/orders.service';
import * as cartsService from '../../services/customers/carts.service';
import { db } from '../../loaders/database.loader';

// Tạo đơn hàng mới từ giỏ hàng
export const createOrder = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const customerId = parseInt((req as any).user?.id);
		const cart = await cartsService.getOrCreateCart(
			customerId,
			transaction,
		);
		const { itemIds, warehouseId } = req.body;
		const newOrder = await ordersService.createOrderFromCart(
			cart.id,
			customerId,
			itemIds,
			warehouseId,
			transaction,
		);

		await transaction.commit();
		return res
			.status(201)
			.json(
				new ResOk().formatResponse(
					newOrder,
					'Tạo đơn hàng thành công từ giỏ hàng!',
				),
			);
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const confirmOrder = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const id = parseInt(req.params.id, 10);
		const orderData = req.body;
		const customerId = parseInt((req as any).user?.id);
		const order: any = await ordersService.getOrderById(id, transaction);
		if (customerId !== order.customerId) {
			return res
				.status(403)
				.json(
					new ResOk().formatResponse(
						null,
						'Bạn không có quyền cập nhật đơn hàng này!',
					),
				);
		}
		const confirmOrder = await ordersService.confirmOrder(
			id,
			orderData,
			transaction,
		);

		await transaction.commit();
		return res.status(200).json(new ResOk().formatResponse(confirmOrder));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

// Cập nhật đơn hàng theo ID
export const updateOrderById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const id = parseInt(req.params.id, 10);
		const orderData = req.body;
		const updatedOrder = await ordersService.updateOrderById(
			id,
			orderData,
			transaction,
		);

		await transaction.commit();
		return res.status(200).json(new ResOk().formatResponse(updatedOrder));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

// Xóa đơn hàng theo ID
export const deleteOrderById = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const id = parseInt(req.params.id, 10);
		const customerId = parseInt((req as any).user?.id);
		const order: any = await ordersService.getOrderById(id);
		if (!order || customerId !== order.customerId) {
			return res
				.status(403)
				.json(
					new ResOk().formatResponse(
						null,
						'Bạn không có quyền xóa đơn hàng này!',
					),
				);
		}
		await ordersService.deleteOrderById(id, transaction);

		await transaction.commit();
		return res
			.status(200)
			.json(new ResOk().formatResponse(null, 'Xóa đơn hàng thành công!'));
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};

// Lấy đơn hàng
export const getOrders = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const transaction = await db.sequelize.transaction();
	try {
		const isAdmin = (req as any).isAdmin;
		const userId = (req as any).user.id;
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
			customerId: isAdmin ? Number(customerId) : userId,
			status: status as string,
			startDate: startDate as string,
			endDate: endDate as string,
			minTotalAmount: minTotalAmount ? Number(minTotalAmount) : undefined,
			maxTotalAmount: maxTotalAmount ? Number(maxTotalAmount) : undefined,
			paymentMethod: req.query.paymentMethod as string,
		};

		const orders = await ordersService.getOrders(filters, transaction);
		await transaction.commit();
		return res
			.status(200)
			.json(
				new ResOk().formatResponse(
					orders,
					'Lấy danh sách đơn hàng thành công!',
				),
			);
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};
