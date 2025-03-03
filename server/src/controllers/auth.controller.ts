import { NextFunction, Request, Response } from 'express';
import {
	PERMISSION_ERROR,
	RESPONSE_SUCCESS
} from '../constants/constants';
import * as authService from '../services/auth.service';
import { AppError } from '../utility/appError.util';
import env from '../../env';

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await authService.authenticate(req.body.email, req.body.password);
		if (user == null) {
			throw new AppError(PERMISSION_ERROR, 'email or password mismatch');
		}

		const token = authService.getToken(user, env.app.jwtExpiredIn);

		return res.status(RESPONSE_SUCCESS).json(token);
	} catch (e) {
		next(e);
	}
};

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email } = req.body;
		const user = await authService.register(email);
		return res.status(RESPONSE_SUCCESS).json(user);
	} catch (e) {
		next(e);
	}
};

export const verify = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { token, password} = req.body;
		const user = await authService.verify(token, password);
		return res.status(RESPONSE_SUCCESS).json(user);
	} catch (e) {
		next(e);
	}
}

export const forgotPassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email } = req.body;
		const user = await authService.forgotPassword(email);
		return res.status(RESPONSE_SUCCESS).json(user);
	} catch (e) {
		next(e);
	}
}
