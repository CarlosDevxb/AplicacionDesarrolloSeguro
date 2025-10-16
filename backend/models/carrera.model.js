// backend/models/carrera.model.js
module.exports = (sequelize, DataTypes) => {
  const Carrera = sequelize.define('Carrera', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'carreras', // Especificamos el nombre exacto de la tabla
    // Le decimos a Sequelize que esta tabla no tiene los campos createdAt y updatedAt
    timestamps: false
  });

  Carrera.associate = (models) => {
    // La relación es con Aspirante y Alumno (que está en Usuario)
    Carrera.hasMany(models.Aspirante, { foreignKey: 'carrera_id' }); // Una carrera tiene muchos aspirantes
    Carrera.hasMany(models.Alumno, { foreignKey: 'carrera_id' }); // Una carrera tiene muchos alumnos
    // Una carrera tiene muchas materias a través de la tabla intermedia
    Carrera.belongsToMany(models.Materia, {
      through: 'materias_por_carrera',
      foreignKey: 'carrera_id',
      otherKey: 'materia_id'
    });
  };

  return Carrera;
};