// backend/models/administrativo.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Administrativo = sequelize.define('Administrativo', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    }
  }, {
    tableName: 'administrativos',
    timestamps: false,
  });

  Administrativo.associate = (models) => {
    Administrativo.belongsTo(models.Usuario, { foreignKey: 'id' });
  };

  return Administrativo;
};