const router = require('express').Router()
const { MainSearchBar } = require('../controllers/MainSearchBar');
router.get('/MainSearchBar', MainSearchBar);
// router.get('/getpaymentTrans', getPaymentTrans);
module.exports = router;