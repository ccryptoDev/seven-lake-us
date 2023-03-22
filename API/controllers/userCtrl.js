  const {
    User
  } = require('../models/userModel')
  const { documents } = require('../models/documents');
  const bcrypt = require('bcryptjs')
  const axios = require('axios');
  const AWS = require('aws-sdk');
  const { Video } = require('../models/Video');
  var ffmpeg = require('ffmpeg');
  const { addOffice } = require('../models/addOffice');
  const { number } = require('joi');
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  exports.getAllUser = async (req, res, next) => {

    const rows = await User.findAll()
    res.status(200).json({
      status: 'success',
      users: rows,
    })

  }
  exports.getAllUserById = async (req, res, next) => {
    const particularUser = await User.findByPk(req.params.id);
    console.log('this is user' + particularUser);
    res.status(200).json({
      status: 'success',
      users: particularUser
    })
  }
  exports.createUser = async (req, res, next) => {
    req.body.createdAt = new Date();
    req.body.updatedAt = new Date();
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    req.body.password = hashPassword;
    const loan = await User.create(req.body)
    res.status(201).json({
      status: 'success'
    })
  }

  exports.getLatestAgent = async (req, res, next) => {
    const { code } = req.query;
    const config = {
      headers: {
        'Authorization': `Zoho-oauthtoken ${code}`,
      },
    }
    axios.get(`https://www.zohoapis.com/crm/v2/agents`, config)
      .then(response => {
        const agents = response.data.data;
        agents.sort((a, b) => parseFloat(b.Member_Number) - parseFloat(a.Member_Number));
        res.status(200).json({
          status: 'success',
          Member_Number: agents[0].Member_Number,
        })
      })
      .catch(error => {
        console.log(error);
      });
  }


  exports.getAgentsByEmail = async (req, res, next) => {
    let { code, email } = req.query;
    email = email.replace(' ', '%2B');
    email = email.replace(/['"]+/g, '');
    const config = {
      headers: {
        'Authorization': `Zoho-oauthtoken ${code}`,
      },
    }
    axios.get(`https://www.zohoapis.com/crm/v2/agents/search?criteria=((Email:equals:${email}))`, config)
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

  exports.updateAgents = async (req, res, next) => {
    const { code, id, member } = req.query;
    const config = {
      headers: {
        'Authorization': `Zoho-oauthtoken ${code}`,
      },
    }
    const updateParams = {
      data: [req.body],
      "formruleValue": { "mandatoryInputNeededElem": [], "lrMandatoryElem": [], "LayoutRuleHiddenElem": [] }
    }

    if (req.body?.password) {
      const hashPassword = await bcrypt.hash(req.body?.password, 10)

      const user = await User.findOne({ where: { memberNumber: member } })
      if (user) {
        await user.update({password: hashPassword})
      }
    }

    axios.put(`https://www.zohoapis.com/crm/v2/agents/${id}`, updateParams, config)
      .then((response) => {
        res.status(201).json({
          status: 'Agent details updated successfully',
          leads: response.data,
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
  
exports.updateWebsite = async (req, res) => {
  const { code, id } = req.query;
  const config = {
    headers: {
      'Authorization': `Zoho-oauthtoken ${code}`,
    },
  }

  req.body['Domain_Selected'] = true

  const updateParams = {
    data: [req.body],
    "formruleValue": { "mandatoryInputNeededElem": [], "lrMandatoryElem": [], "LayoutRuleHiddenElem": [] }
  }

  axios.put(`https://www.zohoapis.com/crm/v2/agents/${id}`, updateParams, config)
    .then((response) => {
      res.status(201).json({
        status: 'Agent details updated successfully',
        leads: response.data,
      })
    })
    .catch(error => {
      console.log(error);
    });
}

  exports.addDocuments = async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const { documentName, thumbnailName, title, category,download, price, order, tag, description } = req.body;

    let fileRef = req.files.file;
    console.log('THIS IS REQ',req.files)
    const name = fileRef.name.split('.')[0];
    const fileExtName = fileRef.name.split('.')[1];

    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
      fileRef.name = `${name}-${randomName}.${fileExtName}`;
    const bucketS3 = process.env.S3BUCKET;
    const params = {
      Bucket: bucketS3,
      Key: `${process.env.awsS3ChildFolderPath}${fileRef.name}`,
      Body: fileRef.data
    };
    s3.upload(params, async function (s3Err, uploadData) {
      if (s3Err) throw s3Err
      console.log(`File uploaded successfully at ${uploadData.Location}`);
      let thumbnailRef = req.files.thumbnail;
      console.log(thumbnailRef)
      const name = thumbnailRef.name.split('.')[0];
      console.log(name)
      const fileExtName = thumbnailRef.name.split('.')[1];
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      thumbnailRef.name = `${name}-${randomName}.${fileExtName}`;
      const thumbnailParams = {
        Bucket: bucketS3,
        Key: `${process.env.awsS3ChildFolderPath}${thumbnailRef.name}`,
        Body: thumbnailRef.data
      };
      s3.upload(thumbnailParams, async function (thumbnailErr, thumbnailData) {
        const requestParams = {
          title: title,
          category: category,
          price: price,
          download:'0',
          order: order,
          tag: tag,
          description: description,
          Document_Link: fileRef.name,
          Thumbnail_Link: thumbnailRef.name
        }
        console.log(requestParams);
        const doc = await documents.create(requestParams)
        if (!doc) {
          return res.status(400).json({
            "msg": "Invalid parameters"
          })
        } else {
          return res.status(201).json({
            "msg": "Success"
          })
        }
      })
    });
  }

exports.addOffice = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No File where added');
  }
  const { Name, AAMDefault, LandingPageDefault, WelcomeEmailTemplate, CompanyInformation, ApplyPathDomain, Address, OfficePhone, MobilePhone, SingleQuestionHeader, OfficeDescription,
    landingPageTextColor, subHeaderH2, teamspollicyAgrements, bannerBackgroundColor,
    startHereTextColor, aboutUsTextColor, footer, ctaButtonsTextolor } = req.body;
  const bulletPoints = JSON.parse(req.body.bulletPoints)
  let officeRef = req.files.OfficeLogo;
  const name = officeRef.name.split('.')[0];
  const imageExtName = officeRef.name.split('.')[1];
  const rendomName = Array(4).fill(null).map(() => Math.round(Math.random * 16).toString(16)).join();
  officeRef.name = `${name}-${rendomName}.${imageExtName}`;
  const bucketS3 = process.env.S3BUCKET;
  const params = {
    Bucket: bucketS3,
    Key: `${process.env.awsS3ChildFolderPath}${officeRef.name}`,
    Body: officeRef.data
  }
  s3.upload(params, async function (s3Err, uploadData) {
    if (s3Err) throw s3Err
    const requestParams = {
      Name: Name,
      AAMDefault: AAMDefault,
      LandingPageDefault: LandingPageDefault,
      WelcomeEmailTemplate: WelcomeEmailTemplate,
      CompanyInformation: CompanyInformation,
      ApplyPathDomain: ApplyPathDomain,
      Address: Address,
      OfficePhone: OfficePhone,
      MobilePhone: MobilePhone,
      SingleQuestionHeader: SingleQuestionHeader,
      OfficeDescription: OfficeDescription,
      OfficeLogo: officeRef.name,
      landingPageTextColor: landingPageTextColor,
      subHeaderH2: subHeaderH2,
      teamspollicyAgrements: teamspollicyAgrements,
      bannerBackgroundColor: bannerBackgroundColor,
      startHereTextColor: startHereTextColor,
      aboutUsTextColor: aboutUsTextColor,
      footer: footer,
      ctaButtonsTextolor: ctaButtonsTextolor,
      bulletPoints: bulletPoints,
    }

    const doc = await addOffice.create(requestParams);
    if (!doc) {
      return res.status(400).json({
        "msg": "Invalid parameters"
      })
    } else {
      return res.status(201).json({
        "msg": "Success"
      })
    }
  });
}

  exports.getOffice = async (req, res, next) => {
    const rows = await addOffice.findAll();
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
  exports.getSingleOffice = async (req, res, next) => {
    const rows = await addOffice.findByPk(req.params.id)
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

  // update office
exports.updateOffice = async (req, res, next) => {
  if (req.files && req.files.OfficeLogo) {
    const { Name, AAMDefault, LandingPageDefault, WelcomeEmailTemplate, CompanyInformation, ApplyPathDomain, Address, OfficePhone, MobilePhone, SingleQuestionHeader, OfficeDescription } = req.body;
    const bulletPoints = JSON.parse(req.body.bulletPoints)
    let officeRef = req.files.OfficeLogo;
    const name = officeRef.name.split('.')[0];
    const imageExtName = officeRef.name.split('.')[1];
    const rendomName = Array(4).fill(null).map(() => Math.round(Math.random * 16).toString(16)).join();
    officeRef.name = `${name}-${rendomName}.${imageExtName}`;
    const bucketS3 = process.env.S3BUCKET;
    const params = {
      Bucket: bucketS3,
      Key: `${process.env.awsS3ChildFolderPath}${officeRef.name}`,
      Body: officeRef.data
    }
    s3.upload(params, async function (s3Err, uploadData) {
      if (s3Err) throw s3Err
      console.log(`File uploaded successfully at ${uploadData.Location}`);
      const requestParams = {
        Name: Name,
        AAMDefault: AAMDefault,
        LandingPageDefault: LandingPageDefault,
        WelcomeEmailTemplate: WelcomeEmailTemplate,
        CompanyInformation: CompanyInformation,
        ApplyPathDomain: ApplyPathDomain,
        Address: Address,
        OfficePhone: OfficePhone,
        MobilePhone: MobilePhone,
        SingleQuestionHeader: SingleQuestionHeader,
        OfficeDescription: OfficeDescription,
        OfficeLogo: officeRef.name,
        bulletPoints: bulletPoints,
      }

      const doc = await addOffice.update(requestParams, { where: { id: req.params.id } });
      console.log('this is doc', doc)
      if (!doc) {
        return res.status(400).json({
          "msg": "Invalid parameters"
        })
      } else {
        return res.status(201).json({
          "msg": "Success"
        })
      }
    });
  } else {
    try {
      const bulletPoints = JSON.parse(req.body.bulletPoints)
      const data = await addOffice.update({ ...req.body, bulletPoints}, { where: { id: req.params.id } });
      res.status(200).json(data);
    }
    catch (err) {
      console.log(err.message);
    }
  }
}
exports.getDocuments = async (req, res, next) => {
  const rows = await documents.findAll()
  if (!rows) {
    return res.status(400).json({
      "message": "Invalid parameters"
    })
  } else {
    res.status(200).json({
      status: 'success',
      document: rows,
    })
  }
}
  
exports.listDocuments = async (req, res) => {
  let rows = []
  if (req.query?.category) {
    rows = await documents.findAll({ where: { category: req.query?.category } })
  } else {
    rows = await documents.findAll()
  }

  res.status(200).json(rows)
}

exports.getFiles = async (req, res, next) => {
  const bucketS3 = process.env.S3BUCKET;
  const childFoler = process.env.awsS3ChildFolderPath
  if (req.params.fileName) {
    const params = {
      Bucket: bucketS3,
      Key: `${childFoler}${req.params.fileName}`,
    };
    const object = s3.getObject(params)
    const stream = object.createReadStream()
    stream.pipe(res)
  } else {
    return res.status(400).json({
      "msg": "failed to get files"
    })
  }
}
  // get single Document for put api
  exports.getSingleDocument = async (req, res, next) => {
    console.log(req.body);
    const rows = await documents.findByPk(req.params.id)
    if (!rows) {
      return res.status(400).json({
        "message": "invalid parameters"
      })
    } else {
      res.status(200).json({
        status: 'success',
        documents: rows
      })
    }
  }
  // put api for update document
  exports.updateDocument = async (req, res, next) => {
    if (req.files && req.files.file) {

      let fileRef = req.files.file;
      const name = fileRef.name.split('.')[0];
      const fileExtName = fileRef.name.split('.')[1];
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      fileRef.name = `${name}-${randomName}.${fileExtName}`;
      const bucketS3 = process.env.S3BUCKET;
      const params = {
        Bucket: bucketS3,
        Key: `${process.env.awsS3ChildFolderPath}${fileRef.name}`,
        Body: fileRef.data
      };
      s3.upload(params, async function (s3Err, uploadData) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${uploadData.Location}`);
        req.body['Document_Link'] = fileRef.name;
        const doc = await documents.update(req.body, { where: { id: req.params.id } });
        console.log('this is doc', doc)
        if (!doc) {
          return res.status(400).json({
            "msg": "Invalid parameters"
          })
        } else {
          return res.status(201).json({
            "msg": "Success"
          })
        }
      });
    } 
    if (req.files && req.files.thumbnail) {

      let fileRef = req.files.thumbnail;
      const name = fileRef.name.split('.')[0];
      const fileExtName = fileRef.name.split('.')[1];
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      fileRef.name = `${name}-${randomName}.${fileExtName}`;
      const bucketS3 = process.env.S3BUCKET;
      const params = {
        Bucket: bucketS3,
        Key: `${process.env.awsS3ChildFolderPath}${fileRef.name}`,
        Body: fileRef.data
      };
      s3.upload(params, async function (s3Err, uploadData) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${uploadData.Location}`);
        req.body['Thumbnail_Link'] = fileRef.name;
        const doc = await documents.update(req.body, { where: { id: req.params.id } });
        console.log('this is doc', doc)
        if (!doc) {
          return res.status(400).json({
            "msg": "Invalid parameters"
          })
        } else {
          return res.status(201).json({
            "msg": "Success"
          })
        }
      });
    } else {
      try {

        const data = await documents.update(req.body, { where: { id: req.params.id } });
        console.log(data);
        res.status(200).json({
          status: 'update succesfully',
          documents: data
        });
      }
      catch (err) {
        console.log(err.message);
      }
    }
  }
  exports.DownloadDocument = async (req,res,next) =>{
    const download = req.body;
    console.log(download);
    const downloadchangasnumber = req.body.download;
    // console.log(downloadChangeNumber)
    const downloadChangeNumber = parseInt(downloadchangasnumber)
    var convertit = downloadChangeNumber + 1;
    downloads = convertit.toString();
    req.body.download = downloads
    console.log(typeof(downloads));
    const params ={
      download:downloads
    }
    console.log('this is convertit',downloads); 
    console.log('this is params '+params.download);
    const doc = await documents.update(params, { where: { id: req.params.id } });
    console.log('this is doc', doc)
    if (!doc) {
      return res.status(400).json({
        "msg": "Invalid parameters"
      })
    } else {
      return res.status(201).json({
        "msg": "Success",
        documents: doc
      })
    };
  }
  // delete single Document by Id
  exports.updateLeadDetails = async (req,res,next)=>{
    console.log(req.body);
    const { code, id } = req.query;
    const config = {
      headers: {
        'Authorization': `Zoho-oauthtoken ${code}`,
      },
    }
    const updateParams = {
      data: [req.body],
    }
    axios.put(`https://www.zohoapis.com/crm/v2/leads/${id}`, updateParams, config)
      .then((response) => {
        res.status(201).json({
          status: 'Agent details updated successfully',
          leads: response.data,
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
  exports.deleteSingleDocument = async (req, res, next) => {
    const rows = await documents.destroy({
      where: { id: req.params.id }
    })
    if (!rows) {
      return res.status(400).json({
        "message": "Server is Not working"
      })
    } else {
      res.status(200).json({
        status: 'delete success',
        document: rows
      })
    }
  }
