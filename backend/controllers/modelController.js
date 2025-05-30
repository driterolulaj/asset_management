const { Model } = require('../models');

exports.getAllModels = async (req, res) => {
  const models = await Model.findAll();
  res.json(models);
};

exports.createModel = async (req, res) => {
  const model = await Model.create(req.body);
  res.status(201).json(model);
};

exports.updateModel = async (req, res) => {
  const model = await Model.findByPk(req.params.id);
  if (!model) return res.status(404).json({ message: 'Model not found' });
  await model.update(req.body);
  res.json(model);
};

exports.deleteModel = async (req, res) => {
  const model = await Model.findByPk(req.params.id);
  if (!model) return res.status(404).json({ message: 'Model not found' });
  await model.destroy();
  res.json({ message: 'Model deleted successfully' });
};
