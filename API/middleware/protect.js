const AppError = require('../utils/AppError')
const { User } = require('../models/userModel')
const jwt = require('jsonwebtoken')

exports.protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.jwt_Secret)
    next()
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    )
  }
}
