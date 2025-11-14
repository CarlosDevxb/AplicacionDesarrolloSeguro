const express = require('express');
const router = express.Router();
const {
  login,
  aspiranteLogin,
  refresh,
  resetPassword,
  establecerContrasena,
  validarTokenEstablecimiento
} = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Ruta para el login de usuarios generales (alumnos, docentes, etc.)
router.post('/login', login);

// Ruta para el login exclusivo de aspirantes
router.post('/aspirante-login', aspiranteLogin);

router.post('/refresh', authenticateToken, refresh);
router.post('/reset-password/:token', resetPassword);
// Nueva ruta para establecer la contraseña
router.post('/establecer-contrasena/:token', establecerContrasena);

// Nueva ruta para validar el token de establecimiento antes de mostrar el formulario
router.get('/validar-token-establecimiento/:token', validarTokenEstablecimiento);

module.exports = router;