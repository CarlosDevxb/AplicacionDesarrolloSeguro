// backend/models/alumno.model.js
module.exports = (sequelize, DataTypes) => {
  const Alumno = sequelize.define('Alumno', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      references: {
        model: 'usuarios', // Nombre de la tabla
        key: 'id'
      }
    },
    carrera_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false
    },
    semestre: {
      type: DataTypes.INTEGER,
      allowNull: true // O false si siempre debe tener un valor
    },
    estatus: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Activo' // Estado por defecto para nuevos alumnos
    }
  }, {
    tableName: 'alumnos',
    timestamps: false
  });

  Alumno.associate = (models) => {
    Alumno.belongsTo(models.Usuario, { foreignKey: 'id' });
    Alumno.belongsTo(models.Carrera, { foreignKey: 'carrera_id' });
  };

  return Alumno;
};