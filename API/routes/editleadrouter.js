const router = require('express').Router()
const {EditleadsEmail} = require('../controllers/editleademailsend');
router.post('/editLeads', EditleadsEmail);
module.exports = router
