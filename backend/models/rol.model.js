// backend/models/rol.model.js
module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define('Rol', {
    idRol: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING,
    },
  }, { tableName: 'Rol', timestamps: false });
  return Rol;
};