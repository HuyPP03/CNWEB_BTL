import { clear } from 'console';
import { db } from '../../loaders/database.loader';
import * as ordersItemService from '../../services/customers/order-items.service';
import * as paymentService from '../customers/payments.service';
import * as shippingService from '../customers/shippings.service';
import { Op, Transaction } from 'sequelize';

// Tao đơn hàng mới
export const createOrderFromCart = async (
	cartId: number,
	customerId: number,
	itemIds: number[],
	warehouseId?: number,
	transaction?: Transaction,
) => {
	try {
		const cart = await db.carts.findOne({
			where: { id: cartId },
			transaction,
		});
		if (!cart || cart.customerId !== customerId)
			throw new Error('Không tìm thấy giỏ hàng');

		const cartItems = await db.cartItems.findAll({
			where: {
				id: itemIds, // danh sách cartItems có id nằm trong itemIds
				cartId, // đúng cartId
			},
			transaction,
		});
		if (cartItems.length === 0) throw new Error('Giỏ hàng trống');

		const variantIds = cartItems.map((item) => item.variantId);
		const variants = await db.productVariants.findAll({
			where: { id: variantIds },
			transaction,
		});

		const variantPriceMap = new Map<number, number>();
		const variantStockMap = new Map<number, number>();
		variants.forEach((v) => {
			variantPriceMap.set(v.id, Number(v.price));
			variantStockMap.set(v.id, Number(v.stock));
		});

		// Kiểm tra tồn kho
		for (const item of cartItems) {
			const stock = variantStockMap.get(item.variantId) || 0;
			if (stock < item.quantity) {
				throw new Error(
					`Sản phẩm variantId ${item.variantId} không đủ hàng`,
				);
			}
		}

		const totalAmount = cartItems.reduce((sum, item) => {
			const price = variantPriceMap.get(item.variantId) || 0;
			return sum + price * item.quantity;
		}, 0);

		const orderData = {
			customerId,
			warehouseId: warehouseId,
			shippingAddress: '',
			totalAmount,
		};
		const newOrder = await db.orders.create(orderData, { transaction });

		const orderItemsData = cartItems.map((item) => ({
			orderId: newOrder.id,
			variantId: item.variantId,
			quantity: item.quantity,
			priceAtTime: variantPriceMap.get(item.variantId) || 0,
		}));
		await ordersItemService.createOrderItem(orderItemsData, transaction);

		// Trừ tồn kho
		for (const item of cartItems) {
			await db.productVariants.increment(
				{ stock: -item.quantity },
				{ where: { id: item.variantId }, transaction },
			);
		}

		// for (const item of cartItems) {
		//     await db.cartItems.destroy({ where: { id: item.id } , transaction });
		// }
		// await db.carts.destroy({ where: { id: cart.id } });

		const orderWithItems = await db.orders.findByPk(newOrder.id, {
			include: [
				{ model: db.orderItems },
				{ model: db.payments },
				{ model: db.shipping },
			],
			transaction,
		});

		return orderWithItems;
	} catch (err) {
		throw err;
	}
};

export const confirmOrder = async (
	id: number,
	orderData: any,
	transaction?: Transaction,
) => {
	const shippingData = {
		orderId: id,
		name: orderData.name,
		email: orderData.email,
		phone: orderData.phone,
		shippingAddress: orderData.shippingAddress,
		shippingProvider: '',
	};

	await db.shipping.create(shippingData, { transaction });

	const order = await db.orders.findByPk(id, { transaction });

	const paymentData = {
		orderId: id,
		amount: (order as any)?.totalAmount,
		paymentMethod: orderData.paymentMethod,
	};

	await db.payments.create(paymentData, { transaction });

	const resOrder = await db.orders.findByPk(id, {
		include: [
			{ model: db.orderItems, include: [{ model: db.productVariants }] },
			{ model: db.payments },
			{ model: db.shipping },
		],
		transaction,
	});

	return resOrder;
};

// Cập nhật đơn hàng theo ID
export const updateOrderById = async (
	id: number,
	orderData: any,
	transaction?: Transaction,
) => {
	const allowedStatusFlow = [
		'draft',
		'pending',
		'processing',
		'shipped',
		'delivered',
		'cancelled',
	];

	// Lấy order hiện tại
	const order = await db.orders.findByPk(id, { transaction });
	if (!order) throw new Error('Order not found');

	const currentStatusIndex = allowedStatusFlow.indexOf(order.status);
	const newStatusIndex = allowedStatusFlow.indexOf(orderData.status);

	if (newStatusIndex === -1) {
		throw new Error(`Invalid status: ${orderData.status}`);
	}

	if (newStatusIndex < currentStatusIndex) {
		throw new Error(
			`Cannot change status from '${order.status}' to '${orderData.status}'`,
		);
	}

	// Chỉ cập nhật status
	await db.orders.update(
		{ status: orderData.status },
		{ where: { id }, transaction },
	);

	const resOrder = await db.orders.findByPk(id, {
		include: [
			{ model: db.orderItems, include: [{ model: db.productVariants }] },
			{ model: db.payments },
			{ model: db.shipping },
		],
		transaction,
	});

	return resOrder;
};

// Xóa đơn hàng theo ID
export const deleteOrderById = async (
	id: number,
	transaction?: Transaction,
) => {
	await db.shipping.destroy({ where: { orderId: id }, transaction });
	await db.payments.destroy({ where: { orderId: id }, transaction });
	await db.orderItems.destroy({ where: { orderId: id }, transaction });
	return await db.orders.destroy({ where: { id }, transaction });
};

// Lấy tất cả đơn hàng
export const getOrders = async (filters: any, transaction?: Transaction) => {
	const where: any = {};
	const include: any[] = [
		{ model: db.orderItems, include: [{ model: db.productVariants }] },
		{ model: db.payments },
		{ model: db.shipping },
	];

	// Điều kiện lọc theo id sản phẩm
	if (filters.id) {
		where.id = filters.id;
	}

	// Điều kiện lọc theo id khách hàng
	if (filters.customerId) {
		where.customerId = filters.customerId;
	}

	// Điều kiện lọc theo giá tiền
	if (filters.minTotalAmount || filters.maxTotalAmount) {
		where.totalAmount = {};
		if (filters.minTotalAmount) {
			where.totalAmount[Op.gte] = filters.minTotalAmount;
		}
		if (filters.maxTotalAmount) {
			where.totalAmount[Op.lte] = filters.maxTotalAmount;
		}
	}

	// Điều kiện lọc theo trạng thái đơn hàng
	if (filters.status) {
		where.status = filters.status;
	}

	// Điều kiện lọc theo khoảng thời gian tạo đơn hàng
	if (filters.startDate && filters.endDate) {
		where.createdAt = {
			[Op.between]: [
				new Date(filters.startDate),
				new Date(filters.endDate),
			],
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
		transaction,
	});

	return orders;
};

export const getOrderById = async (id: number, transaction?: Transaction) => {
	const order = await db.orders.findByPk(id, { transaction });
	return order;
};
