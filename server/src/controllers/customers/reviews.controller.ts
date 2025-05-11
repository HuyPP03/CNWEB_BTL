import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as reviewService from '../../services/customers/reviews.service';
import { db } from '../../loaders/database.loader'

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const customerId = (req as any).user.id;
        const review = await reviewService.createReview(customerId, req.body);
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(review));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const reviews = await reviewService.getAllReviews(transaction);
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(reviews));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const getReviewsByProduct = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { productId } = req.params;
        const reviews = await reviewService.getReviewsByProduct(Number(productId));
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(reviews));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const review = await reviewService.updateReview(Number(id), req.body);
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(review));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        await reviewService.deleteReview(Number(id));
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse({}));
    } catch (error) {
		await transaction.rollback();
		next(error);
	}
};
