// backend/models/alumno.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alumno = sequelize.define('Alumno', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    carrera_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'carreras', // Nombre de la tabla de carreras
        key: 'id',
      }
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    semestre: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estatus: {
      type: DataTypes.ENUM('activo', 'activo con especiales', 'baja temporal', 'baja definitiva', 'egresado'),
      defaultValue: 'activo',
      allowNull: false,
    }
  }, {
    tableName: 'alumnos',
    timestamps: false,
  });

  Alumno.associate = (models) => {
    // Un alumno pertenece a un usuario y a una carrera
    Alumno.belongsTo(models.Usuario, { foreignKey: 'id' });
    Alumno.belongsTo(models.Carrera, { foreignKey: 'carrera_id' });
  };

  return Alumno;
};