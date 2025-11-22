const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './hrms.sqlite',
  logging: false
})

module.exports = sequelize;