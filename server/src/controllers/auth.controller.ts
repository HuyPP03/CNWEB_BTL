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

		const token = authService.getToken(user, env.app.jwtExpiredIn, true);

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
		const { token, email } = req.query as any;

		if (!token || !email) {
			return res.send(`
                <html>
                <head>
                    <title>Xác minh thất bại</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                        .container { max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                        .error { color: red; font-size: 24px; margin-bottom: 20px; }
                        .message { margin-bottom: 20px; }
                        .btn { background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="error">❌ Xác minh thất bại!</div>
                        <div class="message">Thiếu thông tin cần thiết để xác minh tài khoản.</div>
                        <a href="/" class="btn">Quay lại trang chủ</a>
                    </div>
                </body>
                </html>
            `);
		}

		// Gọi service để xác minh
		const user = await authService.verify(token, email);

		if (user) {
			// Nếu xác minh thành công
			return res.send(`
                <html>
                <head>
                    <title>Xác minh thành công</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                        .container { max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                        .success { color: green; font-size: 24px; margin-bottom: 20px; }
                        .message { margin-bottom: 20px; }
                        .btn { background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="success">✅ Xác minh thành công!</div>
                        <div class="message">Tài khoản của bạn đã được xác minh thành công.</div>
                        <a href="/login" class="btn">Đăng nhập ngay</a>
                    </div>
                </body>
                </html>
            `);
		} else {
			// Nếu xác minh thất bại
			return res.send(`
                <html>
                <head>
                    <title>Xác minh thất bại</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                        .container { max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                        .error { color: red; font-size: 24px; margin-bottom: 20px; }
                        .message { margin-bottom: 20px; }
                        .btn { background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="error">❌ Xác minh thất bại!</div>
                        <div class="message">Liên kết xác minh không hợp lệ hoặc đã hết hạn.</div>
                        <a href="/resend-verification" class="btn">Gửi lại email xác minh</a>
                    </div>
                </body>
                </html>
            `);
		}
	} catch (e) {
		// Nếu có lỗi trong quá trình xác minh
		res.send(`
            <html>
            <head>
                <title>Xác minh thất bại</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                    .container { max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    .error { color: red; font-size: 24px; margin-bottom: 20px; }
                    .message { margin-bottom: 20px; }
                    .btn { background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="error">❌ Xác minh thất bại!</div>
                    <div class="message">Đã xảy ra lỗi trong quá trình xác minh tài khoản.</div>
                    <a href="/" class="btn">Quay lại trang chủ</a>
                </div>
            </body>
            </html>
        `);
		next(e);
	}
};
