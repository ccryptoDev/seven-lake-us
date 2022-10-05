const AppError = require('../utils/AppError')

const errorMid = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  if (err?.original?.routine === 'string_to_uuid') {
    const message = 'Invalid User Id'
    error = new AppError(message, 400)
  }

  res.status(error.statusCode || 500).json({
    status: 'fail',
    msg: error.message || 'Server Error',
  })
}

module.exports = errorMid
