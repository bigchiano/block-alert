'use strict'
const { Model } = require('sequelize')

const { v4: uuidv4 } = require('uuid')

module.exports = (sequelize, DataTypes) => {
  class coin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  coin.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.id = uuidv4()
        }
      },
      sequelize,
      modelName: 'coin',
    }
  )

  return coin
}
