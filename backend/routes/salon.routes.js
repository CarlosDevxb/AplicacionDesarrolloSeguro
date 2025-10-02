// backend/routes/salon.routes.js
const express = require('express');
const router = express.Router();
const { getSalones, createSalon, updateSalon, deleteSalon } = require('../controllers/salon.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Aplicamos el middleware de autenticación a todas las rutas de salones.
router.use(authenticateToken);

// Rutas para la gestión de salones
router.get('/', getSalones);
router.post('/', createSalon);
router.put('/:id', updateSalon);
router.delete('/:id', deleteSalon);

module.exports = router;