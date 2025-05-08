import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import env from '../../env';
import { db } from './database.loader';
import { EncUtil } from '../utility/encryption';
import { Customers } from '../models/customers.model';

export const initPassport = () => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: env.google.clientID,
				clientSecret: env.google.clientSecret,
				callbackURL: env.google.callbackURL,
				scope: ['profile', 'email'],
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					// Tìm kiếm người dùng theo googleId
					let user = await db.customers.findOne({
						where: { googleId: profile.id },
					});

					// Nếu không tìm thấy, tìm theo email
					if (!user && profile.emails && profile.emails.length > 0) {
						const email = profile.emails[0].value;
						user = await db.customers.findOne({
							where: { email },
						});

						// Nếu tìm thấy người dùng với email đó, cập nhật googleId
						if (user) {
							user.googleId = profile.id;
							await user.save();
						} else {
							// Tạo người dùng mới nếu chưa tồn tại
							// Tạo mật khẩu ngẫu nhiên (người dùng có thể đặt lại sau)
							const randomPassword = Math.random()
								.toString(36)
								.slice(-8);
							const passwordHash = await EncUtil.createHash(
								randomPassword,
							);

							user = await db.customers.create({
								email: profile.emails[0].value,
								fullName: profile.displayName || '',
								googleId: profile.id,
								passwordHash,
								isActive: true, // Đã xác minh qua Google
							});
						}
					}

					if (!user) {
						return done(null, false);
					}

					return done(null, user);
				} catch (error) {
					return done(error as Error);
				}
			},
		),
	);

	// Cấu hình serialize và deserialize user
	passport.serializeUser((user: any, done) => {
		done(null, user);
	});

	passport.deserializeUser((obj: any, done) => {
		done(null, obj);
	});

	return passport;
};
