const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const LandingPageDetails = sequelize.define(
  'LandingPageDetails',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    usedBy: {
      type: DataTypes.STRING,
    },
    thumbnail: {
      type: DataTypes.STRING,
      field: 'thumbnel',
    },
    preview: {
      type: DataTypes.STRING,
      default: null,
    },
    status: {
      type: DataTypes.STRING,
    },
    random: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  })
module.exports = {
  LandingPageDetails
}