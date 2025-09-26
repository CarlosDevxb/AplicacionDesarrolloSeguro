const { Usuario, Alumno, Docente, Administrativo, Carrera } = require('../models');
const bcrypt = require('bcryptjs');

// Crear un nuevo usuario (Alumno, Docente o Administrativo)
const createUser = async (req, res) => {
  const { id, nombre_completo, correo, contrasena, rol, carrera_id, fecha_ingreso } = req.body;

  try {
    // Validar que el ID o correo no existan
    const existingUser = await Usuario.findOne({ where: { id } });
    if (existingUser) {
      return res.status(409).json({ message: `El ID '${id}' ya está en uso.` });
    }
    const existingEmail = await Usuario.findOne({ where: { correo } });
    if (existingEmail) {
      return res.status(409).json({ message: `El correo '${correo}' ya está en uso.` });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Crear el usuario base
    const newUser = await Usuario.create({
      id,
      usuario: correo, // Usamos el correo como 'usuario' para login de aspirantes
      contrasena: hashedPassword,
      nombre_completo,
      correo,
      rol,
      numero_control: id // Guardamos el ID/No. de Control en el campo numero_control
    });

    // Si es un alumno, crear su registro en la tabla 'alumnos'
    if (rol === 'alumno' && carrera_id && fecha_ingreso) {
      await Alumno.create({ id, carrera_id, fecha_ingreso });
    }

    // Aquí podrías añadir lógica para Docente y Administrativo si tienen tablas separadas

    res.status(201).json({ message: `Usuario ${rol} creado exitosamente.` });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error en el servidor al crear el usuario.' });
  }
};

// Buscar un usuario por su ID
const findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Usuario.findByPk(id, {
      include: [{ model: Alumno, as: 'Alumno' }] // Incluimos datos de alumno si existen
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, correo, telefono, direccion } = req.body; // Campos editables
    await Usuario.update({ nombre_completo, correo, telefono, direccion }, { where: { id } });
    res.status(200).json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
};

module.exports = { createUser, findUserById, updateUser };