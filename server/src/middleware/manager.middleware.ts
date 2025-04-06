import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PERMISSION_ERROR } from '../constants/constants';
import { AppError } from '../utility/appError.util';

enum RoleManager {
	super_admin = 'super_admin',
	manager = 'manager',
	staff = 'staff',
}

export const authorization = (roles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as any;
			if (!user) {
				throw new AppError(PERMISSION_ERROR, 'user_not_found');
			}
			if (user.role === RoleManager.super_admin) {
				return next();
			}

			if (!roles.includes(user.role)) {
				throw new AppError(PERMISSION_ERROR, 'Unauthority');
			}
			next();

			throw new AppError(PERMISSION_ERROR, 'Unauthority');
		} catch (error) {
			next(error);
		}
	};
};
