'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Shipping', 'name', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('Shipping', 'email', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('Shipping', 'phone', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.addColumn('Shipping', 'shippingAddress', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    await queryInterface.removeColumn('Orders', 'paymentMethod');
    await queryInterface.removeColumn('Orders', 'shippingAddress');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Shipping', 'name');
    await queryInterface.removeColumn('Shipping', 'email');
    await queryInterface.removeColumn('Shipping', 'phone');
    await queryInterface.removeColumn('Shipping', 'shippingAddress');

    await queryInterface.addColumn('Orders', 'paymentMethod', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Orders', 'shippingAddress', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
