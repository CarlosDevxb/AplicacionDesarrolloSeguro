// backend/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto'); // Necesario para hashear el token
const { Usuario } = require('../models');
const { Op } = require('sequelize');
const sendEmail = require('./email.js'); // Importamos la utilidad para enviar correos


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

    // Actualizamos la fecha del último acceso
    user.ultimo_acceso = new Date();
    await user.save();

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

    // Actualizamos la fecha del último acceso para el aspirante
    user.ultimo_acceso = new Date();
    await user.save();

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
/**
 * Establece la contraseña para un nuevo usuario usando un token JWT.
 */
const establecerContrasena = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params; // Tomamos el token de la URL

  if (!token || !password) {
    return res.status(400).json({ message: 'El token y la contraseña son requeridos.' });
  }

  try {
    // 1. Hashear el token de la URL para buscarlo en la BD (igual que en resetPassword)
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 2. Buscar al usuario con ese token y que no haya expirado
    const usuario = await Usuario.findOne({
      where: {
        password_reset_token: hashedToken,
        password_reset_expires: { [Op.gt]: Date.now() } // Op.gt = "mayor que"
      }
    });

    // 3. Si no se encuentra el usuario o el token expiró, enviar error
    if (!usuario) {
      return res.status(400).json({ message: 'El enlace es inválido o ha expirado.' });
    }

    // 4. Verificar si el usuario ya tiene una contraseña (para que el enlace sea de un solo uso)
    if (usuario.contrasena) {
      return res.status(400).json({ message: 'Este enlace ya ha sido utilizado. Si olvidaste tu contraseña, usa la opción de recuperarla.' });
    }

    // 3. Hashear y guardar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Actualizamos la contraseña y ANULAMOS el token en el objeto de usuario
    usuario.contrasena = hashedPassword;
    usuario.password_reset_token = null;
    usuario.password_reset_expires = null;

    // Guardamos TODOS los cambios en la base de datos de una sola vez
    await usuario.save();

    // 4. Enviar correo de confirmación con un formato mejorado y los datos de acceso
    const emailSubject = '¡Bienvenido a CHAFATEC! Tu cuenta está lista.';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0056b3;">¡Tu cuenta en CHAFATEC está lista!</h1>
          </div>
          <p>Hola, <strong>${usuario.nombre_completo}</strong>,</p>
          <p>Te confirmamos que tu contraseña ha sido establecida correctamente. Ya puedes acceder a la plataforma.</p>
          <div style="background-color: #f2f2f2; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0;">Estos son tus datos para iniciar sesión:</p>
            <p style="font-size: 1.2em; font-weight: bold; margin: 5px 0; color: #0056b3;">
              Usuario: ${usuario.usuario}
            </p>
            <small>(Este puede ser tu No. de Control o tu correo institucional)</small>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/login" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Ir a Iniciar Sesión
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 0.9em; color: #777;">Si no realizaste esta acción, por favor, contacta a soporte inmediatamente.</p>
          <p style="font-size: 0.9em; color: #777;">Saludos,<br>El equipo de CHAFATEC</p>
        </div>
      </div>
    `;

    // Enviamos el correo usando la propiedad 'html'
    await sendEmail({ email: usuario.correo, subject: emailSubject, html: emailHtml });

    // Devolvemos un mensaje más específico para el frontend
    res.status(200).json({ message: '¡Éxito! Revisa tu correo electrónico, te hemos enviado tus datos de acceso.' });

  } catch (error) {
    console.error('Error al establecer contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

/**
 * Verifica si un token para establecer contraseña es válido, sin modificarlo.
 * Usado por el frontend para mostrar o no el formulario.
 */
const validarTokenEstablecimiento = async (req, res) => {
  const { token } = req.params;

  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const usuario = await Usuario.findOne({
      where: {
        password_reset_token: hashedToken,
        password_reset_expires: { [Op.gt]: Date.now() }
      }
    });

    // Si no hay usuario o el token expiró
    if (!usuario) {
      return res.status(400).json({ valid: false, message: 'El enlace es inválido o ha expirado.' });
    }

    // Si el usuario ya tiene una contraseña, el enlace ya se usó
    if (usuario.contrasena) {
      return res.status(400).json({ valid: false, message: 'Este enlace ya ha sido utilizado.' });
    }

    // Si pasa todas las validaciones, el token es válido para ser usado
    res.status(200).json({ valid: true });

  } catch (error) {
    res.status(500).json({ valid: false, message: 'Error interno del servidor.' });
  }
};

module.exports = { login, aspiranteLogin, refresh, resetPassword, establecerContrasena, validarTokenEstablecimiento };