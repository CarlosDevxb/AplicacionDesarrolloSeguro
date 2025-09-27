module.exports = (sequelize, DataTypes) => {
  const Materia = sequelize.define('Materia', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: 'Clave única de la materia, ej: MAT-101'
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    creditos: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'materias',
    timestamps: false
  });

  Materia.associate = (models) => {
    // Una materia puede estar en muchas carreras a través de la tabla intermedia
    Materia.belongsToMany(models.Carrera, {
      through: 'materias_por_carrera',
      foreignKey: 'materia_id',
      otherKey: 'carrera_id'
    });
  };

  return Materia;
};