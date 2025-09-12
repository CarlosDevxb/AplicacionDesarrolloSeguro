// backend/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar la conexión a la BD y las rutas
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');

const app = express();
const db = require('./models'); // <-- Importa el index.js de models

app.use(helmet());
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json()); // Para que Express entienda JSON

// --- Registrar Rutas ---
// Todas las rutas en auth.routes.js tendrán el prefijo /api/auth
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// Iniciar servidor y conectar a la BD
const startServer = async () => {
  try {
    await db.sequelize.authenticate(); // <-- Usa db.sequelize
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // await db.sequelize.sync({ force: true }); // force: true borra y recrea las tablas
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

startServer();