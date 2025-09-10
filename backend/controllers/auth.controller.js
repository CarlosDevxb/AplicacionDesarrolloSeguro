// backend/controllers/auth.controller.js

const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
  const { email, password } = req.body;
 console.log("RECIBIDO DEL FRONTEND:", { email, password });
  try {
    // 1. Buscar al usuario por email, incluyendo el password usando el "scope"
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
 console.log("HASH GUARDADO EN LA BD:", user.password);
    // 2. Comparar la contraseña enviada con la hasheada en la BD
    console.log(bcrypt.hashSync(password, 10));
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
console.log("¿LA CONTRASEÑA ES CORRECTA?:", isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // 3. Si todo es correcto, crear el payload para el token
    const payload = {
      id: user.id,
      role: user.role,
    };

    // 4. Firmar el token con la clave secreta y establecer una expiración
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    // 5. Enviar el token al cliente
    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Aquí podrías añadir la función de 'register' en el futuro
module.exports = { login };