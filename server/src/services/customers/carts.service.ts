import { db } from '../../loaders/database.loader';

export const getOrCreateCart = async (customerId: number) => {
	if (!customerId) throw new Error('Customer ID is required');

	// Tìm giỏ hàng dựa trên customerId
	let cart = await db.carts.findOne({
		where: { customerId },
	});

	if (!cart) {
		// Nếu không tìm thấy giỏ hàng, tạo mới
		cart = await db.carts.create({ customerId });
	}

	return {cart,
		include:
			{
				model: db.cartItems,
				include: [
					{
						model: db.productVariants,
						include: [{ model: db.products }],
					},
				],
			},
	};
};

export const deleteCart = (cartId: number) => {
	// Xóa giỏ hàng theo cartId
	return db.carts.destroy({ where: { id: cartId } });
};
