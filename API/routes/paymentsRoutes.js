const router = require('express').Router()
const { listPayments, addPayment } = require('../controllers/paymentTransCtrl');

router.get('/payment', listPayments);
router.post('/payment', addPayment);

module.exports = router;