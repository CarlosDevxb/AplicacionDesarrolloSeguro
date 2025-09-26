// backend/routes/carrera.routes.js
const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carrera.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Hacemos que la obtención de carreras sea pública para que se pueda usar en el formulario de registro.
router.get('/', carreraController.getAllCarreras);

// Las operaciones de creación y actualización siguen protegidas.
router.post('/', authenticateToken, carreraController.createCarrera);
router.put('/:id', authenticateToken, carreraController.updateCarrera);

module.exports = router;