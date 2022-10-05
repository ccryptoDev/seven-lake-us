
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db');


// User model reference is not used because
// ownerId and targetId represent Zoho agent ids
const Note = sequelize.define('note', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	targetId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	ownerId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	content: {
		type: DataTypes.TEXT,
		defaultValue: ''
	}
})

module.exports = { Note };