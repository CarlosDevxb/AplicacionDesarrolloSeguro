const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Docente = sequelize.define('Docente', {
    id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
    },
    cedula_profesional: DataTypes.STRING(30),
    especialidad: DataTypes.STRING(100),
  }, {
    tableName: 'docentes',
    timestamps: false,
  });

  Docente.associate = (models) => {
    Docente.belongsTo(models.Usuario, { foreignKey: 'id', as: 'usuario' });
    Docente.hasMany(models.Grupo, { foreignKey: 'id_docente', as: 'grupos' });
  };

  return Docente;
};