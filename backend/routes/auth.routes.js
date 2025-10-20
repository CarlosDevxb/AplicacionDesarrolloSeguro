// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { login, refresh, resetPassword } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware').authenticateToken;
// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para refrescar el token (protegida)
router.get('/refresh', authenticateToken, refresh);

// Ruta para establecer/restablecer la contraseña usando un token
router.post('/reset-password/:token', resetPassword);

module.exports = router;