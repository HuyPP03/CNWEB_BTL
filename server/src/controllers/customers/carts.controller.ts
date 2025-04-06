import { Request, Response, NextFunction } from 'express';
import { db } from '../../loaders/database.loader';
import { ResOk } from '../../utility/response.util';

// Thêm sản phẩm vào giỏ hàng - POST /api/cart
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { customerId, sessionId, variantId, quantity } = req.body;

		let cart = await db.carts.findOne({ where: { customerId, sessionId } });

		if (!cart) {
			cart = await db.carts.create({ customerId, sessionId });
		}

		let cartItem = await db.cartItems.findOne({ where: { cartId: cart.id, variantId } });

		if (cartItem) {
			cartItem.quantity += quantity;
			await cartItem.save();
		} else {
			cartItem = await db.cartItems.create({ cartId: cart.id, variantId, quantity });
		}

		return res.status(200).json(new ResOk().formatResponse(cartItem));
	} catch (error) {
		next(error);
	}
};

// Lấy giỏ hàng của khách hàng - GET /api/cart/:customerId
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { customerId } = req.params;
		const cart = await db.carts.findOne({
			where: { customerId },
			include: [
				{
					model: db.cartItems,
					include: [db.products],
				},
			],
		});
		return res.status(200).json(new ResOk().formatResponse(cart));
	} catch (error) {
		next(error);
	}
};

// Cập nhật số lượng sản phẩm - PUT /api/cart/item/:cartItemId
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { cartItemId } = req.params;
		const { quantity } = req.body;

		const cartItem = await db.cartItems.findByPk(cartItemId);
		if (!cartItem) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' });

		cartItem.quantity = quantity;
		await cartItem.save();

		return res.status(200).json(new ResOk().formatResponse(cartItem));
	} catch (error) {
		next(error);
	}
};

// Xóa một sản phẩm khỏi giỏ - DELETE /api/cart/item/:cartItemId
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { cartItemId } = req.params;
		await db.cartItems.destroy({ where: { id: cartItemId } });

		return res.status(200).json(new ResOk().formatResponse({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' }));
	} catch (error) {
		next(error);
	}
};

// Xóa toàn bộ giỏ hàng - DELETE /api/cart/:customerId
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { customerId } = req.params;
		const cart = await db.carts.findOne({ where: { customerId } });

		if (cart) {
			await db.cartItems.destroy({ where: { cartId: cart.id } });
			await cart.destroy();
		}

		return res.status(200).json(new ResOk().formatResponse({ message: 'Đã xóa toàn bộ giỏ hàng' }));
	} catch (error) {
		next(error);
	}
};
