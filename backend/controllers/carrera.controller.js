const { Carrera } = require('../models');

const getAllCarreras = async (req, res) => {
  try {
    const carreras = await Carrera.findAll();
    res.status(200).json(carreras);
  } catch (error) {
    console.error('Error al obtener las carreras:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

module.exports = { getAllCarreras };