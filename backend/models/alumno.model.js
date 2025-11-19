const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alumno = sequelize.define('Alumno', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    carrera_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    semestre: DataTypes.STRING(2),
    especialidad_id: DataTypes.INTEGER,
    estatus: {
      type: DataTypes.ENUM('activo', 'activo con especiales', 'baja temporal', 'baja definitiva', 'egresado'),
      allowNull: false,
      defaultValue: 'activo',
    },
  }, {
    tableName: 'alumnos',
    timestamps: false,
  });

  Alumno.associate = (models) => {
    Alumno.belongsTo(models.Usuario, { foreignKey: 'id', as: 'usuario' });
    Alumno.belongsTo(models.Carrera, { foreignKey: 'carrera_id', as: 'carrera' });
    Alumno.belongsTo(models.Especialidad, { foreignKey: 'especialidad_id', as: 'especialidad' });
    Alumno.hasMany(models.CargaAcademica, { foreignKey: 'alumno_id', as: 'cargaAcademica' });
    Alumno.belongsToMany(models.Grupo, { through: models.CargaAcademica, foreignKey: 'alumno_id', otherKey: 'grupo_id', as: 'grupos' });
    Alumno.hasMany(models.Kardex, { foreignKey: 'alumno_id', as: 'kardex' });
    Alumno.hasMany(models.KardexTemporal, { foreignKey: 'alumno_id', as: 'kardexTemporal' });
    Alumno.hasMany(models.EntregaTarea, { foreignKey: 'alumno_id', as: 'entregas' });
  };

  return Alumno;
};