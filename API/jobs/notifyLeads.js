const CronJob = require("node-cron");
const { notifyAgentTemplate } = require("../utils/email/templates/notify-agent/notifyAgentTemplate");
const { User } = require('../models/userModel');
const { Op } = require("sequelize");
const { sendTemplate } = require("../utils/email/sendTemplate");
const { MAX_INVITES } = require("../utils/constant/maxInvites");

exports.initLeadsJob = () => {
	let schedule = "* * * * *"
	if (process.env.MAIL_MODE === 'production') {
		//“At 12:00 on Monday, Wednesday, and Friday.”
		schedule = "00 12 * * 1,3,5"
	} else if (process.env.MAIL_MODE === 'development') {
		// “At minute 0 past every 12th hour.”
		schedule = "0 */12 * * *"
	}

	schedule = "* * * * *"

	const sendEmail = async ({ email, firstName, inviteUrl }) => {
		try {
			sendTemplate({
				to: email,
				subject: 'Dont forget to sign up',
			}, await notifyAgentTemplate({ name: firstName, inviteUrl }))
		} catch (e) {
			console.log("Failed to notify pedning user:", e)
		}
	}



	const scheduledJobFunction = CronJob.schedule(schedule, async () => {
		const users = await User.findAll({
			where: { status: 'pending', invitesSent: { [Op.lt]: MAX_INVITES } }
		})

		for (let i = 0; i < users.length; i++) {
			const { email, firstName, lastName, invitesSent, lastInviteDate,
				mobilePhone: phoneNo, Sponsor: sponsor } = users[i]

			const currentDate = new Date()
			let dateTreshold = new Date(lastInviteDate || new Date())

			const params = new URLSearchParams({
				email, firstName, lastName,
				phoneNo, sponsor
			})
			const inviteUrl = `${process.env.FRONTEND_DEV_URL}/#/register?` + params

			if (invitesSent === 1) {
				// 3 days after signing / 3 days after first invite
				dateTreshold.setDate(dateTreshold.getDate() + 3)
				if (dateTreshold < currentDate) {
					await sendEmail({ email, firstName, inviteUrl })
				}
			} else if (invitesSent === 2) {
				// 10 days after signing / 7 days after second invite
				dateTreshold.setDate(dateTreshold.getDate() + 7)
				if (dateTreshold < currentDate) {
					await sendEmail({ email, firstName, inviteUrl })
				}
			}
			await users[i].update({ invitesSent: invitesSent + 1, lastInviteDate: new Date() })
		}
	});

	scheduledJobFunction.start();
}