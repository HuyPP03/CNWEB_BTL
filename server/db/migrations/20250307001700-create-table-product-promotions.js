'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('ProductPromotions', {
			productId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: { model: 'Products', key: 'id' },
				onDelete: 'CASCADE',
			},
			promotionId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				references: { model: 'Promotions', key: 'id' },
				onDelete: 'CASCADE',
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
		await queryInterface.dropTable('ProductPromotions');
	},
};
