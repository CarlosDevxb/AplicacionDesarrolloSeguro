// backend/controllers/carrera.controller.js
const { Carrera, Alumno, sequelize } = require('../models');

// Obtener todas las carreras con el conteo de alumnos
const getAllCarreras = async (req, res) => {
  try {
    const carreras = await Carrera.findAll({
      attributes: {
        include: [
          [
            // Contamos los registros en la tabla 'alumnos' asociados a esta carrera
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM alumnos AS a
              WHERE a.carrera_id = \`Carrera\`.\`id\`
            )`),
            'alumnosInscritos'
          ]
        ]
      },
      order: [['nombre', 'ASC']]
    });
    res.status(200).json(carreras);
  } catch (error) {
    console.error('Error al obtener las carreras:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Crear una nueva carrera
const createCarrera = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaCarrera = await Carrera.create({ nombre });
    res.status(201).json(nuevaCarrera);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la carrera.', error: error.message });
  }
};

// Actualizar una carrera existente
const updateCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    await Carrera.update({ nombre }, { where: { id } });
    res.status(200).json({ message: 'Carrera actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la carrera.', error: error.message });
  }
};

module.exports = { getAllCarreras, createCarrera, updateCarrera };