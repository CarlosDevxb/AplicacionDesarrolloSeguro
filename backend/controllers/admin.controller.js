const { Usuario, Alumno, Docente, Administrativo, Carrera, sequelize } = require('../models'); // Importamos sequelize
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('./email.js'); // Importamos la utilidad para enviar correos


// Crear un nuevo usuario (Alumno, Docente o Administrativo)
const createUser = async (req, res) => {
  const { id, nombre_completo, correo, rol, carrera_id, fecha_ingreso } = req.body;
  const t = await sequelize.transaction(); // Iniciar transacción (Forma correcta en v6)

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

    // Crear el usuario base
    const newUser = await Usuario.create({
      id,
      usuario: id, // Usamos el ID/No. de Control como 'usuario' para el login
      contrasena: null, // La contraseña se establecerá por el usuario
      nombre_completo,
      correo,
      rol,
      numero_control: id // Guardamos el ID/No. de Control en el campo numero_control
    }, { transaction: t });

    // Si es un alumno, crear su registro en la tabla 'alumnos'
    if (rol === 'alumno' && carrera_id && fecha_ingreso) {
      // --- Lógica para calcular el semestre ---
      const fechaIngreso = new Date(fecha_ingreso);
      const fechaActual = new Date();

      // Se calcula la diferencia de años
      const aniosDiferencia = fechaActual.getFullYear() - fechaIngreso.getFullYear();

      // Se determina el periodo del año (1 para Ene-Jul, 2 para Ago-Dic)
      const periodoIngreso = fechaIngreso.getMonth() < 7 ? 1 : 2;
      const periodoActual = fechaActual.getMonth() < 7 ? 1 : 2;

      // Se calculan los semestres base por los años transcurridos
      let semestres = aniosDiferencia * 2;

      // Se ajusta el semestre según el periodo
      semestres += (periodoActual - periodoIngreso) + 1;

      await Alumno.create({ id, carrera_id, fecha_ingreso, semestre: semestres }, { transaction: t });
    } else if (rol === 'docente') {
      await Docente.create({ id }, { transaction: t });
    } else if (rol === 'administrativo') {
      await Administrativo.create({ id }, { transaction:t });
    }

    // --- Lógica para enviar correo de establecimiento de contraseña ---

    // 1. Generar un token único para el usuario
    const resetToken = crypto.randomBytes(32).toString('hex');

    // 2. Hashear el token y guardarlo en la base de datos
    newUser.password_reset_token = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3. Establecer una fecha de expiración (ej. 24 horas)
    newUser.password_reset_expires = Date.now() + 24 * 60 * 60 * 1000;

    await newUser.save({ transaction: t });

    // 4. Construir la URL y enviar el correo
    const resetURL = `${process.env.FRONTEND_URL}/establecer-contrasena/${resetToken}`;
    const message = `
      ¡Bienvenido a CHAFATEC!
      Has sido registrado en nuestra plataforma. Para completar tu registro y acceder a tu cuenta,
      por favor, establece tu contraseña personal haciendo clic en el siguiente enlace:
      \n\n${resetURL}\n\n
      Si no has solicitado este registro, por favor ignora este correo. El enlace es válido por 24 horas.
    `;

    await sendEmail({
      email: newUser.correo,
      subject: 'Bienvenido a CHAFATEC - Establece tu contraseña',
      message
    });

    await t.commit(); // Confirmar la transacción solo si todo fue exitoso

    res.status(201).json({ message: `Usuario ${rol} creado. Se ha enviado un correo para establecer la contraseña.` });

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
    // Obtenemos todos los datos del cuerpo de la solicitud
    const { nombre_completo, correo, telefono, direccion, rol, estado, estatus } = req.body;

    // 1. Preparamos los datos para la tabla 'usuarios'
    const userData = {
      nombre_completo,
      correo,
      telefono,
      direccion,
      rol,
      estado // Aseguramos que el estado se incluya en la actualización
    };
console.log(userData);

    // 2. Actualizamos la tabla 'usuarios'
    await Usuario.update(userData, { where: { id } });

    // 3. Si el usuario es un alumno y se ha proporcionado un estatus académico, lo actualizamos
    if (rol === 'alumno' && estatus) {
      await Alumno.update({ estatus }, { where: { id } });
    }

    res.status(200).json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
};

module.exports = { createUser, findUserById, updateUser };