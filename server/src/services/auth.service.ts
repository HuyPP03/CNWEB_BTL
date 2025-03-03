import jwt from 'jsonwebtoken';
import env from '../../env';
import { PERMISSION_ERROR } from '../constants/constants';
import { db } from '../loaders/database.loader';
import { Users } from '../models/users.model';
import { AppError } from '../utility/appError.util';
import { EncUtil } from '../utility/encryption';
import { sendMail } from '../utility/mail.util';
import { buildHtmlRegisterUser } from '../utility/string.util';

export async function authenticate(email: string, password: string): Promise<Users> {
	const user = await db.users.findOne({ where: { email: email } });
	if (user == null) {
		throw new AppError(PERMISSION_ERROR, 'email or password mismatch');
	}
	const isMatch = await EncUtil.comparePassword(password, user.password);

	if (!isMatch) {
		throw new AppError(PERMISSION_ERROR, 'email or password mismatch');
	}

	return user;
}

export function getToken(user: Users, expiresIn: string): string {
	return jwt.sign({
		id: user.id,
		email: user.email,
		isVerified: user.isVerified,
		isForgotPassword: user.isForgotPassword,
	}, env.app.jwtSecret, {
		expiresIn,
	});
}

export async function register(email: string): Promise<Users> {
	const user = await db.users.findOne({ where: { email: email } });
	if (user !== null) {
		if (user.isVerified) {
			throw new AppError(PERMISSION_ERROR, 'email already verified');
		}
	}

	const newUser = user || await db.users.create({
		email,
	});
	const verityToken = getToken(newUser, env.app.jwtExpiredIn);
	const html = buildHtmlRegisterUser(verityToken);
	console.log('html', verityToken, html);
	await sendMail(newUser.email, 'email verification', undefined, html);

	return newUser;
}

export async function verify(token: string, password: string): Promise<Users> {
	const user = jwt.verify(token, env.app.jwtSecret) as Users;
	const userDb = await db.users.findOne({ where: { id: user.id } });
	if (userDb == null) {
		throw new AppError(PERMISSION_ERROR, 'User not found');
	}

	if (userDb.isVerified && !userDb.isForgotPassword) {
		throw new AppError(PERMISSION_ERROR, 'User already verified');
	}

	userDb.isVerified = true;
	userDb.isForgotPassword = false;
	userDb.password = await EncUtil.createHash(password);
	return await userDb.save();
}

export async function forgotPassword(email: string): Promise<Users> {
	const user = await db.users.findOne({ where: { email: email } });
	if (user == null) {
		throw new AppError(PERMISSION_ERROR, 'User not found');
	}

	user.isForgotPassword = true;

	const verityToken = getToken(user, env.app.jwtExpiredIn);
	const html = buildHtmlRegisterUser(verityToken);
	await sendMail(user.email, 'forgot password', undefined, html);

	return await user.save();
}
