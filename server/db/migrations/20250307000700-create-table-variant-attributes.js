'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('VariantAttributes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			productId: {
				allowNull: true,
				type: Sequelize.INTEGER,
				references: { model: 'Products', key: 'id' },
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			},
			variantId: {
				allowNull: true,
				type: Sequelize.INTEGER,
				references: { model: 'ProductVariants', key: 'id' },
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			},
			attributeTypeId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'AttributeTypes', key: 'id' },
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			attributeValueId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'AttributeValues', key: 'id' },
				onDelete: 'CASCADE',
			},
			name: {
				allowNull: true,
				type: Sequelize.STRING(100),
			},
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
		await queryInterface.dropTable('VariantAttributes');
	},
};
