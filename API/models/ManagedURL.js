
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const ManagedURL = sequelize.define(
  'ManagedURL', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  urls: {
    type: DataTypes.STRING,
  },
  thirdParty: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  name: {
    type: DataTypes.STRING,
  },
  owner: {
    type: DataTypes.STRING,
    defaultValue: 'Owned by FA'
  }
})

module.exports = {
  ManagedURL
}