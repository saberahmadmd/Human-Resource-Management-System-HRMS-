const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Organisation = require('./organisation')

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { tableName: 'users' })

Organisation.hasMany(User, { foreignKey: 'organisationId' })
User.belongsTo(Organisation, { foreignKey: 'organisationId' })

module.exports = User;