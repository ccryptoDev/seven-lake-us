const { S3Client, PutObjectTaggingCommand } = require("@aws-sdk/client-s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');

function s3Client() {
	return new S3Client({
		region: process.env.AWS_REGION,
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	});
}

const uploadFile = async (file) => {
	const s3 = s3Client();
	const [name, ext] = file.name.split('.')
	file.name = `${name}-${uuidv4()}.${ext}`
	const response = await s3.send(new PutObjectCommand({
		Bucket: process.env.S3BUCKET,
		Key: `${process.env.awsS3ChildFolderPath}${file.name}`,
		Body: file.data
	}))
	return { file, response }
}

const tagFile = async (key, tags) => {
	const s3 = s3Client()
	const response = await s3.send(new PutObjectTaggingCommand({
		Bucket: process.env.S3BUCKET,
		Key: `${process.env.awsS3ChildFolderPath}${key}`,
		Tagging: { TagSet: tags }
	}))
	return { response }
}

const getFileUrl = async (fileName) => {
	const s3 = s3Client();
	const Bucket = process.env.S3BUCKET
	const childFolder = process.env.awsS3ChildFolderPath;

	return await getSignedUrl(s3, new GetObjectCommand({
		Key: `${childFolder}${fileName}`,
		Bucket,
	}))
}


module.exports = { s3Client, uploadFile, tagFile, getFileUrl }