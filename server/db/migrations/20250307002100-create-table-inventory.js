'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Inventory', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			warehouseId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'Warehouses', key: 'id' },
				onDelete: 'RESTRICT',
			},
			variantId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'ProductVariants', key: 'id' },
				onDelete: 'CASCADE',
			},
			quantity: { type: Sequelize.INTEGER, defaultValue: 0 },
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
		await queryInterface.addConstraint('Inventory', {
			fields: ['warehouseId', 'variantId'],
			type: 'unique',
			name: 'inventory_warehouse_variant_unique',
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('Inventory');
	},
};
