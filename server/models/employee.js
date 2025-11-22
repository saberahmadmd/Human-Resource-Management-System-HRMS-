const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Organisation = require('./organisation')

const Employee = sequelize.define('Employee', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING
}, { tableName: 'employees' })

Organisation.hasMany(Employee, { foreignKey: 'organisationId' })
Employee.belongsTo(Organisation, { foreignKey: 'organisationId' })

module.exports = Employee;