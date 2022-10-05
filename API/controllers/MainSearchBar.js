const { Video } = require("../models/Video");
const { documents } = require("../models/documents");

exports.MainSearchBar = async (req, res, next) => {
  const { DocumentandVideo } = req.query;

  if (!DocumentandVideo) {
    return res.status(400).json({
      message: "invalid parameters",
    });
  }

  const videosResult = await Video.findAll({
    where: {
      tag: DocumentandVideo,
    },
  });
  const documentsResult = await documents.findAll({
    where: {
      tag: DocumentandVideo,
    },
  });

  res.status(200).json({
    status: "success",
    documentsResult,
    videosResult,
  });
};
