const path = require('path');
const { readTemplate } = require('../../readTemplate');

exports.notifyOwnerTemplate = async (options) => {
	const templatePath = path.resolve(__dirname, './notify-owner.html')
	return readTemplate(options, templatePath)
}