// backend/models/usuario.model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
      allowNull: true, // Coincide con el schema que permite NULL
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
      allowNull: true, // Es nulo para aspirantes
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
    estado: {
      type: DataTypes.ENUM('activo', 'no activo', 'bloqueado'),
      allowNull: false,
      defaultValue: 'activo'
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {  
    tableName: 'usuarios',
    timestamps: false, // Tu esquema no tiene createdAt/updatedAt
    defaultScope: {
      attributes: { exclude: ['contrasena', 'password_reset_token', 'password_reset_expires'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['contrasena'] },
      },
    },
  });

  Usuario.associate = (models) => {
    // Un usuario tiene un registro de alumno si su rol es 'alumno'
    Usuario.hasOne(models.Alumno, { foreignKey: 'id' });
  };

  return Usuario;
};