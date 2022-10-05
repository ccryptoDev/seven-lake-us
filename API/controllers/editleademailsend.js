const mailLead = require('../utils/editleadsMail')
const sendEmail1 = require('../utils/sendBulkEmail')

exports.EditleadsEmail = async (req, res, next) => {
  const owner = req.body;

  const email = owner.email;
  const ownerName = owner.ownerName;
  try {
    await sendEmail1({
      email,
      subject: "You've just got a new lead!",
      html:
        mailLead({
          email: email,
          ownerName: ownerName,
          Agent_First: req.body.Agent_First,
          Agent_Last: req.body.Agent_Last,
          Mobile_Phone: req.body.Mobile_Phone,
          AAM_Notes: req.body.AAM_Notes,
          leadFirstName: req.body.leadFirstName,
          Last_Name: req.body.Last_Name
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
