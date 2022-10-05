const path = require('path');
const { readTemplate } = require('../../readTemplate');

exports.messageAgentTemplate = async (options) => {
	const templatePath = path.resolve(__dirname, './message-agent.html')
	return readTemplate(options, templatePath)
}