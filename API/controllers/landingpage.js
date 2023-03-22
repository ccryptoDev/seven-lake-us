const { LandingPageDetails } = require('../models/landingpage')
const { s3Client, uploadFile } = require('../utils/S3');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { User } = require('../models/userModel');

exports.addLandingPage = async (req, res) => {
  if (!req.files.thumbnail) {
    throw new Error('thumbnail file is required')
  }
  const { name, usedBy, status, random } = req.body;
  const { file: thumbnail } = await uploadFile(req.files.thumbnail)
  const body = {
    name, usedBy, status, random,
    thumbnail: thumbnail.name
  }
  if (req.files.preview) {
    const { file: preview } = await uploadFile(req.files.preview)
    body.preview = preview.name
  }
  const page = await LandingPageDetails.create(body);
  return res.status(201).json(page)
}

exports.selectPage = async (req, res) => {
  const { email, pageId: id } = req.body
  const user = await User.findOne({ where: { email } })
  const page = await LandingPageDetails.findOne({ where: { id } })
  if (!user || !page) {
    throw new Error('Could not select page')
  }
  await user.update({ selectedPage: id })
  return res.status(200).json({'status': 'page selected'})
}

exports.getLandingPages = async (req, res) => {
  let pages = await LandingPageDetails.findAll({ raw: true });

  let selectedId = ''
  const email = req.query?.email
  if (email) {
    const user = await User.findOne({ where: { email } })
    selectedId = user?.selectedPage || ''
    pages = pages.filter((item) => {
      // If not active
      if (item.status !== 'Active') return false

      // If not used by anybody
      if (!item.usedBy) return true

      //if used by the user
      if (item.usedBy.includes(email) || item.usedBy === email)
        return true

      // If used by someone else
      return false
    });
  }

  const s3 = s3Client()
  const childFolder = process.env.awsS3ChildFolderPath;
  const bucket = process.env.S3BUCKET

  for (let i = 0; i < pages.length; i++) {
    pages[i].thumbnailURL = null
    pages[i].previewURL = null
    if (pages[i].thumbnail) {
      pages[i].thumbnailURL = await getSignedUrl(s3, new GetObjectCommand({
        Bucket: bucket,
        Key: `${childFolder}${pages[i].thumbnail}`,
      }))
    }
    if (pages[i].preview) {
      pages[i].previewURL = await getSignedUrl(s3, new GetObjectCommand({
        Bucket: bucket,
        Key: `${childFolder}${pages[i].preview}`,
      }))
    }
    if (selectedId && selectedId === pages[i].id) {
      pages[i].selected = true
    }
  }
  res.status(200).json(pages)
}

exports.updateLandingPage = async (req, res) => {
  const body = req.body;
  if (req.files?.thumbnail) {
    const { file: thumbnail } = await uploadFile(req.files.thumbnail)
    body.thumbnail = thumbnail.name;
  }
  if (req.files?.preview) {
    const { file: preview } = await uploadFile(req.files.preview)
    body.preview = preview.name;
  }

  const page = await LandingPageDetails.findByPk(req.params.id);
  await page.update(req.body)

  return res.status(200).json(page);
}