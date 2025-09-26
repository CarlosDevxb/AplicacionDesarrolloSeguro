// backend/models/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database.js');
const basename = path.basename(__filename);

const db = {};

// Lee todos los archivos del directorio actual, excepto este mismo archivo.
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // Para cada archivo, importa el modelo y lo inicializa con sequelize.
    const model = require(path.join(__dirname, file))(sequelize, require('sequelize').DataTypes);
    db[model.name] = model;
  });

// Después de cargar todos los modelos, ejecuta el método 'associate' si existe.
// Esto asegura que las relaciones se creen correctamente.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
