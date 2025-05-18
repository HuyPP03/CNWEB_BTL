'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Customers', 'googleId', {
			type: Sequelize.STRING(100),
			allowNull: true,
			after: 'isActive',
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Customers', 'googleId');
	},
};
