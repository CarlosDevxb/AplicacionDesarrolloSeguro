const express = require('express');
const router = express.Router();
const { getAllCarreras } = require('../controllers/carrera.controller.js');

// GET /api/carreras
router.get('/', getAllCarreras);

module.exports = router;