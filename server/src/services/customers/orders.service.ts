import { Warehouses } from 'src/models/warehouses.model';
import { db } from '../../loaders/database.loader';
import * as ordersItemService from '../../services/customers/order-items.service'
import { Op } from 'sequelize';

// Tao đơn hàng mới
export const createOrderFromCart = async (
    customerId: number ,
    warehouseId: number,
    shippingAddress: string,
    paymentMethod: string
) => {
    try {
        const cart = await db.carts.findOne({ where: { customerId } });
        if (!cart) throw new Error('Không tìm thấy giỏ hàng');

        const cartItems = await db.cartItems.findAll({ where: { cartId: cart.id } });
        if (cartItems.length === 0) throw new Error('Giỏ hàng trống');

        const variantIds = cartItems.map(item => item.variantId);
        const variants = await db.productVariants.findAll({ where: { id: variantIds } });

        const variantPriceMap = new Map<number, number>();
        const variantStockMap = new Map<number, number>();
        variants.forEach(v => {
            variantPriceMap.set(v.id, Number(v.price));
            variantStockMap.set(v.id, Number(v.stock));
        });

        // Kiểm tra tồn kho
        for (const item of cartItems) {
            const stock = variantStockMap.get(item.variantId) || 0;
            if (stock < item.quantity) {
                throw new Error(`Sản phẩm variantId ${item.variantId} không đủ hàng`);
            }
        }

        const totalAmount = cartItems.reduce((sum, item) => {
            const price = variantPriceMap.get(item.variantId) || 0;
            return sum + (price * item.quantity);
        }, 0);

        const orderData = {
            customerId,
            warehouseId: warehouseId,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            totalAmount,
        };
        const newOrder = await db.orders.create(orderData);

        const orderItemsData = cartItems.map(item => ({
            orderId: newOrder.id,
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtTime: variantPriceMap.get(item.variantId) || 0,
        }));
        await ordersItemService.createOrderItem(orderItemsData);

        // Trừ tồn kho
        for (const item of cartItems) {
            await db.productVariants.increment(
                { stock: -item.quantity },
                { where: { id: item.variantId } }
            );
        }

        await db.cartItems.destroy({ where: { cartId: cart.id } });
        await db.carts.destroy({ where: { id: cart.id } });

        const orderWithItems = await db.orders.findByPk(newOrder.id, {
            include: [{ model: db.orderItems }]
        });

        return orderWithItems;
    } catch (err) {
        throw err;
    }
};

// Cập nhật đơn hàng theo ID
export const updateOrderById = (id: string, orderData: any) =>{
    db.orders.update(orderData, { where: { id } });
    return db.orders.findByPk(id, {
        include: [{ model: db.orderItems }]
    });
}
    

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
