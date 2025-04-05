'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('ProductVariants', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			productId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'Products', key: 'id' },
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			slug: {
				allowNull: false,
				type: Sequelize.STRING(255),
				unique: true,
			},
			sku: { allowNull: false, type: Sequelize.STRING(50), unique: true },
			price: { allowNull: false, type: Sequelize.DECIMAL(15, 2) },
			discountPrice: { type: Sequelize.DECIMAL(15, 2) },
			stock: { type: Sequelize.INTEGER, defaultValue: 0 },
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('CURRENT_TIMESTAMP'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('CURRENT_TIMESTAMP'),
			},
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('ProductVariants');
	},
};
