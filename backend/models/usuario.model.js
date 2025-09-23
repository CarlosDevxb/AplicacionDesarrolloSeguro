// backend/models/usuario.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nombre_completo: {
    type: DataTypes.STRING(100),
  },
  rol: {
    type: DataTypes.ENUM('alumno', 'docente', 'administrativo', 'aspirante'),
    allowNull: false,
  },
  numero_control: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true, // Es nulo para roles que no son 'alumno'
  },
  correo: {
    type: DataTypes.STRING(100),
    validate: { isEmail: true },
  },
  direccion: {
    type: DataTypes.STRING(255),
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  foto: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'usuarios',
  timestamps: false, // Tu esquema no tiene createdAt/updatedAt
  defaultScope: {
    attributes: { exclude: ['contrasena'] },
  },
  scopes: {
    withPassword: {
      attributes: { include: ['contrasena'] },
    },
  },
});

module.exports = Usuario;