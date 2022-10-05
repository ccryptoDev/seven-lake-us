const router = require('express').Router();
const {SettingColorCode,gettiingColorCode,UpdateColorCode} = require('../controllers/settingColorChange');
router.post('/settingcolorcode', SettingColorCode);
router.get('/gettingcolorCode',gettiingColorCode);
router.put('/updateColorCode',UpdateColorCode);
module.exports = router;