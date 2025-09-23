const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Endpoint para promover un aspirante a alumno
router.post('/promover-aspirante/:id', adminController.promoverAspirante);

module.exports = router;