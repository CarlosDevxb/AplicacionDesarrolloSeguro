// backend/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// La ruta es POST porque el cliente envía datos (credenciales)
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;