const path = require('path');
const { readTemplate } = require('../../readTemplate');

exports.sendPasswordTemplate = async (options) => {
	const templatePath = path.resolve(__dirname, './send-password.html')
	return readTemplate(options, templatePath)
}