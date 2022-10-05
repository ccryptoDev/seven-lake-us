const sgMail = require('@sendgrid/mail')

exports.sendTemplate = async (options, template) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	let message = {
		from: `${process.env.FROM_EMAIL}`,
		to: [options.to],
		cc: options.cc || '',
		subject: options.subject || '',
		html: template.html,
		files: template.attachments || [],
	}

	await sgMail.send(message)
}
