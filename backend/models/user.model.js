
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Puedes añadir más campos como 'nombre', 'rol', etc.
  role: {
    type: DataTypes.STRING,
    defaultValue: 'cliente',
  },
}, {
  // Opciones del modelo
  tableName: 'users',
  timestamps: true, // Crea createdAt y updatedAt automáticamente
  defaultScope: {
    // Por seguridad, nunca incluyas el password por defecto en las consultas
    attributes: { exclude: ['password'] },
  },
  scopes: {
    // Un "scope" para poder pedir el password cuando sí lo necesitemos (en el login)
    withPassword: {
      attributes: { include: ['password'] },
    },
  },
});

module.exports = User;