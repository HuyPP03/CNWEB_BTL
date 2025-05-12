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
	data: any,
	transaction?: Transaction,
) => {
	const wishlist = {
		...data,
		customerId,
	};
	const wish = await db.wishlists.create(wishlist, { transaction });
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
