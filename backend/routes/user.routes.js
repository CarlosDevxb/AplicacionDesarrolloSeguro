// backend/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Todas las rutas aquí están protegidas y requieren un token válido
router.use(authenticateToken);

router.get('/profile', userController.getProfile);
router.post('/profile/picture', upload.single('profilePicture'), userController.uploadProfilePicture);

// Nuevas rutas para actualizar el perfil y cambiar la contraseña
router.put('/profile', userController.updateProfile);
router.post('/profile/password', userController.changePassword);



module.exports = router;
