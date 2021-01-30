'use strict'
const { Model } = require('sequelize')

const { v4: uuidv4 } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  class userNotificationChannel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userNotificationChannel.belongsTo(models.user, { foreignKey: 'userId', as: 'user' })
      userNotificationChannel.belongsTo(models.notification, { foreignKey: 'notificationChannelId', as: 'notificationChannel' })
    }
  }

  userNotificationChannel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notificationChannelId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      channelId: {
        type: DataTypes.STRING,
      },
      setupId: {
        type: DataTypes.STRING,
        // verification rand string
      },
    },
    {
      hooks: {
        beforeCreate: (userNotificationChannel, options) => {
          userNotificationChannel.id = uuidv4()
        },
      },
      sequelize,
      modelName: 'userNotificationChannel',
    }
  )

  return userNotificationChannel
}
