// backend/models/index.js
const sequelize = require('../config/database.js');

const db = {};

db.sequelize = sequelize;

// Importar todos los modelos
db.Usuario = require('./usuario.model.js');
db.Carrera = require('./carrera.model.js');
db.Aspirante = require('./aspirante.model.js');
// ... importa aquí los demás modelos de tu nuevo esquema (Alumno, etc.)

// --- Definir las relaciones ---
// Relación Aspirante -> Carrera (Un aspirante elige una carrera)
db.Aspirante.belongsTo(db.Carrera, { foreignKey: 'carrera_id' });
db.Carrera.hasMany(db.Aspirante, { foreignKey: 'carrera_id' });

// ... aquí definirás las demás relaciones

module.exports = db;