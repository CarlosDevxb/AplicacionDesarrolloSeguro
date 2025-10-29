// backend/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto'); // Necesario para hashear el token
const { Usuario } = require('../models');
const { Op } = require('sequelize');


const login = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // 1. Buscar al usuario por su número de control O su correo, excluyendo a los aspirantes.
    const user = await Usuario.scope('withPassword').findOne({
      where: {
        // Permite que el login sea con 'numero_control' (para alumnos) o 'usuario' (que puede ser correo para otros roles)
        [Op.or]: [
          { numero_control: usuario },
          { usuario: usuario }
        ],
        rol: { [Op.ne]: 'aspirante' } // [Op.ne] significa "not equal" (no es igual a)
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
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
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });

    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

const aspiranteLogin = async (req, res) => {
  const { usuario, password } = req.body; // Para aspirantes, 'usuario' es el correo

  try {
    // 1. Buscar al aspirante por su correo ('usuario')
    const user = await Usuario.scope('withPassword').findOne({
      where: {
        usuario: usuario,
        rol: 'aspirante'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Aspirante no encontrado.' });
    }

    // 2. Comparamos la contraseña
    const isPasswordCorrect = await bcrypt.compare(password, user.contrasena);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // 3. Crear el payload
    const payload = {
      id: user.id,
      rol: user.rol,
    };

    // 4. Firmar y enviar el token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

const refresh = (req, res) => {
  // El middleware 'authenticateToken' ya ha verificado el token y ha puesto los datos del usuario en req.user
  const user = req.user;

  // Creamos un nuevo payload para el nuevo token, asegurándonos de no incluir 'iat' y 'exp' del token viejo.
  const payload = {
    id: user.id,
    rol: user.rol,
  };

  // Firmamos un nuevo token con una nueva expiración de 15 minutos
  const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });

  res.json({ token: newToken });
};

const resetPassword = async (req, res) => {
  try {
    // 1. Obtener el token de la URL y hashearlo para buscarlo en la BD
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Buscar al usuario con ese token y que no haya expirado
    const user = await Usuario.findOne({
      where: {
        password_reset_token: hashedToken,
        password_reset_expires: { [Op.gt]: Date.now() } // Op.gt = "mayor que"
      }
    });

    // 3. Si no se encuentra el usuario o el token expiró, enviar error
    if (!user) {
      return res.status(400).json({ message: 'El token es inválido o ha expirado.' });
    }

    // 4. Hashear la nueva contraseña y actualizar el usuario
    const salt = await bcrypt.genSalt(10);
    user.contrasena = await bcrypt.hash(req.body.password, salt);
    user.password_reset_token = null; // Limpiar el token
    user.password_reset_expires = null; // Limpiar la expiración

    await user.save();

    res.status(200).json({ message: 'La contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión.' });

  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

module.exports = { login, aspiranteLogin, refresh, resetPassword };