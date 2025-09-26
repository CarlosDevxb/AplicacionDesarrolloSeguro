const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Todas estas rutas requieren que el usuario sea un administrador autenticado
router.use(authenticateToken);

router.post('/users', adminController.createUser);
router.get('/users/:id', adminController.findUserById);
router.put('/users/:id', adminController.updateUser);

module.exports = router;