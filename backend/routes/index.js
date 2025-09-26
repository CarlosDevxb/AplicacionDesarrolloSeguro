
// backend/routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const carreraRoutes = require('./carrera.routes');
const aspiranteRoutes = require('./aspirante.routes');
const adminRoutes = require('./admin.routes');

// Aquí registramos todas nuestras rutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/carreras', carreraRoutes);
router.use('/aspirantes', aspiranteRoutes);
router.use('/admin', adminRoutes); // Nuevas rutas de administración

module.exports = router;