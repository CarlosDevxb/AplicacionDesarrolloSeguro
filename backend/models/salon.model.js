// backend/models/salon.model.js
module.exports = (sequelize, DataTypes) => {
  const Salon = sequelize.define('Salon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    clave: {
      type: DataTypes.STRING(10), // Clave del salón, ej: 'A101'
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('Aula', 'Laboratorio', 'Auditorio', 'Sala de Juntas'),
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  }, {
    tableName: 'salones',
    timestamps: false
  });

  return Salon;
};