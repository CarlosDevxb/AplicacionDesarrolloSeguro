// backend/models/index.js
const sequelize = require('../config/database.js');

const db = {};

db.sequelize = sequelize;

// Importar todos los modelos
db.Rol = require('./rol.model.js');
db.Usuario = require('./usuario.model.js');
db.Categoria = require('./categoria.model.js');
db.Producto = require('./producto.model.js');
// ... importa aquí los demás modelos que crees (Pedido, Carrito, etc.)

// --- Definir las relaciones ---

// Relación Usuario <-> Rol (Uno a Muchos)
db.Rol.hasMany(db.Usuario, { foreignKey: 'idRol' });
db.Usuario.belongsTo(db.Rol, { foreignKey: 'idRol' });

// Relación Producto <-> Categoria (Uno a Muchos)
db.Categoria.hasMany(db.Producto, { foreignKey: 'idCategoria' });
db.Producto.belongsTo(db.Categoria, { foreignKey: 'idCategoria' });

/*
  AQUÍ DEFINIRÍAS LAS OTRAS RELACIONES
  Ejemplo Carrito <-> Usuario (Uno a Uno)
  db.Usuario.hasOne(db.Carrito, { foreignKey: 'idUsuario' });
  db.Carrito.belongsTo(db.Usuario, { foreignKey: 'idUsuario' });

  Ejemplo Carrito <-> Producto (Muchos a Muchos)
  db.Carrito.belongsToMany(db.Producto, { through: 'CarritoProducto', foreignKey: 'idCarrito' });
  db.Producto.belongsToMany(db.Carrito, { through: 'CarritoProducto', foreignKey: 'idProducto' });
*/

module.exports = db;