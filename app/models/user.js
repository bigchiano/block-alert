const user = (sequelize, DataTypes) =>
  sequelize.define(
    'user',
    {
      // Model attributes are defined here
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        // allowNull defaults to true
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
      // Other model options go here
    }
  )

module.exports = user
