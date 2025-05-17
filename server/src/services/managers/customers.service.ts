import { Transaction, Op } from 'sequelize';
import { db } from '../../loaders/database.loader';

export const getCustomer = async (filters: any, transaction?: Transaction) => {
	const where: any = {};

	if (filters.id) {
		where.id = filters.id;
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

	if (filters.address) {
		where.address = { [Op.like]: `%${filters.address}%` };
	}

	if (typeof filters.isActive === 'boolean') {
		where.isActive = filters.isActive;
	}
	if (typeof filters.isBlock === 'boolean') {
		where.isBlock = filters.isBlock;
	}

	const [rows, count] = await Promise.all([
		db.customers.findAll({
			where,
			attributes: {
				exclude: ['passwordHash'],
			},
			limit: filters.limit,
			offset: filters.offset,
			transaction,
		}),
		db.customers.count({
			where,
			transaction,
		}),
	]);

	return [rows, count];
};

export const blockCustomer = async (
	customerId: number,
	isBlock: boolean,
	transaction?: Transaction,
) => {
	const customer = await db.customers.findByPk(customerId, { transaction });

	if (!customer) {
		throw new Error('Customer not found');
	}

	// Cập nhật isBlock
	await customer.update({ isBlock }, { transaction });

	let plainAccount = customer.toJSON() as any;
	delete plainAccount.passwordHash;

	return plainAccount;
};
