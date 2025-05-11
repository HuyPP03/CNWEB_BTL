import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as wishlistService from '../../services/customers/wishlists.service';
import { db } from '../../loaders/database.loader'

export const createWishlist = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const customerId = (req as any).user.id;
        const wishlist = await wishlistService.createWishlist(customerId, req.body);
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(wishlist));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const getAllWishlists = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const wishlists = await wishlistService.getAllWishlists(transaction);
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(wishlists));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const getWishlistsByProduct = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { productId } = req.params;
        const wishlists = await wishlistService.getWishlistsByProduct(Number(productId));
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(wishlists));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const updateWishlist = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const wishlist = await wishlistService.updateWishlist(Number(id), req.body);
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(wishlist));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const deleteWishlist = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        await wishlistService.deleteWishlist(Number(id));
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse({}));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};
