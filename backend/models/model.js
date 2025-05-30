module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Model', {
    name: DataTypes.STRING,
    manufacturer: DataTypes.STRING
  });
  Model.associate = (models) => {
    Model.hasMany(models.Asset, { foreignKey: 'modelId' });
  };
  return Model;
};
