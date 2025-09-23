const { Usuario, Aspirante } = require('../models');

// Función para generar un número de control único.
// Ejemplo: 24 (año) + 0001 (secuencial) = "240001"
const generarNumeroControl = async () => {
  const anio = new Date().getFullYear().toString().slice(-2);
  const ultimoAlumno = await Usuario.findOne({
    where: { rol: 'alumno' },
    order: [['numero_control', 'DESC']],
  });

  let secuencial = 1;
  if (ultimoAlumno && ultimoAlumno.numero_control.startsWith(anio)) {
    secuencial = parseInt(ultimoAlumno.numero_control.slice(2)) + 1;
  }

  return `${anio}${secuencial.toString().padStart(4, '0')}`;
};

const promoverAspirante = async (req, res) => {
  const { id } = req.params; // El ID del usuario aspirante (ej: ASP-NONA-12345)

  try {
    const aspiranteUsuario = await Usuario.findByPk(id);
    if (!aspiranteUsuario || aspiranteUsuario.rol !== 'aspirante') {
      return res.status(404).json({ message: 'Usuario aspirante no encontrado.' });
    }

    const nuevoNumeroControl = await generarNumeroControl();

    // Actualizamos el rol y el campo 'usuario' con el nuevo número de control
    await aspiranteUsuario.update({
      rol: 'alumno',
      usuario: nuevoNumeroControl, // El número de control se convierte en el nuevo 'usuario' para el login
      numero_control: nuevoNumeroControl, // También lo guardamos en su campo dedicado por si se necesita
    });

    res.status(200).json({ message: 'Aspirante promovido a alumno exitosamente.', alumno: aspiranteUsuario });
  } catch (error) {
    console.error('Error al promover aspirante:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

module.exports = { promoverAspirante };