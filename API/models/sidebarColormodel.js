
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
let sidebarColorCode = sequelize.define(
    'sidebarColorCode',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        
        sideBarColor:{
            type:DataTypes.STRING,
        },

        headerBrandColor:{
            type:DataTypes.STRING
        },

        headerColor:{
            type:DataTypes.STRING
        },
        AccountType:{
            type:DataTypes.STRING

        }
    })
module.exports = {sidebarColorCode};
