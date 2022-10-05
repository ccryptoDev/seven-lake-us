const ejs = require('ejs')
const juice = require('juice');
const path = require('path');
const fs = require('fs')

exports.readTemplate = async (options, filename) => {
	const templateString = await ejs.renderFile(filename, options)
	const inlinedString = juice(templateString)

	return {
		html: inlinedString,
		attachments: [{
			filename: 'image.png',
			contentType: 'image/png',
			contentId: 'logo',
			content: fs.readFileSync(path.resolve(__dirname, '../../assets/logo.png'), 'base64'),
		}]
	}
}