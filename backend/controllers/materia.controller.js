const { Materia, Carrera, MateriaPorCarrera, sequelize } = require('../models');
const { Op } = require('sequelize');

const createMateria = async (req, res) => {
  // carrera_ids será un array de IDs de las carreras seleccionadas
  const { id, nombre, creditos, semestre, carrera_ids } = req.body;

  if (!carrera_ids || carrera_ids.length === 0 || !semestre) {
    return res.status(400).json({ message: 'Debes seleccionar al menos una carrera.' });
  }

  const t = await sequelize.transaction();

  try {
    // 1. Crear la materia
    const nuevaMateria = await Materia.create({ id, nombre, creditos }, { transaction: t });

    // 2. Crear las asociaciones en la tabla intermedia manualmente
    const asociaciones = carrera_ids.map(carrera_id => ({
      materia_id: nuevaMateria.id,
      carrera_id: carrera_id,
      semestre: semestre
    }));

    await MateriaPorCarrera.bulkCreate(asociaciones, { transaction: t });

    // Si todo fue bien, confirmamos la transacción
    await t.commit();
    res.status(201).json({ message: `Materia '${nombre}' creada y asociada a ${carrera_ids.length} carrera(s) en el ${semestre}° semestre.` });

  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: `La clave o nombre de la materia ya existe.` });
    }
    console.error('Error al crear materia:', error);
    res.status(500).json({ message: 'Error en el servidor al crear la materia.' });
  }
};

const findMateriaByName = async (req, res) => {
  // Búsqueda por nombre (parcial e insensible a mayúsculas)
  const { nombre } = req.query;
  const materias = await Materia.findAll({
    where: { nombre: { [Op.like]: `%${nombre}%` } },
    include: [{ model: Carrera, attributes: ['id', 'nombre'], through: { attributes: [] } }] // Incluye las carreras asociadas
  });
  res.status(200).json(materias);
};

module.exports = { createMateria, findMateriaByName };