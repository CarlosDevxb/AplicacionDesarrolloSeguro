const { Usuario, Aspirante, Alumno } = require('../models');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
  try {
    // El ID del usuario lo obtenemos del token JWT, que fue verificado por el middleware
    const userId = req.user.id;

    const usuario = await Usuario.findByPk(userId, {
      include: [{
        model: Alumno,
        include: [ 'Carrera' ] // Incluimos la información de la carrera del alumno
      }],
      raw: true,
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Si el usuario es un aspirante, buscamos su información adicional
    if (usuario.rol === 'aspirante') {
      const aspiranteInfo = await Aspirante.findOne({ where: { correo: usuario.correo }, raw: true });
      if (aspiranteInfo) {
        // Combinamos la información del usuario con la del aspirante
        const fullProfile = { ...usuario, ...aspiranteInfo };
        return res.status(200).json(fullProfile);
      }
    }

    // Para otros roles o si no se encuentra info de aspirante, devolvemos solo la info de usuario
    return res.status(200).json(usuario);
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

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre_completo, correo, telefono, direccion } = req.body;

    // Preparamos los datos a actualizar
    const dataToUpdate = { nombre_completo, correo, telefono, direccion, usuario: correo };

    await Usuario.update(dataToUpdate, { where: { id: userId } });

    res.status(200).json({ message: 'Perfil actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El correo electrónico ya está en uso por otro usuario.' });
    }
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contrasena_actual, nueva_contrasena } = req.body;

    // 1. Obtener el usuario con su contraseña
    const user = await Usuario.scope('withPassword').findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 2. Verificar la contraseña actual
    const isPasswordCorrect = await bcrypt.compare(contrasena_actual, user.contrasena);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
    }

    // 3. Hashear y guardar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nueva_contrasena, salt);

    await Usuario.update({ contrasena: hashedPassword }, { where: { id: userId } });

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

module.exports = { getProfile, uploadProfilePicture, updateProfile, changePassword };