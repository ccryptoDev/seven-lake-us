const { FormManager } = require('../models/formManager')
const axios = require('axios');

exports.addFormManager = async (req, res, next) => {
  const { name, AgentID, SubId, firstName, receiveDrips,
    lastName, email, phone, description, receiveLetters,
    formManagerDropdow, unsecuredFinance,
    retirmentFinance, crowdFunding, sbaLones, equipmentFinance, financeAgents
  } = req.body;

  const requestParams = {
    name: name,
    agentId: AgentID,
    subId: SubId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    description: description,
    formManagerDropdow: formManagerDropdow,
    unsecuredFinance: unsecuredFinance,
    retirmentFinance: retirmentFinance,
    crowdFunding: crowdFunding,
    sbaLones: sbaLones,
    equipmentFinance: equipmentFinance,
    financeAgents: financeAgents,
    receiveDrips: receiveDrips === 'true',
    receiveLetters: receiveLetters === 'true',
  }
  const formManager = await FormManager.create(requestParams);
  if (!formManager) {
    return res.status(400).json({
      "msg": "Invalid FormsManager parameters"
    })
  }
  res.status(201).json({
    status: 'success',
    msg: 'details added',
    lead: formManager
  })
}

exports.getformManager = async (req, res, next) => {
  const rows = await FormManager.findAll();
  if (!rows) {
    return res.status(400).json({
      "message": "invalid parameters"
    })
  } else {
    res.status(200).json({
      status: 'success',
      getOffice: rows
    })
  }
}
exports.updateFormManager = async (req, res, next) => {
  try {
    const data = await FormManager.update(req.body, { where: { id: req.params.id } });
    console.log(data);
    res.status(200).json({
      status: 'update succesfully',
      formManager: data
    });
  }
  catch (err) {
    console.log(err.message);
  }
}
exports.getSingleFormManager = async (req, res, next) => {
  const rows = await FormManager.findByPk(req.params.id)
  if (!rows) {
    return res.status(400).json({
      "message": "invalid parameters"
    })
  } else {
    res.status(200).json({
      status: 'success',
      formManager: rows
    })
  }
}
exports.deletesingleFormManagement = async (req, res, next) => {
  const rows = await FormManager.destroy({
    where: { id: req.params.id }
  })
  if (!rows) {
    return res.status(400).json({
      "message": "Server is Not working"
    })
  } else {
    res.status(200).json({
      status: 'delete success',
      formManager: rows
    })
  }
}
