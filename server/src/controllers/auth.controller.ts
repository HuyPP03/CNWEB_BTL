import { NextFunction, Request, Response } from 'express';
import { PERMISSION_ERROR, RESPONSE_SUCCESS } from '../constants/constants';
import * as authService from '../services/auth.service';
import { AppError } from '../utility/appError.util';
import env from '../../env';
import { ResOk } from '../utility/response.util';

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await authService.authenticate(
			req.body.email,
			req.body.password,
		);
		if (user == null) {
			throw new AppError(PERMISSION_ERROR, 'email or password mismatch');
		}

		const token = authService.getToken(user, env.app.jwtExpiredIn);

		return res
			.status(RESPONSE_SUCCESS)
			.json(
				new ResOk().formatResponse(
					token,
					'access_token',
					RESPONSE_SUCCESS,
				),
			);
	} catch (e) {
		next(e);
	}
};

export const loginManager = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await authService.authenticate(
			req.body.email,
			req.body.password,
			true,
		);
		if (user == null) {
			throw new AppError(PERMISSION_ERROR, 'email or password mismatch');
		}

		const token = authService.getToken(user, env.app.jwtExpiredIn);

		return res
			.status(RESPONSE_SUCCESS)
			.json(
				new ResOk().formatResponse(
					token,
					'access_token',
					RESPONSE_SUCCESS,
				),
			);
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
		await authService.register(req.body);
		return res
			.status(RESPONSE_SUCCESS)
			.json(
				new ResOk().formatResponse(
					null,
					'User registered successfully',
					RESPONSE_SUCCESS,
				),
			);
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
		const { token, email } = req.body as any;
		await authService.verify(token, email);
		return res
			.status(RESPONSE_SUCCESS)
			.json(
				new ResOk().formatResponse(
					null,
					'User verified successfully',
					RESPONSE_SUCCESS,
				),
			);
	} catch (e) {
		next(e);
	}
};
