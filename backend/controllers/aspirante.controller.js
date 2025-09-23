const { Aspirante, Carrera, Usuario } = require('../models');
const bcrypt = require('bcryptjs');

const getCarreras = async (req, res) => {
  try {
    const carreras = await Carrera.findAll({
      attributes: ['id', 'nombre'] // Solo enviamos los datos necesarios
    });
    res.status(200).json(carreras);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las carreras.' });
  }
};

const solicitarFicha = async (req, res) => {
  // Ahora también recibimos 'password'
  const { nombre_completo, correo, telefono, direccion, carrera_id, password } = req.body;

  try {
    // 1. Validaciones básicas
    const carrera = await Carrera.findByPk(carrera_id);
    if (!carrera) {
      return res.status(404).json({ message: 'La carrera seleccionada no existe.' });
    }

    // 2. Verificar si el correo ya está en uso en la tabla de Usuarios
    const existingUser = await Usuario.findOne({ where: { usuario: correo } });
    if (existingUser) {
      return res.status(409).json({ message: 'Este correo electrónico ya está registrado como un usuario.' });
    }

    // 3. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Crear el registro del Aspirante
    const nuevoAspirante = await Aspirante.create({
      nombre_completo,
      correo,
      telefono,
      direccion,
      carrera_id,
      // Podríamos añadir un estado inicial
      // estado: 'Solicitud Recibida' 
    });

    // 5. Crear el registro del Usuario asociado
    // Usamos el correo como nombre de usuario para el login
    // Y generamos un ID único para el aspirante
    const aspiranteId = `ASP-${correo.split('@')[0].toUpperCase()}-${Date.now().toString().slice(-5)}`;

    await Usuario.create({
      id: aspiranteId, // Asignamos el ID generado
      usuario: correo,
      contrasena: hashedPassword,
      rol: 'aspirante',
      nombre_completo: nombre_completo,
      correo: correo
    });

    res.status(201).json({ message: '¡Felicidades! Tu solicitud y tu cuenta han sido creadas exitosamente.' });
  } catch (error) {
    console.error('Error al solicitar ficha:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

module.exports = { solicitarFicha, getCarreras };