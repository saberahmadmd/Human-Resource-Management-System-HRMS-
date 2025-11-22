const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Employee = require('./employee');
const Team = require('./team');

const EmployeeTeam = sequelize.define(
  'EmployeeTeam',
  {
    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'employee_teams',
  }
);

Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: 'employeeId',
});

Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: 'teamId',
});

module.exports = EmployeeTeam;
