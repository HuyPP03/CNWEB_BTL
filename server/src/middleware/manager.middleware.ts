import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PERMISSION_ERROR } from '../constants/constants';
import { AppError } from '../utility/appError.util';

export const isAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { role } = req.user as JwtPayload;
		if (role !== 'super_admin')
			throw new AppError(PERMISSION_ERROR, 'Unauthenticated!');
		next();
	} catch (error) {
		next(error);
	}
};

export const isManager = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { role } = req.user as JwtPayload;
		if (role !== 'manager')
			throw new AppError(PERMISSION_ERROR, 'Unauthenticated!');
		next();
	} catch (error) {
		next(error);
	}
};

export const isStaff = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { role } = req.user as JwtPayload;
		if (role !== 'staff')
			throw new AppError(PERMISSION_ERROR, 'Unauthenticated!');
		next();
	} catch (error) {
		next(error);
	}
};
