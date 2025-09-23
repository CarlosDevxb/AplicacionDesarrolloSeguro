// backend/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Usuario } = require('../models'); // Ya no necesitamos el modelo Rol
const { alternatives } = require('joi');


const login = async (req, res) => {
  const { usuario, password, rol } = req.body; // Ahora también recibimos el rol

  try {
    // 1. Buscar al usuario por el campo 'usuario'
    const user = await Usuario.scope('withPassword').findOne({
      where: { usuario: usuario }, // Buscamos en la columna 'usuario'
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 2. Validar que el rol seleccionado coincida con el del usuario
    // El frontend envía 'personal' para 'docente' y 'administrativo'
    const isRoleValid = (rol === 'personal' && (user.rol === 'docente' || user.rol === 'administrativo')) || rol === user.rol;

    if (!isRoleValid) {
      // Usamos 403 Forbidden porque el usuario existe, pero no tiene permiso para acceder con ese rol.
      return res.status(403).json({ message: 'El rol seleccionado no es correcto para este usuario.' });
    }

    // 3. Comparamos con la columna 'contrasena'
    const isPasswordCorrect = await bcrypt.compare(password, user.contrasena);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // 4. Crear el payload incluyendo el rol del usuario
    const payload = {
      id: user.id,      // Usamos la nueva PK 'id'
      rol: user.rol,    // El rol viene directamente del usuario
    };

    // 5. Firmar y enviar el token (esto no cambia)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

module.exports = { login };