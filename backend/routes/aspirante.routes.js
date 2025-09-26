const express = require('express');
const router = express.Router();
const aspiranteController = require('../controllers/aspirante.controller');

router.post('/solicitar-ficha', aspiranteController.solicitarFicha);

module.exports = router;