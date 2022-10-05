const router = require('express').Router()
const { addLandingPage, getLandingPages, updateLandingPage } = require('../controllers/landingpage');
const { updateLandingTemplate, gettingPerticullarLandingPage, addLandingTemplate, getLandingTemplates } = require('../controllers/landingTemplate');

router.get('/getPerticularLandigPage', gettingPerticullarLandingPage);
 
router.get('/landing/template', getLandingTemplates)
router.put('/landing/template/:id', updateLandingTemplate)
router.post('/landing/template', addLandingTemplate)

router.get('/landing/page', getLandingPages)
router.put('/landing/page/:id', updateLandingPage)
router.post('/landing/page', addLandingPage)

module.exports = router;
