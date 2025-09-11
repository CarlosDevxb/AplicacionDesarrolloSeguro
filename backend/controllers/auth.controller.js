// backend/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Usuario, Rol } = require('../models'); // Importa también el modelo Rol


const login = async (req, res) => {
  const { email, password } = req.body;
 console.log("RECIBIDO DEL FRONTEND:", { email, password });
  try {
    // 1. Buscar al usuario por email, incluyendo el password usando el "scope"
   const user = await Usuario.scope('withPassword').findOne({ where: { email } }); 

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 2. Comparar la contraseña enviada con la hasheada en la BD
 
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // 3. Si todo es correcto, crear el payload para el token
    const payload = {
      id: user.id,
      role: user.role,
    };

    // 4. Firmar el token con la clave secreta y establecer una expiración
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    // 5. Enviar el token al cliente
    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};


const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // 1. Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está en uso.' }); // 409 Conflict
    }

    // 2. Buscar el rol de 'cliente'
    const clienteRol = await Rol.findOne({ where: { nombre: 'cliente' } });
    if (!clienteRol) {
      return res.status(500).json({ message: 'El rol de cliente no se encuentra configurado.' });
    }

    // 3. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de rondas de salting

    // 4. Crear el nuevo usuario
    const newUser = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      idRol: clienteRol.idRol,
    });

    // 5. Devolver una respuesta exitosa (sin el password)
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({ user: userResponse, message: 'Usuario registrado exitosamente.' });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Aquí podrías añadir la función de 'register' en el futuro OWASAP10
module.exports = { login, register};