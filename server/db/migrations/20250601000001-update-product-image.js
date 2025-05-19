'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('ProductImages', 'publicId', {
			type: Sequelize.STRING,
			allowNull: false,
			after: 'productId',
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn('ProductImages', 'publicId');
	},
};
