const axios = require("axios");
const FormData = require("form-data");
const AWS = require("aws-sdk");
const { Note } = require("../models/Note");
const { messageAgentTemplate } = require("../utils/email/templates/message-agent/messageAgentTemplate");
const { sendTemplate } = require('../utils/email/sendTemplate');
const { readToken, setToken } = require("../utils/redisClient");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.getZohoToken = async () => {
  async function fetchToken() {
    const url = 'https://accounts.zoho.com/oauth/v2/token?'
    const params = {
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH_TOKEN,
      client_id: process.env.client_id,
      client_secret: process.env.client_secret
    }
    const response = await axios.post(url, null, { params })
    return response
  }

  async function getToken() {
    // seconds substracted from token expires in value
    // to avoid fetch lag between API's and client
    const DELAY_CORRECTION = 30

    let data = (await fetchToken()).data
    if (data.access_token && data.expires_in) {
      data.expires_in -= DELAY_CORRECTION
      await setToken(data?.access_token, data?.expires_in)
      return data
    } else {
      throw new Error('Failed to authorize')
    }
  }

  // minimal worth sending time in seconds
  // if number is smaller - generate new
  const MIN_TOKEN_LIFE = 60

  let data = await readToken()
  if (data.access_token && data.expires_in) {
    const expiresDate = new Date(data.expires_in)
    const currentDate = new Date()

    let delta = expiresDate - currentDate // difference in miliseconds
    delta = Number.parseInt(delta / 1000) // difference in seconds

    if (currentDate > expiresDate || delta < MIN_TOKEN_LIFE) {
      data = await getToken()
    } else {
      data.expires_in = delta
    }
  } else {
    data = await getToken()
  }
  return data
}

exports.zohoToken = async (req, res) => {
  const data = await this.getZohoToken()

  return res.status(200).json({
    status: "success",
    tokenResponse: data,
  });
};

exports.zohoLeads = async (req, res) => {
  const { code } = req.query;
  const params = new URLSearchParams({
    fields: [
      "Description",
      "Amount_Requested",
      "Lead_Status",
      "Business_Age",
      "Credit_Score",
      "Average_Bank_Balance",
      "Lead_Source",
      "Email",
      "Exchange_Rate",
      "Modified_Time",
      "$approval_state",
      "URL",
      "Phone",
      "Member",
      "First_Name",
      "Last_Name",
    ]
  });
  const config = {
    headers: {
      Authorization: `Zoho-oauthtoken ${code}`,
    },
  };
  const response = await axios.get(`https://www.zohoapis.com/crm/v2/leads?${params}`, config)
  res.status(200).json(response.data.data);
};

exports.zohoAddLeads = async (req, res, next) => {
  const { code } = req.query;
  const params = JSON.stringify({
    data: [req.body],
    trigger: ["approval", "workflow", "blueprint"],
  });
  const config = {
    headers: {
      Authorization: `Zoho-oauthtoken ${code}`,
      "content-type": "application/json",
    },
  };
  axios
    .post("https://www.zohoapis.com/crm/v2/leads", params, config)
    .then((leadsResponse) => {
      setTimeout(() => {
        const updateParams = {
          data: [{ Member: req.body.Member }],
          formruleValue: {
            mandatoryInputNeededElem: [],
            lrMandatoryElem: [],
            LayoutRuleHiddenElem: [],
          },
        };
        // console.log(`${leadsResponse.data.data[0].details.id}`)
        axios
          .put(
            `https://www.zohoapis.com/crm/v2/leads/${leadsResponse.data.data[0].details.id}`,
            updateParams,
            config
          )
          .then((response) => {
            res.status(201).json({
              status: "leads inserted successfully",
              leads: response.data,
            });
          })
          .catch((error) => {
            // console.log(error);
          });
      }, 1000);
    })
    .catch((error) => {
      // console.log(error);
    });
};

exports.zohoAgents = async (req, res, next) => {
  const { code } = req.query;
  const config = {
    headers: {
      Authorization: `Zoho-oauthtoken ${code}`,
    },
  };
  axios
    .get(`https://www.zohoapis.com/crm/v2/agents`, config)
    .then((response) => {
      const agents = response.data.data;
      res.status(200).json({
        status: "success",
        agents: agents,
      });
    })
    .catch((error) => {
      // console.log(error);
    });
};

exports.getAgentsByMemberNumber = async (req, res, next) => {
  const { code, Member_Number } = req.query;
  const config = {
    headers: {
      Authorization: `Zoho-oauthtoken ${code}`,
    },
  };
  axios
    .get(
      `https://www.zohoapis.com/crm/v2/agents/search?criteria=((Member_Number:equals:${Member_Number}))`,
      config
    )
    .then((agentsResponse) => {
      res.status(200).json({
        status: "success",
        agent: agentsResponse.data.data,
      });
    })
    .catch((error) => {
      // console.log(error);
    });
};
exports.gettingOffice = async (req, res, next) => {
  const { code } = req.query;
  const config = {
    headers: {
      Authorization: `Zoho-oauthtoken ${code}`,
    },
  };
  axios
    .get(
      `https://www.zohoapis.com/crm/v2/agents/search?criteria=((Account_Type:equals:Office))`,
      config
    )
    .then((officeData) => {
      // console.log('this is office',officeData)
      // console.log('this is office 111',officeData.data)
      // console.log('this is office 222',officeData.data.data);
      const officeDataArray = [];

      officeData.data.data.forEach((element) => {
        if (element.Office != null) {
          let findingOffice = element.Office;
          // console.log(findingOffice)
          officeDataArray.push(findingOffice);
        }
      });
      res.status(200).json({
        status: "success",
        officeData: officeDataArray,
      });
    })
    .catch((error) => {
      // console.log(error);
    });
};

exports.getInvitedAgents = async (req, res, next) => {
  const { code, member } = req.query;
  const config = {
    headers: {
      Authorization: `Zoho-oauthtoken ${code}`,
    },
  };
  axios
    .get(
      `https://www.zohoapis.com/crm/v2/agents/search?criteria=((Sponsor:equals:${member}))`,
      config
    )
    .then((agentsResponse) => {
      res.status(200).json({
        status: "success",
        agents: agentsResponse.data.data,
      });
    })
};

exports.updateNote = async (req, res) => {
  const { userId, targetId } = req.body
  const records = req.body.records || []

  if (!userId) {
    throw new Error("userId is missing")
  } else if (!targetId) {
    throw new Error("targetId is missing")
  }


  const noteBody = { targetId, ownerId: userId }
  let note = await Note.findOne({ where: noteBody })
  if (!note) {
    note = await Note.create({ ...noteBody, records })
  } else {
    await note.update({ records })
  }

  res.status(200).json(note)
}

exports.messageAgent = async (req, res) => {
  const { userId, targetId, message } = req.body

  if (!userId) {
    throw new Error("agentId is missing")
  } else if (!targetId) {
    throw new Error("targetId is missing")
  } if (!message) {
    throw new Error("message should not be empty")
  }

  const AGENT_URL = 'https://www.zohoapis.com/crm/v2/agents/search'
  const config = {
    headers: { Authorization: `Zoho-oauthtoken ${req.query.code}` }
  }

  let owner = await axios.get(`${AGENT_URL}?criteria=((id:equals:${userId}))`, config)
  let agent = await axios.get(`${AGENT_URL}?criteria=((id:equals:${targetId}))`, config)
  if (!owner?.data?.data?.[0]) {
    throw new error("User not found")
  }
  if (!agent?.data?.data?.[0]) {
    throw new error("Agent not found")
  }
  owner = owner.data.data[0]
  agent = agent.data.data[0]

  await sendTemplate({
    to: agent.Email,
    subject: 'New message from your sponsor'
  }, await messageAgentTemplate({
    agentName: agent.Name,
    ownerName: owner.Name,
    message: message
  }))
  
  res.status(200).json({
    status: "message sent",
  });
}

exports.getTeamAgents = async (req, res) => {
  const AGENTS_URL = 'https://www.zohoapis.com/crm/v2/agents/search'
  const LEADS_URL = 'https://www.zohoapis.com/crm/v2/leads/search'

  const { code, member, userId } = req.query;
  const config = {
    headers: { Authorization: `Zoho-oauthtoken ${code}` }
  };

  const response = await axios.get(
    `${AGENTS_URL}?criteria=((Sponsor:equals:${member}))`, config
  )

  const agents = response?.data?.data || []

  for (let agent of agents) {
    const noteBody = { targetId: agent.id, ownerId: userId }
    let note = await Note.findOne({ where: noteBody, raw: true })
    if (!note) {
      note = await Note.create(noteBody)
    }

    const memberId = agent.Member_Number
    const leadsResponse = await axios.get(
      `${LEADS_URL}?criteria=((Member:equals:${memberId}))`,
      config
    )

    agent["notes"] = note.records
    agent["children"] = leadsResponse.data.data || [];
  };

  res.status(200).json({
    status: "success",
    team: agents,
  });
};

exports.zohoAddAgentsFile = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  const { code, AgentId } = req.query;
  let fileRef = req.files.file;
  const name = fileRef.name.split(".")[0];
  const fileExtName = fileRef.name.split(".")[1];
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join("");
  fileRef.name = `${name}-${randomName}.${fileExtName}`;
  const bucketS3 = process.env.S3BUCKET;
  const params = {
    Bucket: bucketS3,
    Key: `${process.env.awsS3ChildFolderPath}${fileRef.name}`,
    Body: fileRef.data,
  };
  s3.upload(params, async function (s3Err, uploadData) {
    if (s3Err) throw s3Err;
    // console.log(`File uploaded successfully at ${uploadData.Location}`);
    const fileParams = {
      Bucket: bucketS3,
      Key: `${process.env.awsS3ChildFolderPath}${fileRef.name}`,
    };
    s3.getObject(fileParams, function (err, data) {
      if (err) {
        // cannot get file, err = AWS error response,
        // return json to client
        return {
          success: false,
          error: err,
        };
      } else {
        //sets correct header (fixes your issue )
        //if all is fine, bucket and file exist, it will return file to client
        const stream = s3.getObject(fileParams).createReadStream();
        let form = new FormData();
        form.append("file", stream, fileRef.name);
        const formConfig = {
          headers: {
            ...form.getHeaders(),
            Authorization: `Zoho-oauthtoken ${code}`,
          },
        };
        axios
          .post(
            `https://www.zohoapis.com/crm/v2/agents/${AgentId}/Attachments`,
            form,
            formConfig
          )
          .then((fileres) => {
            res.status(201).json({
              status: "file inserted successfully",
              file: fileres.data,
            });
          })
          .catch((error) => {
            // console.log(error.response.data)
          });
      }
    });
  });
};
