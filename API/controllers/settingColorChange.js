const { sidebarColorCode } = require('../models/sidebarColormodel');

exports.SettingColorCode = async (req, res, next) => {
  let a = req.body;
  console.log(a);
  console.log(a.sideBarColor);
  const requestParams = {
    sideBarColor: a.sideBarColor,
    headerBrandColor: a.headerBrandColor,
    headerColor: a.headerColor,
    AccountType:a.AccountType
  }
  console.log(requestParams);
  const storeColorCode = await sidebarColorCode.create(requestParams);
  
  if (!storeColorCode) {
    return res.status(400).json({
      "msg": "Invalid parameters"
    })
  } else {
    return res.status(201).json({
      "msg": "Success",
      data: storeColorCode
    })
  }
}

exports.gettiingColorCode =async (req,res,next) =>{
    var gettingColor = await sidebarColorCode.findAll();
    var gettingColorCodArray = [];
    gettingColorCodArray = gettingColor;
    // var filterColorCode = gettingColorCodArray.filter('AccountType == Office');
    if (!gettingColorCodArray) {
        return res.status(400).json({
          "message": "color code is not available",
        })
      } else {
        res.status(200).json({
          status: 'success',
          GettingcolotCode : gettingColorCodArray
        })
      }
}
exports.UpdateColorCode = async(req,res,next)=>{
    console.log(req.body);
    console.log(req.params.AccountType);
    console.log(req.query.AccountType);

    var updateColorCode = await sidebarColorCode.update(req.body,{where:{AccountType:req.query.AccountType}})
    console.log(updateColorCode)
    res.status(200).json({
        status:'update succesfully',
        Updatecolorcode:updateColorCode
    });
}