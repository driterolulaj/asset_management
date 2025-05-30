module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    serialNumber: DataTypes.STRING,
    status: DataTypes.STRING,
    modelId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Models',
        key: 'id'
      }
    }
  });

  Asset.associate = (models) => {
    Asset.belongsTo(models.Model, { foreignKey: 'modelId' });
  };

  return Asset;
};