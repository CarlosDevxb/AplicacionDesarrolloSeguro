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
    },
    nombre_completo: {
      type: DataTypes.STRING(100),
    },
    rol: {
      type: DataTypes.ENUM('alumno', 'docente', 'administrativo', 'aspirante'),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    telefono: DataTypes.STRING(20),
    direccion: DataTypes.STRING(255),
    foto: DataTypes.STRING(255),
    numero_control: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    estado: {
      type: DataTypes.ENUM('activo', 'no activo', 'bloqueado'),
      allowNull: false,
      defaultValue: 'activo',
    },
    password_reset_token: DataTypes.STRING(255),
    password_reset_expires: DataTypes.DATE,
    ultimo_acceso: DataTypes.DATE,
    update_code: DataTypes.STRING(255),
    update_code_expires: DataTypes.DATE,
  }, {
    tableName: 'usuarios',
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['contrasena', 'password_reset_token', 'password_reset_expires', 'update_code', 'update_code_expires'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['contrasena'] },
      },
    },
  });

  Usuario.associate = (models) => {
    Usuario.hasOne(models.Alumno, { foreignKey: 'id', as: 'perfilAlumno' });
    Usuario.hasOne(models.Docente, { foreignKey: 'id', as: 'perfilDocente' });
    Usuario.hasOne(models.Administrativo, { foreignKey: 'id', as: 'perfilAdministrativo' });
    Usuario.hasMany(models.Grupo, { foreignKey: 'id_docente', as: 'gruposImpartidos' });
  };

  return Usuario;
};