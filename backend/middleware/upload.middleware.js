const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/profiles/';

// Nos aseguramos de que el directorio de subida exista.
// { recursive: true } crea las carpetas anidadas si no existen (ej: 'uploads' y luego 'profiles').
fs.mkdirSync(uploadDir, { recursive: true });

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  // Dónde se guardarán los archivos
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // Cómo se nombrará cada archivo
  filename: (req, file, cb) => {
    // Usamos el ID del usuario (del token) y la fecha para un nombre único
    const uniqueSuffix = req.user.id + '-' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('¡Solo se permiten archivos de imagen!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;