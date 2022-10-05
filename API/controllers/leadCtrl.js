const { Lead } = require('../models/leadModel')
const FormData = require("form-data");
const axios = require('axios');
const { uploadFile, getFileUrl } = require('../utils/S3')

exports.addLead = async (req, res, next) => {
  const leadsUrl = 'https://www.zohoapis.com/crm/v2/leads'
  const { code } = req.query;

  const params = JSON.stringify({
    data: [{
      Lead_Status: "New Lead",
      ...req.body
    }],
    trigger: ["approval", "workflow", "blueprint"],
  });

  const config = {
    headers: {
      Authorization: `Zoho-oauthtoken ${code}`,
      "Content-Type": "application/json",
    },
  };


  const leadsResponse = await axios.post(leadsUrl, params, config)

  const lead = leadsResponse.data.data[0]
  const leadId = lead.details.id


  const updateParams = {
    data: [{ Member: req.body.Member }],
    formruleValue: {
      mandatoryInputNeededElem: [],
      lrMandatoryElem: [],
      LayoutRuleHiddenElem: [],
    },
  };
  let response = await axios.put(`${leadsUrl}/${leadId}`, updateParams, config)
  let checkLead = await axios.get(`https://www.zohoapis.com/crm/v2/leads/search?criteria=((id:equals:${leadId}))`, config)
  while (checkLead.data.data[0].Member === null) {
    response = await axios.put(`${leadsUrl}/${leadId}`, updateParams, config)
    checkLead = await axios.get(`https://www.zohoapis.com/crm/v2/leads/search?criteria=((id:equals:${leadId}))`, config)
  }

  let files = []
  for (let key in req.files) {
    const { file } = await uploadFile(req.files[key])
    files.push(file)
  }

  for (let i = 0; i < files.length; i++) {
    const body = new FormData()
    body.append('attachmentUrl', await getFileUrl(files[i].name))
    const filesResponse = await axios.post(`${leadsUrl}/${leadId}/Attachments`, body, {
      headers: {
        ...body.getHeaders(),
        Authorization: `Zoho-oauthtoken ${code}`,
      },
    })
  }


  res.status(201).json({
    status: "leads inserted successfully",
    leads: response.data,
  });
};



exports.listLeads = async (req, res, next) => {
  const { code, member } = req.query;
  const config = {
    headers: {
      'Authorization': `Zoho-oauthtoken ${code}`,
    },
  }
  axios.get(`https://www.zohoapis.com/crm/v2/leads/search?criteria=((Member:equals:${member}))`, config)
    .then(leadsResponse => {
      res.status(200).json({
        status: 'success',
        lead: leadsResponse.data.data || [],
      })
    })
    .catch(error => {
      console.log(error);
    });
}


exports.findAllLead = async (req, res, next) => {
  const AllLeads = await Lead.findAll()
  res.status(200).json({
    status: 'success in finding all leads',
    allLeads: AllLeads,
  })
}