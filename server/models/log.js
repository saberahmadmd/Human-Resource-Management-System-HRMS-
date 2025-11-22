const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Organisation = require('./organisation')
const User = require('./user')

const Log = sequelize.define('Log', {
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meta: {
    type: DataTypes.JSON,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, { tableName: 'logs' })

Organisation.hasMany(Log, { foreignKey: 'organisationId' })
Log.belongsTo(Organisation, { foreignKey: 'organisationId' })

User.hasMany(Log, { foreignKey: 'userId' })
Log.belongsTo(User, { foreignKey: 'userId' })

module.exports = Log;