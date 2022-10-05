
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Video = sequelize.define(
	'Video',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
		},
		category: {
			type: DataTypes.STRING,
		},
		price: {
			type: DataTypes.STRING,
		},
		order: {
			type: DataTypes.STRING,
		},
		tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			defaultValue: []
		},
		description: {
			type: DataTypes.STRING,
		},
		videoName: {
			type: DataTypes.STRING,
		},
		convertedName: {
			type: DataTypes.STRING,
		},
		thumbnailName: {
			type: DataTypes.STRING,
		},
	})
module.exports = {
	Video
}