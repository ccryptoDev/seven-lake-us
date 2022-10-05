
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    transactionId: {
        type: DataTypes.STRING,
    },
    memberId: {
        type: DataTypes.STRING
    }
})

module.exports = { Payment };