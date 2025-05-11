import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PERMISSION_ERROR } from '../constants/constants';
import { AppError } from '../utility/appError.util';
import env from '../../env';
import { db } from '../loaders/database.loader';

export const isManager = async (
	req: any,
	res: Response,
	next: NextFunction,
) => {
	try {
		(req as any).isAdmin = true;
		next();
	} catch (error) {
		next(error);
	}
};

export const verifyToken = async (
	req: any,
	res: Response,
	next: NextFunction,
) => {
	try {
		const isAdmin = (req as any).isAdmin;
		const token = req.header('Authorization')?.replace('Bearer ', '');
		if (!token) {
			throw new AppError(PERMISSION_ERROR, 'Unauthenticated!');
		}
		const jwtSecret: string = isAdmin
			? env.app.jwtSecretManager
			: env.app.jwtSecret;
		const payload: any = jwt.verify(token, jwtSecret);
		const user = isAdmin
			? await db.admins.findOne({
					where: { id: payload.id, email: payload.email },
					attributes: { exclude: ['passwordHash'] },
			  })
			: await db.customers.findOne({
					where: { id: payload.id, email: payload.email },
					attributes: { exclude: ['passwordHash'] },
			  });
		if (!user || !user.isActive) {
			throw new AppError(PERMISSION_ERROR, 'Unauthenticated!');
		}
		(req as any).user = user;
		next();
	} catch (error) {
		next(error);
	}
};
