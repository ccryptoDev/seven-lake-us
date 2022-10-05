const path = require('path');
const { readTemplate } = require('../../readTemplate');
	
exports.notifyAgentTemplate = async (options) => {
	const templatePath = path.resolve(__dirname, './notify-agent.html')
	return readTemplate(options, templatePath)
}