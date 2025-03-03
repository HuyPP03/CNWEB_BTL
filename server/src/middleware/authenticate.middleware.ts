import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PERMISSION_ERROR } from '../constants/constants';
import { AppError } from '../utility/appError.util';

export const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		if (!token) {
			throw new AppError(PERMISSION_ERROR, 'Unauthenticated!');
		}
		const jwtScret: string = process.env.JWT_SCRET || 'scret';
		const user: JwtPayload | string = jwt.verify(token, jwtScret);
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};
