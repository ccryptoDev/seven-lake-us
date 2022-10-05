
const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const Joi = require('joi')
const addOffice = sequelize.define(
    'addOffice',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        Name: {
            type: DataTypes.STRING,
        },
        AAMDefault: {
            type: DataTypes.STRING,
        },
        LandingPageDefault: {
            type: DataTypes.STRING,
        },
        WelcomeEmailTemplate: {
            type: DataTypes.STRING,
        },
        CompanyInformation: {
            type: DataTypes.STRING,
        },
        ApplyPathDomain: {
            type: DataTypes.STRING,
        },
        Address: {
            type: DataTypes.STRING,
        },
        OfficePhone: {
            type: DataTypes.STRING,
        },
        MobilePhone: {
            type: DataTypes.STRING,
        },
        SingleQuestionHeader: {
            type: DataTypes.STRING,
        },
        OfficeDescription: {
            type: DataTypes.STRING,
        },
        OfficeLogo: {
            type: DataTypes.STRING,
        },
        landingPageTextColor:{
            type:DataTypes.STRING,
        },
        subHeaderH2:{
            type:DataTypes.STRING,
        },
        teamspollicyAgrements:{
            type:DataTypes.STRING,
        },
        bannerBackgroundColor:{
            type:DataTypes.STRING,
        },
        startHereTextColor:{
            type:DataTypes.STRING,
        },
        aboutUsTextColor:{
            type:DataTypes.STRING,
        },
        footer:{
            type:DataTypes.STRING,
        },
        ctaButtonsTextolor:{
            type:DataTypes.STRING,
        },
        bulletPoints: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        }
    })
module.exports = {
    addOffice
}