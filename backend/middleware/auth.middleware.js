const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // No hay token, no autorizado
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.sendStatus(403); // Token no válido, prohibido
    }
    req.user = userPayload; // Guardamos el payload del token en el objeto request
    next();
  });
};

module.exports = { authenticateToken };