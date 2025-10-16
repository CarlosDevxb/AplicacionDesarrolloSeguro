
const { Salon, sequelize } = require('../models');

// Obtener todos los salones
const getSalones = async (req, res) => {
  try {
    const salones = await Salon.findAll({ order: [['nombre', 'ASC']] });
    res.status(200).json(salones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los salones.' });
  }
};


const createSalon = async (req, res) => {
  try {
    // El ID debe ser único y proporcionado en el body, ya que no es autoincremental.
    const { id, clave, nombre, capacidad, tipo, ubicacion, descripcion } = req.body;

    // Crear el nuevo salón con el ID proporcionado
    const nuevoSalon = await Salon.create({ id, clave, nombre, capacidad, tipo, ubicacion, descripcion });
    res.status(201).json({ message: 'Salón creado exitosamente.', salon: nuevoSalon });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: `La clave '${req.body.clave}' o el nombre '${req.body.nombre}' ya existen.` });
    }
    res.status(500).json({ message: 'Error en el servidor al crear el salón.' });
  }
};

// Actualizar un salón
const updateSalon = async (req, res) => {
  try {
    const { id } = req.params;
    // Excluimos la 'clave' del cuerpo de la solicitud para evitar que se actualice.
    const { clave, ...dataToUpdate } = req.body;

    await Salon.update(dataToUpdate, { where: { id } });
    res.status(200).json({ message: 'Salón actualizado correctamente.' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: `El nombre '${req.body.nombre}' ya existe.` });
    }
    res.status(500).json({ message: 'Error al actualizar el salón.' });
  }
};

// Eliminar un salón
const deleteSalon = async (req, res) => {
  try {
    const { id } = req.params;
    await Salon.destroy({ where: { id } });
    res.status(200).json({ message: 'Salón eliminado correctamente.' });
  } catch (error) {
    // Aquí podrías manejar errores de clave foránea si un salón está en uso
    res.status(500).json({ message: 'Error al eliminar el salón.' });
  }
};

module.exports = { getSalones, createSalon, updateSalon, deleteSalon };