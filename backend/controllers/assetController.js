const { Asset, Model } = require('../models');

exports.getAllAssets = async (req, res) => {
  const assets = await Asset.findAll({ include: Model });
  res.json(assets);
};

exports.createAsset = async (req, res) => {
  const asset = await Asset.create(req.body);
  res.status(201).json(asset);
};

exports.updateAsset = async (req, res) => {
  const asset = await Asset.findByPk(req.params.id);
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  await asset.update(req.body);
  res.json(asset);
};

exports.deleteAsset = async (req, res) => {
  const asset = await Asset.findByPk(req.params.id);
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  await asset.destroy();
  res.json({ message: 'Asset deleted successfully' });
};
