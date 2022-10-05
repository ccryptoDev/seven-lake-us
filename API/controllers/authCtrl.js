const { User, validateUser } = require('../models/userModel')
const { TokenModel, validateTokenModel } = require('../models/tokenModel')
const AppError = require('../utils/AppError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const getSfToken = require('../utils/sfToken')
const sendEmail = require('../utils/sendEmail')
const sendEmail1 = require('../utils/sendBulkEmail')
const sendEmail2 = require('../utils/registerMail')
const resetEmailTemplate = require('../utils/resetEmailTemplate')
const mailLead = require('../utils/LeadMail')
const mailNewUser = require('../utils/registerTemp')
const wlcmMail = require('../utils/wlcmMailTemp')
const leadNotesTemp = require('../utils/leadNotesTemp')
const { Op } = require('sequelize')
const { myCache } = require('../server')
const Joi = require('joi')
const axios = require('axios')
const { notifyOwnerTemplate } = require('../utils/email/templates/notify-owner/notifyOwnerTemplate')
const { inviteAgentTemplate } = require('../utils/email/templates/invite-agent/inviteAgentTemplate')
const { sendTemplate } = require('../utils/email/sendTemplate')
const { getZohoToken } = require('./zohoCtrl')
const { sendPasswordTemplate } = require('../utils/email/templates/send-password/send-password')
var mapAID = new Map();


function validateEmail(data) {
  const schema = Joi.object({
    email: Joi.string().max(255).trim().email(),
  })

  return schema.validate(data)
}

const signToken = (id) => {
  return jwt.sign({ id }, process.env.jwt_Secret, {
    expiresIn: process.env.jwt_Expiry,
  })
}
const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.refresh_token_secret, {
    expiresIn: process.env.refresh_token_expiry,
  })
}

exports.signup = async (req, res, next) => {
  const { firstName, lastName, email, password, name, company, mobilePhone, Website, Sponsor,
    Lead_Routing, Original_AAM, status, Office } = req.body;
  const { code } = req.query;
  const { error } = validateUser({
    firstName,
    lastName,
    email,
  })

  const headers = {
    'Authorization': `Zoho-oauthtoken ${code}`,
    'content-type': 'application/json'
  }

  const agentsURL = `https://www.zohoapis.com/crm/v2/agents`
  const response = await axios.get(agentsURL, { headers, params: { per_page: 1 } })
  const latestAgent = response.data.data[0];
  let memberNumber = Number.parseInt(latestAgent['Member_Number']) + 1
  memberNumber = memberNumber.toString()

  if (error) {
    return next(new AppError(error.details[0].message, 422))
  }
  
  const checkEmail = await User.findOne({ where: { email, status: { [Op.not]: 'pending'}  }})
  if (checkEmail) {
    return res.status(400).json({error: 'Email is already taken'})
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const oldPasswords = [hashPassword]
  const passwordExpiresOn = Date.now() + 90 * 24 * 60 * 60 * 1000

  const userParams = {
    firstName,
    lastName,
    email,
    mobilePhone,
    password: hashPassword,
    oldPasswords,
    passwordExpiresOn,
    memberNumber,
    Website,
    status: 'active'
  }

  // User are created while invited by another agent
  // check and update them in case entity exist;
  // create new record otherwise;
  let user = await User.findOne({ where: { email } })
  if (user) {
    user = await user.update(userParams)
  } else {
    user = await User.create(userParams)
  }
  
  const params = JSON.stringify({
    data: [{
      Company: company,
      Name: name,
      Office: Office || '',
      First_Name: firstName,
      Last_Name: lastName,
      Email: email,
      Member_Number: memberNumber,
      Website: `${Website}/${memberNumber}`,
      Sponsor: Sponsor.toString(),
      Mobile_Phone: mobilePhone || '',
      Lead_Routing: Lead_Routing,
      Original_AAM: Original_AAM,
      Account_Type: 'Standard',
      status: status
    }]
  })

  axios.post('https://www.zohoapis.com/crm/v2/agents', params, { headers })
    .then((response) => {
      res.status(201).json({
        status: 'success',
        msg: 'Registration successful',
        userId: user.dataValues.id,
      })
    })
}

// List of users that are not registered:
// status is null or inactive
exports.listInactive = async (req, res) => {
  const users = await User.findAll({
    where: { status: 'pending' }
  })
  res.status(200).json(users)
}

exports.getLeads = async (req, res, next) => {
  try {
    await sendEmail1({
      email: req.query.LeadOwner,
      subject: "You've just got a new lead!",
      html: mailLead({
        LeadOwner: req.query.LeadOwner,
        firstName: req.query.FirstName,
        lastname: req.query.LastName,
        leadEmail: req.query.Email,
        leadAAM: req.query.Email,
        phoneNo: req.query.Phone
      }),
    })

    res.status(200).json({
      status: 'success',
      data: 'Email has been sent successfully. If it doesn’t appear within a few minutes, check spam folder.',
    })
  } catch (error) {
    return next(new AppError(error, 500))
  }
}

exports.updateSignup = async (req, res, next) => {
  const gettingStatus = await User.update(req.body, { where: { id: req.params.id } })
  res.status(200).json({
    status: 'update succesfully',
    gettingStatus: gettingStatus
  });
}

exports.login = async (req, res, next) => {
  req.body.email = req.body?.email?.toLowerCase()
  const { email, password } = req.body
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400))
  }
  const { error } = validateEmail({ email })
  if (error) {
    return next(new AppError(`${error.details[0].message}`, 422))
  }

  const exUser = await User.scope('withPassword').findOne({
    where: { email },
  })

  if (!exUser) {
    return next(new AppError('Invalid email id and password. Please try again', 400))
  }

  if (exUser?.resetLockOutCounter) {
    if (exUser.resetLockOutCounter > Date.now()) {
      return next(new AppError('please try after some time', 400))
    }
  }

  if (exUser.loginAttempts === 5) {
    exUser.resetLockOutCounter = Date.now() + 10 * 60 * 1000
    exUser.loginAttempts = 0
    await exUser.save()
    return next(new AppError('please try after some time', 400))
  }

  const isMatch = await bcrypt.compare(password, exUser.password)

  if (!isMatch) {
    exUser.loginAttempts = exUser.loginAttempts + 1
    await exUser.save()
    return next(new AppError('Incorrect password. Please try again', 400))
  }

  if (exUser?.passwordExpiresOn) {
    if (exUser.passwordExpiresOn < Date.now()) {
      const token = signToken(exUser.id)
      return res.status(200).json({
        status: 'success',
        msg: 'Your password expired! Please reset your password',
        forceResetPassword: true,
        token,
      })
    }
  }

  exUser.loginAttempts = 0
  exUser.resetLockOutCounter = null
  await exUser.save()

  const accessToken = signToken(exUser.id)
  const refreshToken = signRefreshToken(exUser.id)

  const exRefreshTk = await TokenModel.findOne({ where: { userId: exUser.id } })
  if (exRefreshTk) {
    exRefreshTk.rfToken = refreshToken
    await exRefreshTk.save()
  } else {
    await TokenModel.create({ rfToken: refreshToken, userId: exUser.id })
  }

  let cookieName = 'rt';

  res.cookie(cookieName, refreshToken, {
    maxAge: 20 * 60 * 1000,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  })

  res.status(200).json({
    status: 'success',
    token: accessToken,
    email: email
  })
}

exports.refresh = async (req, res, next) => {
  const { type } = req.body
  const { rt, st } = req.cookies
  if (type === 's' && !st) {
    return next(new AppError('Invalid Login', 401))
  } else if (!rt) {
    return next(new AppError('Invalid Login', 401))
  }

  const cookieRefreshToken = type === 's' ? st : rt
  let decoded
  try {
    decoded = await jwt.verify(
      cookieRefreshToken,
      process.env.refresh_token_secret
    )
  } catch (error) {
    return next(new AppError('Invalid Login', 401))
  }

  const userId = req.user.id

  if (userId !== decoded.id) {
    return next(new AppError('Invalid Login', 401))
  }

  const exRt = await TokenModel.findOne({
    where: {
      userId: decoded.id,
      rfToken: cookieRefreshToken,
    },
  })

  if (!exRt) {
    return next(new AppError('Invalid Login', 401))
  }

  const accessToken = signToken(decoded.id)
  const refreshToken = signRefreshToken(decoded.id)

  exRt.rfToken = refreshToken
  await exRt.save()

  const cookieName = type === 's' ? 'st' : 'rt'

  res.cookie(cookieName, refreshToken, {
    maxAge: 20 * 60 * 1000,
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'none',
  })
  res.status(200).json({
    status: 'success',
    token: accessToken,
  })
}

exports.logout = async (req, res, next) => {
  const { type } = req.body
  const { rt, st } = req.cookies
  if (type === 's' && !st) {
    return next(new AppError('Invalid Login', 401))
  } else if (type !== 's' && !rt) {
    return next(new AppError('Invalid Login', 401))
  }

  const cookieRefreshToken = type === 's' ? st : rt

  const tk = await TokenModel.destroy({
    where: {
      rfToken: cookieRefreshToken,
      userId: req.user.id,
    },
  })

  if (!tk) {
    return next(new AppError('Invalid Logout', 401))
  }
  const cookieName = type === 's' ? 'st' : 'rt'
  res.clearCookie(cookieName)
  res.status(200).json({ status: 'success', msg: 'Logout Successfully' })
}

exports.resetPassword = async (req, res, next) => {
  const { newPassword, userId } = req.body

  if (!newPassword) {
    return next(new AppError('Please provide your details', 400))
  }

  if (!userId) {
    return next(new AppError('Invalid user', 400))
  }

  if (newPassword.length < 8) {
    return next(
      new AppError('Password length must be greater than or equal to 8', 400)
    )
  }

  const passRegex = new RegExp(
    '((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))'
  )

  if (!passRegex.test(newPassword)) {
    return next(
      new AppError(
        'Passwords must be a mix of uppercase letters lowercase letters ,numbers and special characters',
        400
      )
    )
  }

  const exUser = await User.scope('withPassword').findByPk(userId)

  if (!exUser) {
    return next(new AppError('User not found!', 404))
  }

  if (exUser?.oldPasswords) {
    for (const pass of exUser.oldPasswords) {
      const isMatch = await bcrypt.compare(newPassword, pass)
      if (isMatch) {
        return next(
          new AppError(
            'You have already used this password! Please provide a new password',
            400
          )
        )
      }
    }
  }

  // if (exUser?.oldPasswords?.length >= 2) {
  //   if (!curPassword) {
  //     return next(new AppError('Please provide your details', 400))
  //   }
  //   const isMatch = await bcrypt.compare(curPassword, exUser.password)
  //   if (!isMatch) {
  //     return next(new AppError('Invalid Credentials', 400))
  //   }
  // }

  const hashPassword = await bcrypt.hash(newPassword, 10)

  exUser.password = hashPassword

  if (exUser?.oldPasswords?.length > 10) {
    exUser.oldPasswords.pop()
  }

  if (exUser?.oldPasswords) {
    exUser.oldPasswords = [hashPassword, ...exUser?.oldPasswords]
  }
  exUser.passwordExpiresOn = Date.now() + 90 * 24 * 60 * 60 * 1000
  await exUser.save()

  res.status(200).json({
    status: 'success',
    msg: 'Password Reset Done',
  })
}

exports.sfTokenForFrontEnd = async (req, res, next) => {
  if (!myCache.has('sfToken')) {
    const { token, tokenExpiry } = await getSfToken(req, res, next)
    if (token) {
      myCache.set('sfToken', token, tokenExpiry)
    } else {
      myCache.del('sfToken')
      return next(new AppError('Error in getting token', 500))
    }
  }

  res.status(200).json({
    status: 'success',
    sfToken: myCache.get('sfToken'),
  })
  // const { token, tokenExpiry } = await getSfToken(req, res, next)
  // if (token) {
  //   myCache.set('sfToken', token, tokenExpiry)
  //   res.status(200).json({
  //     status: 'success',
  //     sfToken: token,
  //   })
  // } else {
  //   myCache.del('sfToken')
  //   res.status(400).json({
  //     status: 'fail',
  //     msg: 'Error in getting token',
  //   })
  // }
}

exports.sendPassword = async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    return next(new AppError('email is required', 400))
  }

  let user = await User.findOne({ where: { email } }) // DB user
  const token = (await getZohoToken()).access_token
  const config = {
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
    },
  }
  const password = Math.random().toString(36).slice(2, 8)
  const hashPassword = await bcrypt.hash(password, 10)
  const passwordExpiresOn = Date.now() + 90 * 24 * 60 * 60 * 1000
  
  const agentsURL = `https://www.zohoapis.com/crm/v2/agents/search?criteria=((Email:equals:${email}))`
  const response = await axios.get(agentsURL, config)
  const agent = response.data.data?.[0] // CRM user
  if (!agent && !user) { 
    return next(new AppError('user not found', 404))
  } else if (!user) {
    const params = {
      firstName: agent['Agent_First'] ? agent['Agent_First'].replace(/[ ]/g, ''): '',
      lastName: agent['Agent_Last'] ? agent['Agent_Last'].replace(/[ ]/g, '') : '',
      email: agent['Email'],
      mobilePhone: agent['Mobile_Phone'],
      password: hashPassword,
      passwordExpiresOn,
      memberNumber: agent['Member_Number'],
      Website: agent['Website'] ? agent['Website'].split('/')[0] : '', // domain/member_number -> domain
      status: 'active'
    }
    user = await User.create(params)
  } else {
    await user.update({
      password: hashPassword, passwordExpiresOn
    })
  }
  
    await sendTemplate({
      to: email,
      subject: "Password reset"
  }, await sendPasswordTemplate({
    subject: "Password reset",
    userName: agent['Agent_First'],
    password,
  }))

  res.status(200).json({ data: 'email sent' })
}

exports.forgotPasswordMail = async (req, res, next) => {
  const { email } = req.body

  if (!email) {
    return next(new AppError('Please provide your email', 400))
  }
  const { error } = validateEmail({ email })
  if (error) {
    return next(new AppError(`${error.details[0].message}`, 422))
  }

  const exUser = await User.findOne({
    where: {
      email,
    },
  })

  // if (!exUser) {
  //   return res.status(200).json({
  //     status: 'success',
  //     data: 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
  //   })
  // }

  const resetToken = crypto.randomBytes(20).toString('hex')
  const resetTokenBefore = crypto.randomBytes(40).toString('hex')
  const resetTokenAfter = crypto.randomBytes(20).toString('hex')

  const completeToken = `${resetTokenBefore.toUpperCase()}-${resetToken.toUpperCase()}-${resetTokenAfter.toUpperCase()}`

  exUser.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  exUser.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  await exUser.save()

  const resetUrl = `${process.env.FRONTEND_DEV_URL}/#/changepassword/${exUser?.id}`

  const message = `We're sending you this email because you requested a password reset.
  `

  try {
    await sendEmail({
      email,
      subject: '[Finance Agents] Reset Password',
      html: resetEmailTemplate({
        firstName: exUser?.firstName || 'there',
        msg: message,
        resetLink: resetUrl,
      }),
    })

    res.status(200).json({
      status: 'success',
      data: 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
    })
  } catch (error) {
    console.log(error.response.body.errors)
    exUser.resetPasswordToken = null
    exUser.resetPasswordExpire = null
    await exUser.save()
    return next(new AppError('Email Could not Sent', 500))
  }
}

// invite agent 
exports.inviteAgentEmail = async (req, res, next) => {
  const body = req.body;
  const office = body?.office || `Office`
  const { sponsor, firstName, email, lastName, phoneNumber, agentName } = body

  let agent = await User.findOne({ where: { email } })
  if (agent) {
    res.status(409).json({ "error": "Agent is already invited" })
    return
  }

  agent = await User.create({
    email,
    firstName,
    lastName,
    status: 'pending',
    mobilePhone: phoneNumber,
    Sponsor: sponsor,
  })

  const params = new URLSearchParams({
    email, firstName, lastName, phoneNo: phoneNumber, sponsor
  })
  const inviteUrl = `${process.env.FRONTEND_DEV_URL}/#/register?` + params

  const subject = 'Inviting you on Finance Agent Portal'
  await sendTemplate({
    to: email,
    subject,
  }, await inviteAgentTemplate({
    firstName,
    agentName: agentName,
    inviteUrl: inviteUrl,
    office: office
  }))


  res.status(200).json({
    status: 'success',
    data: 'Email has been sent successfully. If it doesn’t appear within a few minutes, check spam folder.',
  })
}

// Input leads Email
exports.leadsEmail = async (req, res, next) => {
  const leadDetails = req.body.leads;

  const email = leadDetails.Email;

  if (!email) {
    return next(new AppError('Please provide your email', 400))
  }
  await sendEmail1({
    email,
    subject: "You've just got a new lead!",
    html: mailLead({
      LeadOwner: req.body.LeadOwner,
      Agent_First: req.body.Agent_First,
      Agent_Last: req.body.Agent_Last,
      Description: leadDetails.Description,
      firstName: leadDetails.First_Name,
      lastname: leadDetails.Last_Name,
      leadEmail: leadDetails.Email,
      leadSource: leadDetails.Email,
      Member: leadDetails.Member,
      leadSponsor: leadDetails.Email,
      leadUrl: leadDetails.URL,
      leadAAM: leadDetails.Email,
      SourceNotes: leadDetails.Email,
      LeadNotes: leadDetails.Description,
      phoneNo: leadDetails.Phone
    }),
  })

  res.status(200).json({
    status: 'success',
    data: 'Email has been sent successfully. If it doesn’t appear within a few minutes, check spam folder.',
  })
}
// input leads Email

// user register mail

exports.userRegisterEmail = async (req, res, next) => {
  const UserEmail = req.body;
  let key= Math.random();
  const url= `${process.env.FRONTEND_URL}/api/auth/verifyEmail/`+key+`?email=${UserEmail.email}`;
  mapAID.set(key,false);


  let email, userName;

    email = UserEmail.email;
    
    if (!email) {
      return next(new AppError('Please provide your email', 400))
    }

    try {
      await sendEmail2({
        email,
        subject: "You've register successfully!",
        html: mailNewUser({
           uniqueString:url,
          firstName: UserEmail.firstName,
          lastName: UserEmail.lastName,
          phone: UserEmail.mobilePhone,
          email:UserEmail.email,
          Website:UserEmail.Website,
          Office: UserEmail?.Office || 'Office'
        }),
      })

      res.status(200).json({
        status: 'success',
        data: 'Email has been sent successfully. If it doesn’t appear within a few minutes, check spam folder.',
      })
    } catch (error) {
      return next(new AppError(error, 500))
    }
  }

// user registerb mail

// 

exports.varifyEmail = async (req, res, next) => {

  console.log(req.params);
  console.log(req.query);

   let email = req.query;
  

  try {
    await sendEmail2({
      email,
      subject: "You've register successfully!",
      html: wlcmMail({ 
      }),
    })

    res.status(200).json({
      status: 'success',
      data: 'Email Registerd successfully.',
    })
  } catch (error) {
    return next(new AppError(error, 500))
  }
  }


exports.emailAgentOnwer = async (req, res, next) => {
  const UserEmail = req.body;
  const email = UserEmail.mailId;

  if (!email) {
    return next(new AppError('Please provide your email', 400))
  }

  const subject = "Agent registered successfully"
  await sendTemplate({
    to: email,
    subject
  }, await notifyOwnerTemplate({
    subject,
    ownerName: req.body.ownerName,
    firstName: req.body.details.firstName,
    lastName: req.body.details.lastName,
    name: req.body.details.name,
    phone: req.body.details.mobilePhone || '',
    email: req.body.details.email,
  }))

  res.status(200).json({
    status: 'success',
    data: 'Email has been sent successfully. If it doesn’t appear within a few minutes, check spam folder.',
  })
}


// ḷead notes add

exports.leadNotes = async (req, res, next) => {
  console.log(req.body);
  
  const UserEmail =  req.body;

  let email, userName;

    email = UserEmail.email;
    
    if (!email) {
      return next(new AppError('Please provide your email', 400))
    }

    try {
      await sendEmail2({
        email,
        subject: "You've register successfully!",
        html: leadNotesTemp({
          sub:'Agent register successfully',
          first_name: UserEmail.details.First_Name,
          last_name: UserEmail.details.Last_Name,
          comments: UserEmail.details.comments,
        }),
      })

      res.status(200).json({
        status: 'success',
        data: 'Email has been sent successfully. If it doesn’t appear within a few minutes, check spam folder.',
      })
    } catch (error) {
      return next(new AppError('Email Could not Sent', 500))
    }
  }



// lead notes added

exports.forgotResetPassword = async (req, res, next) => {
  const resettoken = req.params?.resettoken?.toLowerCase()
  if (!resettoken) {
    return next(new AppError('Invalid url', 400))
  }
  const { password } = req.body
  if (!password) {
    return next(new AppError('Please provide password', 400))
  }

  if (password.length < 8) {
    return next(
      new AppError('Password length must be greater than or equal to 8', 400)
    )
  }

  const passRegex = new RegExp(
    '((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))'
  )

  if (!passRegex.test(password)) {
    return next(
      new AppError(
        'Passwords must be a mix of uppercase letters lowercase letters ,numbers and special characters',
        400
      )
    )
  }

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest('hex')

  const exUser = await User.scope('withPassword').findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: {
        [Op.gt]: Date.now(),
      },
    },
  })

  if (!exUser) {
    return next(new AppError('Invalid Email Link', 400))
  }

  if (exUser?.oldPasswords) {
    for (const pass of exUser.oldPasswords) {
      const isMatch = await bcrypt.compare(password, pass)
      if (isMatch) {
        return next(
          new AppError(
            'You have already used this password! Please provide a new password',
            400
          )
        )
      }
    }
  }

  const hashPassword = await bcrypt.hash(password, 10)

  exUser.password = hashPassword
  exUser.resetPasswordToken = null
  exUser.resetPasswordExpire = null

  if (exUser?.oldPasswords?.length > 10) {
    exUser.oldPasswords.pop()
  }

  if (exUser?.oldPasswords) {
    exUser.oldPasswords = [hashPassword, ...exUser?.oldPasswords]
  }
  exUser.passwordExpiresOn = Date.now() + 90 * 24 * 60 * 60 * 1000
  await exUser.save()

  res.status(200).json({
    status: 'success',
    msg: 'Password Reset Successfully',
  })
}
