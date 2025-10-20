// backend/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const apiRoutes = require('./routes/index');
const app = express();
const db = require('./models'); // <-- Importa el index.js de models

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

// Iniciar servidor y conectar a la BD
const startServer = async () => {
  try {
    await db.sequelize.authenticate(); // <-- Usa db.sequelize
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Se ha comentado la siguiente línea para evitar que Sequelize modifique
    // automáticamente la estructura de la base de datos.
    // La base de datos ahora se debe gestionar con migraciones manuales.
    // await db.sequelize.sync({ alter: true }); 
   
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
     
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};



startServer();