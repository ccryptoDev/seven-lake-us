const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Joi = require('joi')

const TokenModel = sequelize.define('TokenModel', {
  rfToken: {
    type: DataTypes.TEXT,
  },
  userId: {
    type: DataTypes.UUID,
  },
})

function validateTokenModel(rt) {
  const schema = Joi.object({
    rfToken: Joi.string().max(300).required(),
    userId: Joi.string().required(),
  })

  return schema.validate(rt)
}

module.exports = {
  validateTokenModel,
  TokenModel,
}
