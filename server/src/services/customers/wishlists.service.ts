import { db } from "../../loaders/database.loader"
import { Transaction } from "sequelize";

export const createWishlist = async (customerId: number, data: any, transaction?: Transaction) => {
	const wishlist = {
		...data,
		customerId,
	};
	return await db.wishlists.create(wishlist, {transaction});
};

export const getAllWishlists = async (transaction?: Transaction) => {
  return await db.wishlists.findAll({transaction});
};

export const getWishlistsByProduct = async (productId: number, transaction?: Transaction) => {
  return await db.wishlists.findAll({ where: { productId } , transaction});
};

export const updateWishlist = async (id: number, data: any, transaction?: Transaction) => {
  const wishlist = await db.wishlists.findByPk(id, {transaction});
  if (!wishlist) throw new Error('wishlist not found');
  return await wishlist.update(data, transaction);
};

export const deleteWishlist = async (id: number, transaction?: Transaction) => {
  const wishlist = await db.wishlists.findByPk(id, {transaction});
  if (!wishlist) throw new Error('wishlist not found');
  return await wishlist.destroy({transaction});
};
