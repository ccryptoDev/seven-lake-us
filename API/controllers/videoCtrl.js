const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand, ListObjectsCommand } = require("@aws-sdk/client-s3");
const { Video } = require("../models/Video");
const { s3Client, uploadFile, tagFile } = require("../utils/S3");


async function loadVideo({ id, videoName, convertedName, thumbnailName, ...rest }) {
  const s3 = s3Client();
  const Bucket = process.env.S3BUCKET
  const childFolder = process.env.awsS3ChildFolderPath;

  let getVideo = new GetObjectCommand({
    Key: `${childFolder}${videoName}`,
    Bucket,
  });
  const getThumbnail = new GetObjectCommand({
    Key: `${childFolder}${thumbnailName}`,
    Bucket,
  });

  // Check S3 for compressed videos
  if (!convertedName) {
    // Name modifier from AWS Lambda job settings
    // used for converted videos before file extension
    // original.mp4 => original-360p.mp4
    const nameModifier = '-360p'

    const [name] = videoName.split('.')
    const list = await s3.send(new ListObjectsCommand({
      Prefix: `${process.env.awsS3ChildFolderPath}${name}${nameModifier}`,
      Bucket,
    }))

    if (list.Contents?.length > 0) {
      let convertedKey = list.Contents[0].Key
      convertedKey = convertedKey.split('/')
      convertedKey = convertedKey[convertedKey.length - 1]
      convertedName = convertedKey
      await Video.update({ convertedName }, { where: { id } })
    }
  }

  if (convertedName) {
    getVideo = new GetObjectCommand({
      Key: `${childFolder}${convertedName}`,
      Bucket,
    });
  }

  return {
    ...rest,
    id,
    videoName, thumbnailName,
    videoURL: await getSignedUrl(s3, getVideo),
    thumbnailURL: await getSignedUrl(s3, getThumbnail),
  };
}

exports.getVideos = async (req, res) => {
  const rows = await Video.findAll({ raw: true });
  const videos = await Promise.all(rows.map(loadVideo));
  res.status(200).json(videos);
};

exports.addVideo = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const { title, category, price, order, description } = req.body;
  const tags = req.body.tags.split(',')
  const { file: video } = await uploadFile(req.files.video)
  await tagFile(video.name, [{ Key: 'Resolution', Value: 'Original' }])
  const { file: thumbnail } = await uploadFile(req.files.thumbnail)

  const requestParams = {
    title: title,
    category: category,
    price: price,
    order: order,
    tags: tags,
    description: description,
    videoName: video.name,
    thumbnailName: thumbnail.name
  }
  const doc = await Video.create(requestParams);
  if (!doc) {
    return res.status(400).json({
      error: "Invalid parameters"
    })
  }
  return res.status(201).json(doc)
}

exports.getVideo = async (req, res) => {
  const row = await Video.findByPk(req.params?.id)
  if (!row) {
    return res.status(400).json({
      "error": "invalid parameters"
    })
  }
  const video = await loadVideo(row)
  return res.status(200).json(video)
}
