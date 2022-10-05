const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Joi = require('joi')

const User = sequelize.define(
  'User',
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
    mobilePhone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    memberNumber: {
      type: DataTypes.STRING,
    },
    Website: {
      type: DataTypes.STRING,
    },
    Sponsor: {
      type: DataTypes.STRING,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    resetLockOutCounter: {
      type: DataTypes.DATE,
    },
    passwordExpiresOn: {
      type: DataTypes.DATE,
    },
    oldPasswords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    status:{
      type:DataTypes.STRING
    },
    resetPasswordToken: { type: DataTypes.STRING },
    resetPasswordExpire: { type: DataTypes.DATE },
  }, {
  defaultScope: {
    attributes: {
      exclude: [
        'password',
        'loginAttempts',
        'resetLockOutCounter',
        'passwordExpiresOn',
        'oldPasswords',
        'resetPasswordToken',
        'resetPasswordExpire',
      ],
    },
  },
  scopes: {
    withPassword: {
      attributes: {
        include: [
          'password',
          'loginAttempts',
          'resetLockOutCounter',
          'passwordExpiresOn',
          'oldPasswords',
          'resetPasswordToken',
          'resetPasswordExpire',
        ],
      },
    },
  },
}
)

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z0-9 ]*$/)
      .messages({ 'string.pattern.base': `Invalid first name` })
      .trim()
      .max(40)
      .required(),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z0-9 ]*$/)
      .messages({ 'string.pattern.base': `Invalid last name` })
      .trim()
      .max(40)
      .required(),
    email: Joi.string().max(255).trim().required().email(),
    mobilePhone: Joi.string()
      .pattern(/^[0-9]\d{9}$/)
      .messages({ 'string.pattern.base': `Invalid Mobile Phone Number` })
      .allow('', null),
  })

  return schema.validate(user)
}
function validateUpdateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[a-zA-Z0-9 ]*$/)
      .messages({ 'string.pattern.base': `Invalid first name` })
      .trim()
      .max(40)
      .required(),
    lastName: Joi.string()
      .pattern(/^[a-zA-Z0-9 ]*$/)
      .messages({ 'string.pattern.base': `Invalid last name` })
      .trim()
      .max(40)
      .required(),
    mobilePhone: Joi.string()
      .pattern(/^[0-9]\d{9}$/)
      .messages({ 'string.pattern.base': `Invalid Mobile Phone Number` })
      .allow('', null),
  })

  return schema.validate(user)
}

module.exports = {
  User,
  validateUser,
  validateUpdateUser,
}
