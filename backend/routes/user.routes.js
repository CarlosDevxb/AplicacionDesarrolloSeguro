const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Ruta protegida para obtener el perfil del usuario logueado
router.get('/profile', authenticateToken, userController.getProfile);

// Ruta para subir/actualizar la foto de perfil
// 'profilePicture' es el nombre del campo en el FormData
router.post('/profile/picture', [authenticateToken, upload.single('profilePicture')], userController.uploadProfilePicture);

module.exports = router;
