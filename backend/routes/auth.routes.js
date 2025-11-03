const express = require('express');
const router = express.Router();
const {
  login,
  aspiranteLogin,
  refresh,
  resetPassword
} = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Ruta para el login de usuarios generales (alumnos, docentes, etc.)
router.post('/login', login);

// Ruta para el login exclusivo de aspirantes
router.post('/aspirante-login', aspiranteLogin);

router.post('/refresh', authenticateToken, refresh);
router.post('/reset-password/:token', resetPassword);

module.exports = router;