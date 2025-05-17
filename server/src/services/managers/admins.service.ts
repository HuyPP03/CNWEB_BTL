import { Transaction, Op } from 'sequelize';
import { db } from '../../loaders/database.loader';

export const getAdmin = async (filters: any, transaction?: Transaction) => {
	const where: any = {};

	// Điều kiện lọc theo id sản phẩm
	if (filters.id) {
		where.id = filters.id;
	}

	// Điều kiện lọc theo tên sản phẩm
	if (filters.username) {
		where.username = { [Op.like]: `%${filters.username}%` };
	}

	if (filters.fullName) {
		where.fullName = { [Op.like]: `%${filters.fullName}%` };
	}

	if (filters.email) {
		where.email = { [Op.like]: `%${filters.email}%` };
	}

	if (filters.phone) {
		where.phone = { [Op.like]: `%${filters.phone}%` };
	}
	if (filters.role) {
		where.role = { [Op.like]: `%${filters.role}%` };
	}

	// Lấy dữ liệu từ cơ sở dữ liệu với phân trang
	const [rows, count] = await Promise.all([
		db.admins.findAll({
			where,
			limit: filters.limit,
			offset: filters.offset,
			transaction,
		}),
		db.admins.count({
			where,
			transaction,
		}),
	]);

	return [rows, count];
};

export const createAccount = async (data: any, transaction?: Transaction) => {
	const { username, email, phone, role, fullName, password } = data;

	if (!username || !email || !phone || !role || !password) {
		throw new Error('Thiếu thông tin bắt buộc để tạo tài khoản');
	}

	// Kiểm tra trùng lặp username
	const existingUsername = await db.admins.findOne({
		where: { username },
		transaction,
	});
	if (existingUsername) {
		throw new Error('Username đã tồn tại');
	}

	// Kiểm tra trùng lặp email
	const existingEmail = await db.admins.findOne({
		where: { email },
		transaction,
	});
	if (existingEmail) {
		throw new Error('Email đã tồn tại');
	}

	// Kiểm tra trùng lặp phone
	const existingPhone = await db.admins.findOne({
		where: { phone },
		transaction,
	});
	if (existingPhone) {
		throw new Error('Số điện thoại đã tồn tại');
	}

	// Mã hóa mật khẩu nếu có sử dụng bcrypt (tùy theo hệ thống)
	const bcrypt = require('bcrypt');
	const hashedPassword = await bcrypt.hash(password, 10);

	const newAccount = await db.admins.create(
		{
			username,
			email,
			phone,
			role,
			fullName,
			passwordHash: hashedPassword,
		},
		{ transaction },
	);

	return newAccount;
};

// Cập nhật tài khoản admin
export const updateAccount = async (
	id: number,
	data: any,
	transaction?: Transaction,
) => {
	const admin = await db.admins.findByPk(id, { transaction });
	if (!admin) throw new Error('Admin không tồn tại');

	const { username, email, phone, fullName, role } = data;

	// Kiểm tra trùng lặp nếu username/email/phone thay đổi
	if (username && username !== admin.username) {
		const exists = await db.admins.findOne({
			where: { username },
			transaction,
		});
		if (exists) throw new Error('Username đã tồn tại');
	}

	if (email && email !== admin.email) {
		const exists = await db.admins.findOne({
			where: { email },
			transaction,
		});
		if (exists) throw new Error('Email đã tồn tại');
	}

	if (phone && phone !== admin.phone) {
		const exists = await db.admins.findOne({
			where: { phone },
			transaction,
		});
		if (exists) throw new Error('Số điện thoại đã tồn tại');
	}

	await admin.update(
		{ username, email, phone, fullName, role },
		{ transaction },
	);
	return admin;
};

// Xóa tài khoản admin
export const deleteAccount = async (id: number, transaction?: Transaction) => {
	const admin = await db.admins.findByPk(id, { transaction });
	if (!admin) throw new Error('Tài khoản không tồn tại');

	if (admin.role === 'super_admin')
		throw new Error('Không thể xóa tài khoản này');

	// Nếu không muốn xóa cứng, có thể dùng admin.update({ isDeleted: true }) thay vì destroy
	await admin.destroy({ transaction });
	return { message: 'Tài khoản đã được xóa thành công' };
};
