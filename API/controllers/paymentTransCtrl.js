const { Payment } = require('../models/Payment');

exports.addPayment = async (req, res) => {
  const AddPaymentTransID = await Payment.create(req.body);
  if (!AddPaymentTransID) {
    return res.status(400).json({
      "msg": "Invalid payment status"
    })
  }
  res.status(201).json({
    status: 'success',
    msg: 'details added',
    PaymentStatus: AddPaymentTransID
  })
}
exports.listPayments = async (req, res) => {
  const rows = await Payment.findAll();
  if (!rows) {
    return res.status(400).json({
      "message": "invalid paymentstatus"
    })
  } else {
    res.status(200).json({
      status: 'success',
      paymentTrans: rows
    })
  }
}