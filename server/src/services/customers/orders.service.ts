import { db } from '../../loaders/database.loader';
import * as ordersItemService from '../../services/customers/order-items.service';
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

		const variantMap = new Map<
			number,
			{ price: number; discount: number }
		>();
		const variantStockMap = new Map<number, number>();

		variants.forEach((v) => {
			variantMap.set(v.id, {
				price: Number(v.price),
				discount: Number(v.discountPrice) || 0, // fallback nếu discount không có
			});
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
			const variant = variantMap.get(item.variantId) || {
				price: 0,
				discount: 0,
			};
			const effectivePrice = Math.max(
				0,
				variant.price - variant.discount,
			);
			return sum + effectivePrice * item.quantity;
		}, 0);

		const orderData = {
			customerId,
			warehouseId: warehouseId,
			shippingAddress: '',
			totalAmount,
		};
		const newOrder = await db.orders.create(orderData, { transaction });

		const orderItemsData = cartItems.map((item) => {
			const variant = variantMap.get(item.variantId) || {
				price: 0,
				discount: 0,
			};
			const effectivePrice = Math.max(
				0,
				variant.price - variant.discount,
			);
			return {
				orderId: newOrder.id,
				variantId: item.variantId,
				quantity: item.quantity,
				priceAtTime: effectivePrice,
			};
		});

		await ordersItemService.createOrderItem(orderItemsData, transaction);

		// Trừ tồn kho
		// for (const item of cartItems) {
		// 	await db.productVariants.increment(
		// 		{ stock: -item.quantity },
		// 		{ where: { id: item.variantId }, transaction },
		// 	);
		// }

		for (const item of cartItems) {
			await db.cartItems.destroy({ where: { id: item.id }, transaction });
		}
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
	const order = await db.orders.findByPk(id, { transaction });

	if (!order) throw new Error('Không tìm thấy đơn hàng');
	if (order.status !== 'draft') {
		throw new Error(
			`Bạn không thể xác nhận đơn hàng này vì trạng thái của nó là ${order.status}`,
		);
	}

	const shippingData = {
		orderId: id,
		name: orderData.name,
		email: orderData.email,
		phone: orderData.phone,
		shippingAddress: orderData.shippingAddress,
		shippingProvider: '',
	};

	await db.shipping.create(shippingData, { transaction });

	const paymentData = {
		orderId: id,
		amount: (order as any)?.totalAmount,
		paymentMethod: orderData.paymentMethod,
	};

	await db.payments.create(paymentData, { transaction });

	if (orderData.paymentMethod?.toLowerCase() === 'cod') {
		await order?.update({ status: 'pending' }, { transaction });
		await changeStock(id, transaction);
	}

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

export const cancelOrder = async (
	id: number,
	customerId: number,
	transaction?: Transaction,
) => {
	const order = await db.orders.findOne({
		where: [{ id: id, customerId }],
		include: [
			{ model: db.orderItems },
			{ model: db.payments },
			{ model: db.shipping },
		],
		transaction,
	});
	if (!order) throw new Error('Không tìm thấy đơn hàng');

	await order.update({ status: 'cancelled' }, { transaction });
	await changeStock(id, transaction);

	return order;
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

	if (
		orderData.status === 'draft' ||
		orderData.status === 'delivered' ||
		orderData.status === 'cancelled'
	) {
		throw new Error('Bạn không thể thay đổi trạng thái của đơn hàng này.');
	}

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

	await changeStock(id, transaction);

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
		where.status =
			filters.status !== 'draft' ? filters.status : { [Op.not]: 'draft' };
	} else {
		// Nếu không truyền filters.status thì mặc định loại 'draft'
		where.status = { [Op.not]: 'draft' };
	}

	// Điều kiện lọc theo khoảng thời gian tạo đơn hàng
	if (filters.startDate && filters.endDate) {
		where.createdAt = {
			[Op.between]: [
				new Date(filters.startDate),
				new Date(
					new Date(filters.endDate).setDate(
						new Date(filters.endDate).getDate() + 1,
					),
				),
			],
		};
	} else if (filters.startDate) {
		where.createdAt = {
			[Op.gte]: new Date(filters.startDate),
		};
	} else if (filters.endDate) {
		where.createdAt = {
			[Op.lte]: new Date(
				new Date(filters.endDate).setDate(
					new Date(filters.endDate).getDate() + 1,
				),
			),
		};
	}

	// Điều kiện lọc theo phương thức thanh toán
	if (filters.paymentMethod) {
		where.paymentMethod = filters.paymentMethod;
	}

	// Truy vấn đơn hàng
	const [rows, count] = await Promise.all([
		db.orders.findAll({
			where,
			include,
			order: [['createdAt', 'DESC']],
			limit: filters.limit,
			offset: filters.offset,
			transaction,
		}),
		db.orders.count({
			where,
			transaction,
		}),
	]);

	return [rows, count];
};

export const getOrderById = async (id: number, transaction?: Transaction) => {
	const order = await db.orders.findByPk(id, { transaction });
	return order;
};

export const changeStock = async (id: number, transaction?: Transaction) => {
	const order = await db.orders.findByPk(id, {
		include: [{ model: db.orderItems }],
		transaction,
	});
	if (!order) throw new Error('Không tìm thấy đơn hàng');

	if (order.status !== 'pending' && order.status !== 'cancelled') return;

	const orderitems = await db.orderItems.findAll({
		where: [
			{
				orderId: id,
			},
		],
		transaction,
	});

	for (const item of orderitems) {
		const product = await db.productVariants.findByPk(item.variantId, {
			transaction,
		});

		if (!product) continue;

		if (order.status === 'pending') {
			// Trừ số lượng
			if (product.stock < item.quantity) {
				throw new Error(`Sản phẩm ${product.name} không đủ hàng`);
			}
			await product.update(
				{ stock: product.stock - item.quantity },
				{ transaction },
			);
		} else if (order.status === 'cancelled') {
			// Cộng lại số lượng
			await product.update(
				{ stock: product.stock + item.quantity },
				{ transaction },
			);
		}
	}
};
