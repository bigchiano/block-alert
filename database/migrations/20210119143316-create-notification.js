'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING
      },
      targetPrice: {
        type: Sequelize.DOUBLE
      },
      notificationChannelId: {
        type: Sequelize.STRING
      },
      restTime: {
        type: Sequelize.DATE
      },
      note: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notifications');
  }
};