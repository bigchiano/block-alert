'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coins', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      symbol: {
        type: Sequelize.STRING,
      },
      productId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('coins')
  },
}
