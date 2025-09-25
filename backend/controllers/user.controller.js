const { Usuario, Aspirante } = require('../models');

const getProfile = async (req, res) => {
  try {
    // El ID del usuario lo obtenemos del token JWT, que fue verificado por el middleware
    const userId = req.user.id;

    const usuario = await Usuario.findByPk(userId, {
      // Usamos raw:true para obtener un objeto plano de JS en lugar de una instancia de Sequelize
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

module.exports = { getProfile, uploadProfilePicture };