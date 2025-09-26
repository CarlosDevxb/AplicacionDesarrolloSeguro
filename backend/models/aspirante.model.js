module.exports = (sequelize, DataTypes) => {
  const Aspirante = sequelize.define('Aspirante', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_completo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { isEmail: true },
    },
    telefono: {
      type: DataTypes.STRING(20),
    },
    direccion: {
      type: DataTypes.STRING(255),
    },
    carrera_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM('enviada', 'en_revision', 'aceptado', 'rechazado'),
      allowNull: false,
      defaultValue: 'enviada',
    },
  }, {
    tableName: 'aspirantes',
    timestamps: false,
  });

  Aspirante.associate = (models) => {
    Aspirante.belongsTo(models.Carrera, { foreignKey: 'carrera_id' });
  };

  return Aspirante;
};