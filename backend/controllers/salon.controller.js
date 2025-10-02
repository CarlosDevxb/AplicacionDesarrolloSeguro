
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
  const t = await sequelize.transaction(); // Iniciar transacción
  try {
    const { clave, nombre, capacidad, tipo, ubicacion, descripcion } = req.body;

    // 1. Encontrar el ID máximo actual dentro de la transacción
    const maxIdResult = await Salon.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('id')), 'maxId']],
      raw: true,
      transaction: t
    });
    const newId = (maxIdResult && maxIdResult.maxId) ? maxIdResult.maxId + 1 : 1;

    // 2. Crear el nuevo salón con el ID calculado
    const nuevoSalon = await Salon.create({ id: newId, clave, nombre, capacidad, tipo, ubicacion, descripcion }, { transaction: t });

    await t.commit(); // Confirmar la transacción
    res.status(201).json({ message: 'Salón creado exitosamente.', salon: nuevoSalon });
  } catch (error) {
    await t.rollback(); // Revertir la transacción en caso de error
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