// backend/models/carrera.model.js
module.exports = (sequelize, DataTypes) => {
  const Carrera = sequelize.define('Carrera', {
    id: {
      type: DataTypes.STRING(20), // Corregido: El ID es un string (VARCHAR)
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100), // Corregido: Coincide con el schema
      allowNull: false,
      unique: true
    }
    // Eliminada la columna 'descripcion' que no existe en la BD
  }, {
    tableName: 'carreras', // Especificamos el nombre exacto de la tabla
    // Le decimos a Sequelize que esta tabla no tiene los campos createdAt y updatedAt
    timestamps: false
  });

  Carrera.associate = (models) => {
    // La relación es con Aspirante y Alumno (que está en Usuario)
    Carrera.hasMany(models.Aspirante, { foreignKey: 'carrera_id' }); // Una carrera tiene muchos aspirantes
    Carrera.hasMany(models.Alumno, { foreignKey: 'carrera_id' }); // Una carrera tiene muchos alumnos
  };

  return Carrera;
};