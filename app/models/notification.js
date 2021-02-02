'use strict'
const { Model } = require('sequelize')

const { v4: uuidv4 } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      notification.belongsTo(models.coin, { foreignKey: 'coinId', as: 'coin' })
      notification.belongsTo(models.user, { foreignKey: 'userId', as: 'user' })
      
    }
  }

  notification.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      targetPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      seenTarget: {
        type: DataTypes.BOOLEAN
      },
      notificationChannel: {
        type: DataTypes.STRING,
        allowNull: false
      },
      coinId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      restTime: {
        type: DataTypes.DOUBLE
      },
      note: {
        type: DataTypes.STRING
      },
    },
    {
      hooks: {
        beforeCreate: (notification, options) => {
          notification.id = uuidv4()
        }
      },
      sequelize,
      modelName: 'notification',
    }
  )
  return notification
}
