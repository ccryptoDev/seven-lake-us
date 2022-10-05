
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Joi = require('joi')
const documents = sequelize.define(
    'documents',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        Document_Name: {
            type: DataTypes.STRING,
        },
        Thumbnail_Name: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
        },
        category: {
            type: DataTypes.STRING,
        },
        download: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.STRING,
        },
        order: {
            type: DataTypes.STRING,
        },
        tag: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        Document_Link: {
            type: DataTypes.STRING,
        },
        Thumbnail_Link: {
            type: DataTypes.STRING,
        },
    })
module.exports = {
    documents
}