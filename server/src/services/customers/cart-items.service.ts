import { db } from '../../loaders/database.loader';

export const getCartItemsByCartId = (cartId: number) => {
	return db.cartItems.findAll({ where: { cartId } });
};

export const addOrUpdateCartItem = async (cartId: number, variantId: number, quantity: number) => {
	const existingItem = await db.cartItems.findOne({ where: { cartId, variantId } });

	if (existingItem) {
		existingItem.quantity += quantity;
		return existingItem.save();
	}

	return db.cartItems.create({ cartId, variantId, quantity });
};

export const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
	const item = await db.cartItems.findByPk(cartItemId);
	if (!item) return null;

	item.quantity = quantity;
	return item.save();
};

export const removeCartItem = (cartItemId: number) => {
	return db.cartItems.destroy({ where: { id: cartItemId } });
};

export const clearCartItems = (cartId: number) => {
	return db.cartItems.destroy({ where: { cartId } });
};
