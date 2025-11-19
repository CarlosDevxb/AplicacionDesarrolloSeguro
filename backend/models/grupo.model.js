const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Grupo = sequelize.define('Grupo', {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    id_materia: DataTypes.STRING(20),
    id_docente: DataTypes.STRING(20),
    hora_inicio: DataTypes.TIME,
    hora_fin: DataTypes.TIME,
    salon_id: DataTypes.INTEGER,
    semestre: DataTypes.INTEGER,
    cupo: DataTypes.INTEGER,
  }, {
    tableName: 'grupos',
    timestamps: false,
  });

  Grupo.associate = (models) => {
    Grupo.belongsTo(models.Materia, { foreignKey: 'id_materia', as: 'materia' });
    Grupo.belongsTo(models.Usuario, { foreignKey: 'id_docente', as: 'docente' });
    Grupo.belongsTo(models.Salon, { foreignKey: 'salon_id', as: 'salon' });
    Grupo.hasMany(models.CargaAcademica, { foreignKey: 'grupo_id', as: 'inscripciones' });
    Grupo.belongsToMany(models.Alumno, { through: models.CargaAcademica, foreignKey: 'grupo_id', otherKey: 'alumno_id', as: 'alumnos' });
    Grupo.hasMany(models.Tarea, { foreignKey: 'grupo_id', as: 'tareas' });
  };

  return Grupo;
};