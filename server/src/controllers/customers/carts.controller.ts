import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as cartService from '../../services/customers/carts.service';
import * as cartItemService from '../../services/customers/cart-items.service';


// Lấy giỏ hàng và item theo customerId
export const getCartWithItems = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const customerId = parseInt(req.params.customerId);
		const cart = await cartService.getOrCreateCart(customerId);
		return res.status(200).json(new ResOk().formatResponse({ cart }));
	} catch (error) {
		next(error);
	}
};

// Thêm sản phẩm vào giỏ hàng 
export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cartId = parseInt(req.params.cartId);
		const { variantId, quantity } = req.body;
		const item = await cartItemService.addOrUpdateCartItem(cartId, variantId, quantity);
		return res.status(200).json(new ResOk().formatResponse(item));
	} catch (error) {
		next(error);
	}
};

// Cập nhật số lượng sản phẩm
export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cartItemId = parseInt(req.params.itemId);
		const { quantity } = req.body;
		const item = await cartItemService.updateCartItemQuantity(cartItemId, quantity);
		if (!item) return res.status(404).json({ message: 'Item not found' });
		return res.status(200).json(new ResOk().formatResponse(item));
	} catch (error) {
		next(error);
	}
};

// Xoá sản phẩm khỏi giỏ
export const removeItemFromCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cartItemId = parseInt(req.params.itemId);
		await cartItemService.removeCartItem(cartItemId);
		return res.status(200).json(new ResOk().formatResponse({ message: 'Item removed' }));
	} catch (error) {
		next(error);
	}
};

// Xoá toàn bộ sản phẩm khỏi giỏ hàng
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cartId = parseInt(req.params.cartId);
		const cart = await cartService.getOrCreateCart(cartId);
		if (!cart) return res.status(404).json({ message: 'Cart not found' });

		await cartItemService.clearCartItems(cartId);
		return res.status(200).json(new ResOk().formatResponse({ message: 'Cart cleared' }));
	} catch (error) {
		next(error);
	}
};