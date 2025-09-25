// backend/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar la conexión a la BD y las rutas
const sequelize = require('./config/database');
const apiRoutes = require('./routes/index'); // <-- Importa el enrutador principal
const bcrypt = require('bcryptjs');
const app = express();
const db = require('./models'); // <-- Importa el index.js de models
const { hashPassword } = require('./hash');
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({ origin: 'http://localhost:4200' })); // Asegúrate de que el puerto es correcto
app.use(express.json()); // Para que Express entienda JSON

// --- Servir archivos estáticos ---
// Hacemos que la carpeta 'uploads' sea accesible públicamente en la ruta /uploads
app.use('/uploads', express.static('uploads'));

// --- Registrar Rutas ---
app.use('/api', apiRoutes); // Todas las rutas tendrán el prefijo /api

const PORT = process.env.PORT || 3000;

const saltRounds = 10;
const myPlaintextPassword = '123';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  // Store hash in your password DB.
  console.log(hash);
});

// Iniciar servidor y conectar a la BD
const startServer = async () => {
  try {
    await db.sequelize.authenticate(); // <-- Usa db.sequelize
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincroniza los modelos con la base de datos. alter:true intenta añadir las columnas que faltan.
    await db.sequelize.sync({ alter: true }); 
   
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
     
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};



startServer();