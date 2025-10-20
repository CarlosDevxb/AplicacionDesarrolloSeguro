// backend/models/docente.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Docente = sequelize.define('Docente', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    }
  }, {
    tableName: 'docentes',
    timestamps: false,
  });

  Docente.associate = (models) => {
    Docente.belongsTo(models.Usuario, { foreignKey: 'id' });
  };

  return Docente;
};