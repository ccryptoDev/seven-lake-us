const { mailAuthFactory } = require('./email/mailAuthFactory')

const sendEmail = async (options) => {
  const transporter = mailAuthFactory()
  let message = {
    from: "info@financeagents.com",

    to: options.email,
    cc: options.cc,
    subject: options.subject,
    text: options.message,
    html: options.html,
  }
  await transporter.sendMail(message)
}

module.exports = sendEmail
