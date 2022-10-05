const { LandingTemplateDetails } = require('../models/landingTemplate')
const axios = require('axios');

exports.addLandingTemplate = async (req, res) => {
  const { templateName, agentName } = req.body;
  const requestParams = {
    templateName, agentName
  }
  const template = await LandingTemplateDetails.create(requestParams);
  res.status(201).json(template)
}

exports.gettingPerticullarLandingPage = async (req, res) => {
  let { code, memberId } = req.query;
  // email = email.replace(' ', '%2B');
  // email = email.replace(/['"]+/g, '');
  const config = {
    headers: {
      'Authorization': `Zoho-oauthtoken ${code}`,
    },
  }
  axios.get(`https://www.zohoapis.com/crm/v2/agents/search?criteria=((Member_Number:equals:${memberId}))`, config)
    .then(agentsResponse => {
      res.status(200).json({
        status: 'success',
        agent: agentsResponse.data.data,
      })
    })
    .catch(error => {
      console.log(error);
    });
}

exports.getLandingTemplates = async (req, res) => {
  const templates = await LandingTemplateDetails.findAll()
  res.status(200).json(templates)
}

exports.updateLandingTemplate = async (req, res) => {
  const template = await LandingTemplateDetails.update(req.body,
    { where: { id: req.params.id } }
  );
  res.status(200).json(template);
}