import { Request, Response, NextFunction } from 'express';
import { ResOk } from '../../utility/response.util';
import * as feedbackService from '../../services/managers/feedbacks.service';
import { db } from '../../loaders/database.loader'


export const createfeedback = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const customerId = (req as any).user.id;
        const feedback = await feedbackService.createFeedback(customerId, req.body);
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(feedback));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

export const getAllfeedbacks = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const feedbacks = await feedbackService.getAllFeedbacks(transaction);
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(feedbacks));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

export const updatefeedback = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        const feedback = await feedbackService.updateFeedback(Number(id), req.body);
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse(feedback));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

export const deletefeedback = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { id } = req.params;
        await feedbackService.deleteFeedback(Number(id));
        await transaction.commit();
        return res.status(200).json(new ResOk().formatResponse({}));
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
