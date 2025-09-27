const express = require('express');
const router = express.Router();
const materiaController = require('../controllers/materia.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Todas las rutas de materias estarán protegidas y requerirán autenticación de admin
router.use(authenticateToken);

router.post('/', materiaController.createMateria);
router.get('/search', materiaController.findMateriaByName);

module.exports = router;