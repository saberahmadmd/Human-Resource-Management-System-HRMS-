const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Organisation = require('./organisation')

const Team = sequelize.define('Team', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT
}, { tableName: 'teams' })

Organisation.hasMany(Team, { foreignKey: 'organisationId' })
Team.belongsTo(Organisation, { foreignKey: 'organisationId' })

module.exports = Team;