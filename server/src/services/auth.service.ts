import jwt from 'jsonwebtoken';
import env from '../../env';
import { PERMISSION_ERROR } from '../constants/constants';
import { db } from '../loaders/database.loader';
import { Customers } from '../models/customers.model';
import { AppError } from '../utility/appError.util';
import { EncUtil } from '../utility/encryption';
import { sendMail } from '../utility/mail.util';
import { buildHtmlRegisterUser } from '../utility/string.util';
import { Admins } from '../models/admins.model';

export async function authenticate(
	email: string,
	password: string,
	isAdmin: boolean = false,
): Promise<Customers | Admins> {
	const user = isAdmin
		? await db.admins.findOne({ where: { email: email } })
		: await db.customers.findOne({ where: { email: email } });
	if (user == null) {
		throw new AppError(PERMISSION_ERROR, 'email or password mismatch');
	}
	if (!user.isActive) {
		throw new AppError(PERMISSION_ERROR, 'User is not active');
	}
	const isMatch = await EncUtil.comparePassword(password, user.passwordHash);

	if (!isMatch) {
		throw new AppError(PERMISSION_ERROR, 'email or password mismatch');
	}

	return user;
}

export function getToken(
	user: Customers | Admins,
	expiresIn: any,
	isAdmin = false,
): string {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
		},
		isAdmin ? env.app.jwtSecretManager : (env.app.jwtSecret as any),
		{
			expiresIn,
		},
	);
}

export async function register(data: any): Promise<Customers> {
	const user = await db.customers.findOne({ where: { email: data.email } });
	if (user) {
		throw new AppError(PERMISSION_ERROR, 'User already exists');
	}
	const passwordHash = await EncUtil.createHash(data.password);
	data.passwordHash = passwordHash;
	const newUser = await db.customers.create(data);
	const verityToken = getToken(newUser, env.app.jwtExpiredIn);
	const html = buildHtmlRegisterUser(verityToken, newUser.email);
	console.log('html', verityToken, html);
	// await sendMail(newUser.email, 'email verification', undefined, html);

	return newUser;
}

export async function verify(token: string, email: string): Promise<Customers> {
	const user = jwt.verify(token, env.app.jwtSecret) as Customers;
	const userDb = await db.customers.findOne({
		where: { id: user.id, email: user.email },
	});
	if (userDb == null) {
		throw new AppError(PERMISSION_ERROR, 'User not found');
	}
	if (userDb.email !== email) {
		throw new AppError(PERMISSION_ERROR, 'User not found');
	}
	userDb.isActive = true;
	return await userDb.save();
}
