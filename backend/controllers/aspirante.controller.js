const { Aspirante, Carrera } = require('../models');

const solicitarFicha = async (req, res) => {
  const { nombre_completo, correo, telefono, direccion, carrera_id } = req.body;

  try {
    // Opcional: Verificar si la carrera existe
    const carrera = await Carrera.findByPk(carrera_id);
    if (!carrera) {
      return res.status(404).json({ message: 'La carrera seleccionada no existe.' });
    }

    // Opcional: Verificar si ya existe una solicitud con el mismo correo
    const existingAspirante = await Aspirante.findOne({ where: { correo } });
    if (existingAspirante) {
      return res.status(409).json({ message: 'Ya existe una solicitud con este correo electrónico.' });
    }

    const nuevoAspirante = await Aspirante.create({
      nombre_completo,
      correo,
      telefono,
      direccion,
      carrera_id,
    });

    res.status(201).json({ message: 'Solicitud de ficha enviada exitosamente.', aspirante: nuevoAspirante });
  } catch (error) {
    console.error('Error al solicitar ficha:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

module.exports = { solicitarFicha };