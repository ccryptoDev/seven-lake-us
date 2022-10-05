const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const LandingTemplateDetails = sequelize.define(
    'LandingTemplateDetails',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      templateName: {
        type: DataTypes.STRING,
      },
      agentName: {
        type: DataTypes.STRING,
      } 
    })
  module.exports = {
    LandingTemplateDetails
  }