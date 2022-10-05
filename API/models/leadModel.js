
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Joi = require('joi')
const Lead = sequelize.define(
  'Lead',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    company: {
      type: DataTypes.STRING,
    },
    funding: {
      type: DataTypes.STRING,
    },
    document: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    program: {
      type: DataTypes.STRING,
    },

  })
module.exports = {
  Lead

}