import { db } from '../../loaders/database.loader';
import { Transaction } from 'sequelize';

export const getAllWishlists = async (transaction?: Transaction) => {
	return await db.wishlists.findAll({
		include: [{ model: db.products }],
		transaction,
	});
};

export const createWishlist = async (
	customerId: number,
	productId: number,
	transaction?: Transaction,
) => {
	const product = await db.products.findByPk(productId, { transaction });
	if (!product) {
		throw new Error('Product does not exist');
	}

	const data = { customerId, productId };
	const wish = await db.wishlists.create(data, { transaction });

	return await db.wishlists.findByPk(wish.id, {
		include: [{ model: db.products }],
		transaction,
	});
};

export const deleteWishlist = async (
	customerId: number,
	id: number,
	transaction?: Transaction,
) => {
	const wishlist = await db.wishlists.findOne({
		where: {
			id: id,
			customerId: customerId,
		},
		transaction,
	});
	if (!wishlist) throw new Error('wishlist not found');
	return await wishlist.destroy({ transaction });
};
