'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('VariantAttributes', {
			variantId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: { model: 'ProductVariants', key: 'id' },
				onDelete: 'CASCADE',
			},
			attributeValueId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: { model: 'AttributeValues', key: 'id' },
				onDelete: 'RESTRICT',
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
