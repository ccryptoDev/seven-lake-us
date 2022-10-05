const path = require('path');
const { readTemplate } = require('../../readTemplate');

exports.inviteAgentTemplate = async (options) => {
	const templatePath = path.resolve(__dirname, './invite-agent.html')
	return readTemplate(options, templatePath)
}