const sgMail = require('@sendgrid/mail');
const sendEmail2 = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  let message = {
    from: `${process.env.FROM_EMAIL}`,
    to: options.email,
    cc: options.cc, 
    subject: options.subject,
    text: options.message,
    html: options.html,
  }

  await sgMail.send(message)
}

module.exports = sendEmail2;
