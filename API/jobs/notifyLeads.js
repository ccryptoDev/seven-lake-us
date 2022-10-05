const CronJob = require("node-cron");
const { notifyAgentTemplate } = require("../utils/email/templates/notify-agent/notifyAgentTemplate");
const { User } = require('../models/userModel');
const { sendTemplate } = require("../utils/email/sendTemplate");

exports.initLeadsJob = () => {
	let schedule = "* * * * *"
	if (process.env.MAIL_MODE === 'production') {
		//“At 12:00 on Monday, Wednesday, and Friday.”
		schedule = "00 12 * * 1,3,5"
	} else if (process.env.MAIL_MODE === 'development') {
		// “At minute 0 past every 12th hour.”
		schedule = "0 */12 * * *"
	}


	const scheduledJobFunction = CronJob.schedule(schedule, async () => {
		const users = await User.findAll({
			where: { status: 'pending' }
		})

		for (let i = 0; i < users.length; i++) {
			const { email, firstName, lastName,
				mobilePhone: phoneNo, Sponsor: sponsor } = users[i]
			const params = new URLSearchParams({
				email, firstName, lastName,
				phoneNo, sponsor
			})
			const inviteUrl = `${process.env.FRONTEND_DEV_URL}/#/register?` + params
			try {
				sendTemplate({
					to: email,
					subject: 'Dont forget to sign up',
				}, await notifyAgentTemplate({ name: firstName, inviteUrl }))
			} catch (e) {
				console.log("Failed to notify pedning user:", e)
			}
		}
	});

	scheduledJobFunction.start();
}