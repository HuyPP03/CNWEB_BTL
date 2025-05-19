import { Transaction, Op } from 'sequelize';
import { db } from '../../loaders/database.loader';

export const getAdminLogs = async (filters: any, transaction?: Transaction) => {
	const where: any = {};

	// Điều kiện lọc theo id sản phẩm
	if (filters.id) {
		where.id = filters.id;
	}

	if (filters.adminId) {
		where.adminId = filters.adminId;
	}

	// Điều kiện lọc theo tên sản phẩm
	if (filters.action) {
		where.action = { [Op.like]: `%${filters.action}%` };
	}

	if (filters.entityType) {
		where.entityType = { [Op.like]: `%${filters.entityType}%` };
	}

	if (filters.entityId) {
		where.entityId = filters.entityId;
	}

	if (filters.details) {
		where.details = { [Op.like]: `%${filters.details}%` };
	}
	if (filters.fromDate && filters.toDate) {
		where.createdAt = {
			[Op.between]: [
				new Date(filters.fromDate),
				new Date(
					new Date(filters.toDate).setDate(
						new Date(filters.toDate).getDate() + 1,
					),
				),
			],
		};
	} else if (filters.fromDate) {
		where.createdAt = {
			[Op.gte]: new Date(filters.fromDate),
		};
	} else if (filters.toDate) {
		where.createdAt = {
			[Op.lte]: new Date(
				new Date(filters.toDate).setDate(
					new Date(filters.toDate).getDate() + 1,
				),
			),
		};
	}

	// Lấy dữ liệu từ cơ sở dữ liệu với phân trang
	const [rows, count] = await Promise.all([
		db.adminLogs.findAll({
			where,
			order: [['createdAt', 'DESC']],
			include: [
				{
					model: db.admins,
					attributes: ['username', 'email'],
					where: {
						...(filters.username && {
							username: { [Op.like]: `%${filters.username}%` },
						}),
						...(filters.email && {
							email: { [Op.like]: `%${filters.email}%` },
						}),
					},
					required: true,
				},
			],
			limit: filters.limit,
			offset: filters.offset,
			transaction,
		}),
		db.adminLogs.count({
			where,
			transaction,
		}),
	]);

	return [rows, count];
};

export const CreateAdminLog = async (
	adminId: number,
	action: string,
	entityId: number,
	entityType: string,
	data: any,
	transaction?: Transaction,
) => {
	const details = JSON.stringify(data);
	await db.adminLogs.create(
		{ adminId, action, entityId, entityType, details },
		{ transaction },
	);
};
