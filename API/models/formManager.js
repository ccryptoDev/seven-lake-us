
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Joi = require('joi')
const FormManager = sequelize.define(
  'FormManager',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    agentId: {
      type: DataTypes.STRING,
    },
    subId: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
      //   unique: true,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    formManagerDropdow: {
      type: DataTypes.STRING,
    },
    // ProgressCanApplyTo:, 
    unsecuredFinance: {
      type: DataTypes.STRING,
    },
    retirmentFinance: {
      type: DataTypes.STRING,
    },
    crowdFunding: {
      type: DataTypes.STRING,
    },
    sbaLones: {
      type: DataTypes.STRING,
    },
    equipmentFinance: {
      type: DataTypes.STRING,
    },
    financeAgents: {
      type: DataTypes.STRING,
    },
    receiveLetters: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    receiveDrip: {
      type: DataTypes.BOOLEAN,
      default: false,
    }
  })
module.exports = {
    FormManager
}