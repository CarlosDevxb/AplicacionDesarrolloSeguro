const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const carreraRoutes = require('./carrera.routes');
const aspiranteRoutes = require('./aspirante.routes');

router.use('/auth', authRoutes);
router.use('/carreras', carreraRoutes);
router.use('/aspirantes', aspiranteRoutes);

module.exports = router;