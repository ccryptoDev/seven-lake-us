const nodemailer = require('nodemailer');

exports.mailAuthFactory = () => {
	const user = process.env.MAIL_AUTH_USER
	const pass = process.env.MAIL_AUTH_PASS

	return nodemailer.createTransport({
		service: 'hotmail',
		auth: { user, pass }
	})
}