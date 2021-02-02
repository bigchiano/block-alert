'use strict'
const { Model } = require('sequelize')

const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.notification, { foreignKey: 'id', as: 'notification' })
    }
  }

  user.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tokens: {
        type: DataTypes.JSON,
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.id = uuidv4()
        },
        beforeSave: async (user, options) => {
          if (user.changed('password')) {
            const passwordHash = await bcrypt.hash(user.password, 10)
            user.password = passwordHash
          }
        }
      },
      sequelize,
      modelName: 'user',
    }
  )

  return user
}
