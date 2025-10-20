const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MateriaPorCarrera = sequelize.define('MateriaPorCarrera', {
    materia_id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      references: { model: 'materias', key: 'id' }
    },
    carrera_id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      references: { model: 'carreras', key: 'id' }
    },
    semestre: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'materias_por_carrera',
    timestamps: false
  });
  return MateriaPorCarrera;
};