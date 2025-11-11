const { Usuario, Aspirante, Alumno } = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('./email.js');

const getProfile = async (req, res) => {
  try {
    // El ID del usuario lo obtenemos del token JWT, que fue verificado por el middleware
    const userId = req.user.id;

    const usuario = await Usuario.findByPk(userId, {
      include: [{
        model: Alumno,
        include: ['Carrera'] // Incluimos la información de la carrera del alumno
      }]
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Si el usuario es un aspirante, buscamos su información adicional
    const plainUser = usuario.toJSON(); // Convertimos la instancia de Sequelize a un objeto plano

    if (plainUser.rol === 'aspirante') {
      const aspiranteInfo = await Aspirante.findOne({ where: { correo: usuario.correo }, raw: true });
      if (aspiranteInfo) {
        // Combinamos la información del usuario con la del aspirante
        const fullProfile = { ...plainUser, ...aspiranteInfo };
        return res.status(200).json(fullProfile);
      }
    }

    // Para otros roles o si no se encuentra info de aspirante, devolvemos solo la info de usuario
    return res.status(200).json(plainUser);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    // Construimos la URL completa para acceder a la imagen desde el frontend
    const filePath = `http://localhost:3000/uploads/profiles/${req.file.filename}`;

    // Actualizamos la ruta de la foto en la base de datos
    await Usuario.update({ foto: filePath }, { where: { id: userId } });

    res.status(200).json({
      message: 'Foto de perfil actualizada correctamente.',
      filePath: filePath
    });

  } catch (error) {
    console.error('Error al subir la foto de perfil:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

/**
 * FASE 1: Solicita un código de verificación para actualizar datos.
 * Verifica la contraseña actual y envía un código al correo del usuario.
 */
const requestUpdateCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contrasena_actual } = req.body;

    if (!contrasena_actual) {
      return res.status(400).json({ message: 'Se requiere tu contraseña actual para solicitar un código.' });
    }

    // 1. Verificar la contraseña actual
    const user = await Usuario.scope('withPassword').findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const isPasswordCorrect = await bcrypt.compare(contrasena_actual, user.contrasena);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
    }

    // 2. Generar y guardar el código de un solo uso
    const updateCode = crypto.randomInt(100000, 999999).toString(); // Código de 6 dígitos
    const codeExpires = Date.now() + 5 * 60 * 1000; // 5 minutos de expiración

    user.update_code = await bcrypt.hash(updateCode, 10); // Guardamos el hash del código
    user.update_code_expires = codeExpires;
    await user.save();

    // 3. Enviar el código por correo electrónico
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Código de Verificación de CHAFATEC</h2>
        <p>Hola ${user.nombre_completo},</p>
        <p>Has solicitado realizar cambios en tu cuenta. Usa el siguiente código para confirmar la acción. Es válido por 5 minutos.</p>
        <p style="font-size: 2em; font-weight: bold; letter-spacing: 5px; margin: 20px 0; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
          ${updateCode}
        </p>
        <p style="color: #777; font-size: 0.9em;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
      </div>
    `;

    await sendEmail({
      email: user.correo,
      subject: 'Tu código de verificación de CHAFATEC',
      html: emailHtml,
    });

    res.status(200).json({ message: 'Se ha enviado un código de verificación a tu correo electrónico.' });

  } catch (error) {
    console.error('Error al solicitar el código de actualización:', error);
    res.status(500).json({ message: 'Error en el servidor al solicitar el código.' });
  }
};



/**
 * FASE 2: Cambia la contraseña del usuario usando el código de verificación.
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    // Ahora esperamos el código y la nueva contraseña
    const { update_code, nueva_contrasena } = req.body;

    if (!update_code || !nueva_contrasena) {
      return res.status(400).json({ message: 'Se requiere el código de verificación y la nueva contraseña.' });
    }

    // 1. Buscar al usuario y su código
    const user = await Usuario.findByPk(userId);
    if (!user || !user.update_code || !user.update_code_expires) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 2. Verificar si el código ha expirado
    if (Date.now() > user.update_code_expires) {
      user.update_code = null;
      user.update_code_expires = null;
      await user.save();
      return res.status(410).json({ message: 'El código de verificación ha expirado. Por favor, solicita uno nuevo.' });
    }

    // 3. Verificar si el código es correcto
    const isCodeCorrect = await bcrypt.compare(update_code, user.update_code);
    if (!isCodeCorrect) {
      return res.status(401).json({ message: 'El código de verificación es incorrecto.' });
    }

    // 4. Hashear y guardar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nueva_contrasena, salt);
    user.contrasena = hashedPassword;
    user.update_code = null; // Invalidar el código después de su uso
    user.update_code_expires = null;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

/**
 * FASE 2: Actualiza el perfil del usuario usando el código de verificación.
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // Ahora esperamos el código en lugar de la contraseña actual
    const { nombre_completo, correo, telefono, direccion, update_code } = req.body;

    if (!update_code) {
      return res.status(400).json({ message: 'Se requiere el código de verificación.' });
    }

    // 1. Buscar al usuario y su código
    const user = await Usuario.findByPk(userId);
    if (!user || !user.update_code || !user.update_code_expires) {
      return res.status(400).json({ message: 'No hay una solicitud de cambio activa. Por favor, solicita un nuevo código.' });
    }

    // 2. Verificar si el código ha expirado
    if (Date.now() > user.update_code_expires) {
      user.update_code = null;
      user.update_code_expires = null;
      await user.save();
      return res.status(410).json({ message: 'El código de verificación ha expirado. Por favor, solicita uno nuevo.' });
    }

    // 3. Verificar si el código es correcto
    const isCodeCorrect = await bcrypt.compare(update_code, user.update_code);
    if (!isCodeCorrect) {
      return res.status(401).json({ message: 'El código de verificación es incorrecto.' });
    }

    // 4. Si el código es correcto, proceder con la actualización
    const dataToUpdate = { nombre_completo, correo, telefono, direccion, usuario: correo };
    await Usuario.update(dataToUpdate, { where: { id: userId } });

    // 5. Invalidar el código después de su uso
    user.update_code = null;
    user.update_code_expires = null;
    await user.save();

    res.status(200).json({ message: 'Perfil actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El correo electrónico ya está en uso por otro usuario.' });
    }
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

module.exports = { getProfile, uploadProfilePicture, requestUpdateCode, updateProfile, changePassword };