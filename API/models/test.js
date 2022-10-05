
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
let aBC = sequelize.define(
    'aBC',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        transId:{
            type:DataTypes.STRING,
        },
        memberId:{
            type:DataTypes.STRING
        }
    })
module.exports = {aBC};
