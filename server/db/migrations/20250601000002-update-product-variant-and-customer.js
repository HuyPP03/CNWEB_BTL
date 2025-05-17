'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('ProductVariants', 'name', {
			type: Sequelize.STRING,
			allowNull: false,
			after: 'id',
		});
		await queryInterface.addColumn('Customers', 'isBlock', {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			after: 'isActive',
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('ProductVariants', 'name');
		await queryInterface.removeColumn('Customers', 'isBlock');
	},
};
