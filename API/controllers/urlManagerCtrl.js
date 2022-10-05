const { ManagedURL } = require('../models/ManagedURL');

const formatRecord = (item) => ({ ...item, urls: item.urls.split(',') })

exports.createURL = async (req, res) => {
  const { urls, thirdParty, status, name } = req.body;
  const requestParams = {
    urls: urls.join(','),
    thirdParty: thirdParty,
    status: status,
    name: name,
  }

  let managedURL = await ManagedURL.create(requestParams);
  managedURL = formatRecord(managedURL)

  res.status(201).json(managedURL)
}

exports.listURL = async (req, res) => {
  let urls = await ManagedURL.findAll({raw: true});
  urls = urls.map(formatRecord)

  res.status(200).json(urls)
}

exports.updateURL = async (req, res) => {
  if (req.body?.urls) {
    req.body.urls = req.body.urls.join(',')
  }
  await ManagedURL.update(req.body, {
    where: { id: req.params.id }
  });
  const url = await ManagedURL.findByPk(req.params.id, { raw: true })
  res.status(200).json(formatRecord(url))
}

exports.findURL = async (req, res) => {
  const url = await ManagedURL.findByPk(req.params.id, { raw: true })
  res.status(200).json(formatRecord(url))
}

exports.deleteURL = async (req, res) => {
  const url = await ManagedURL.findByPk(req.params.id)
  await url.destroy()

  res.status(200).json({
    message: 'record deleted'
  })
}
