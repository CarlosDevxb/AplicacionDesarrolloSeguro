const express = require('express');
const router = express.Router();
const { solicitarFicha } = require('../controllers/aspirante.controller.js');

// POST /api/aspirantes/solicitar-ficha
router.post('/solicitar-ficha', solicitarFicha);

module.exports = router;