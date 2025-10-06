const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para refrescar el token (protegida)
router.post('/refresh', authenticateToken, authController.refresh);

module.exports = router;