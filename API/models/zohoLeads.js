
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Joi = require('joi')
const ZohoLeads = sequelize.define(
    'ZohoLeads',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        State: {
            type: DataTypes.STRING,
        },
        Email: {
            type: DataTypes.STRING,
        },
        First_Name: {
            type: DataTypes.STRING,
        },
        Last_Name: {
            type: DataTypes.STRING,
        },
        Company: {
            type: DataTypes.STRING,
        },
        Lead_Status: {
            type: DataTypes.STRING,
        },
        URL: {
            type: DataTypes.STRING,
        },
    })
module.exports = {
    ZohoLeads
}