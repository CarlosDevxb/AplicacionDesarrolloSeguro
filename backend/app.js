// backend/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();


app.use(helmet()); // Configura cabeceras HTTP seguras
app.use(cors({ origin: 'http://localhost:4200' })); // Permite peticiones solo desde Angular
app.use(express.json()); // Permite al servidor entender JSON


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});